// backend/src/repositories/subscription.repository.js
import prisma from '../config/database.js';

export const subscriptionRepository = {
  findByUserId: async (userId) => {
    return prisma.subscription.findUnique({
      where: { userId },
    });
  },

  update: async (userId, data) => {
    return prisma.subscription.update({
      where: { userId },
      data,
    });
  },

  findByStripeCustomerId: async (stripeCustomerId) => {
    return prisma.subscription.findFirst({
      where: { stripeCustomerId },
      include: { user: true },
    });
  },

  findByStripeSubscriptionId: async (stripeSubscriptionId) => {
    return prisma.subscription.findFirst({
      where: { stripeSubscriptionId },
      include: { user: true },
    });
  },
};