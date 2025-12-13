// frontend/src/features/analytics/services/analyticsService.js
import api from '../../../services/api';

export const analyticsService = {
  getFullAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data.data;
  },

  getOverview: async () => {
    const response = await api.get('/analytics/overview');
    return response.data.data;
  },

  getCompletionTrend: async (days = 30) => {
    const response = await api.get(`/analytics/trend?days=${days}`);
    return response.data.data;
  },

  getActivityHeatmap: async (months = 6) => {
    const response = await api.get(`/analytics/heatmap?months=${months}`);
    return response.data.data;
  },

  getStreak: async () => {
    const response = await api.get('/analytics/streak');
    return response.data.data;
  },

  getHealthScore: async () => {
    const response = await api.get('/analytics/health');
    return response.data.data;
  },

  getUpcomingDeadlines: async () => {
    const response = await api.get('/analytics/deadlines');
    return response.data.data;
  },

  getProductivityByDay: async () => {
    const response = await api.get('/analytics/productivity');
    return response.data.data;
  },
};