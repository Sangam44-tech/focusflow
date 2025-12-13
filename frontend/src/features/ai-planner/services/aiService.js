// frontend/src/features/ai-planner/services/aiService.js
import api from '../../../services/api';

export const aiService = {
  generatePlan: async (data) => {
    const response = await api.post('/ai/generate', data);
    return response.data.data;
  },

  getPlan: async (id) => {
    const response = await api.get(`/ai/plans/${id}`);
    return response.data.data;
  },

  getUserPlans: async (limit = 10) => {
    const response = await api.get(`/ai/plans?limit=${limit}`);
    return response.data.data;
  },

  importPlan: async (planId, projectName) => {
    const response = await api.post('/ai/import', { planId, projectName });
    return response.data.data;
  },

  deletePlan: async (id) => {
    const response = await api.delete(`/ai/plans/${id}`);
    return response.data;
  },
};