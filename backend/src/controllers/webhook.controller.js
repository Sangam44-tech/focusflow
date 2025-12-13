// controllers/webhook.controller.js

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
  }
  
  res.json({ received: true });
};

const handleCheckoutComplete = async (session) => {
  const userId = session.metadata.userId;
  
  await prisma.subscription.update({
    where: { userId },
    data: {
      plan: 'PREMIUM',
      status: 'ACTIVE',
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      currentPeriodEnd: new Date(session.expires_at * 1000),
    }
  });
};