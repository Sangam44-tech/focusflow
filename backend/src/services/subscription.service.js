// backend/src/services/subscription.service.js
import { stripe, PLANS } from '../config/stripe.js';
import { subscriptionRepository } from '../repositories/subscription.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

export const subscriptionService = {
  getSubscription: async (userId) => {
    const subscription = await subscriptionRepository.findByUserId(userId);
    if (!subscription) {
      throw new ApiError(404, 'Subscription not found');
    }
    
    return {
      ...subscription,
      planDetails: PLANS[subscription.plan],
    };
  },

  createCheckoutSession: async (userId, userEmail) => {
    const subscription = await subscriptionRepository.findByUserId(userId);

    // Check if already premium
    if (subscription?.plan === 'PREMIUM' && subscription?.status === 'ACTIVE') {
      throw new ApiError(400, 'Already subscribed to Premium');
    }

    // Create or get Stripe customer
    let customerId = subscription?.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
      });
      customerId = customer.id;

      await subscriptionRepository.update(userId, {
        stripeCustomerId: customerId,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLANS.PREMIUM.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${config.frontendUrl}/settings?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${config.frontendUrl}/settings?canceled=true`,
      metadata: { userId },
    });

    return { sessionId: session.id, url: session.url };
  },

  createPortalSession: async (userId) => {
    const subscription = await subscriptionRepository.findByUserId(userId);

    if (!subscription?.stripeCustomerId) {
      throw new ApiError(400, 'No billing information found');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${config.frontendUrl}/settings`,
    });

    return { url: session.url };
  },

  cancelSubscription: async (userId) => {
    const subscription = await subscriptionRepository.findByUserId(userId);

    if (!subscription?.stripeSubscriptionId) {
      throw new ApiError(400, 'No active subscription found');
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await subscriptionRepository.update(userId, {
      cancelAtPeriodEnd: true,
    });

    return { message: 'Subscription will be canceled at the end of the billing period' };
  },

  resumeSubscription: async (userId) => {
    const subscription = await subscriptionRepository.findByUserId(userId);

    if (!subscription?.stripeSubscriptionId) {
      throw new ApiError(400, 'No subscription found');
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    await subscriptionRepository.update(userId, {
      cancelAtPeriodEnd: false,
    });

    return { message: 'Subscription resumed' };
  },

  // Webhook handlers
  handleCheckoutCompleted: async (session) => {
    const userId = session.metadata.userId;
    const subscriptionId = session.subscription;

    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

    await subscriptionRepository.update(userId, {
      plan: 'PREMIUM',
      status: 'ACTIVE',
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: session.customer,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: false,
    });
  },

  handleSubscriptionUpdated: async (subscription) => {
    const dbSubscription = await subscriptionRepository.findByStripeSubscriptionId(
      subscription.id
    );

    if (!dbSubscription) return;

    const status = subscription.status === 'active' ? 'ACTIVE' :
                   subscription.status === 'past_due' ? 'PAST_DUE' :
                   subscription.status === 'canceled' ? 'CANCELED' : 'ACTIVE';

    await subscriptionRepository.update(dbSubscription.userId, {
      status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  },

  handleSubscriptionDeleted: async (subscription) => {
    const dbSubscription = await subscriptionRepository.findByStripeSubscriptionId(
      subscription.id
    );

    if (!dbSubscription) return;

    await subscriptionRepository.update(dbSubscription.userId, {
      plan: 'FREE',
      status: 'CANCELED',
      stripeSubscriptionId: null,
      currentPeriodStart: null,
      currentPeriodEnd: null,
    });
  },

  handlePaymentFailed: async (invoice) => {
    const subscription = await subscriptionRepository.findByStripeCustomerId(
      invoice.customer
    );

    if (!subscription) return;

    await subscriptionRepository.update(subscription.userId, {
      status: 'PAST_DUE',
    });

    // TODO: Send email notification about payment failure
  },
};