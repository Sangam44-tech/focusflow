// backend/src/config/stripe.js
// Payment features disabled

export const stripe = null;

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    projectLimit: Infinity,      // No limits for now
    taskLimitPerProject: Infinity,
    aiGenerationsPerDay: Infinity,
    features: [
      'Unlimited projects',
      'Unlimited tasks',
      'AI-powered planning',
      'Analytics',
    ],
  },
  PREMIUM: {
    name: 'Premium',
    price: 0,
    projectLimit: Infinity,
    taskLimitPerProject: Infinity,
    aiGenerationsPerDay: Infinity,
    features: [
      'Unlimited projects',
      'Unlimited tasks',
      'AI-powered planning',
      'Advanced analytics',
    ],
  },
};

export const getPlanConfig = (plan) => {
  return PLANS.FREE; // Everyone gets full access for now
};

export const checkPlanLimit = () => true; // No limits

export default stripe;