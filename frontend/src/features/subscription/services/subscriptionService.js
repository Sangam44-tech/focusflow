// frontend/src/features/subscription/services/subscriptionService.js
import api from '../../../services/api';

export const subscriptionService = {
  getSubscription: async () => {
    const response = await api.get('/subscription');
    return response.data.data;
  },

  createCheckoutSession: async () => {
    const response = await api.post('/subscription/checkout');
    return response.data.data;
  },

  createPortalSession: async () => {
    const response = await api.post('/subscription/portal');
    return response.data.data;
  },

  cancelSubscription: async () => {
    const response = await api.post('/subscription/cancel');
    return response.data;
  },

  resumeSubscription: async () => {
    const response = await api.post('/subscription/resume');
    return response.data;
  },
};