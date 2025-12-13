// frontend/src/features/tasks/services/taskService.js
import api from '../../../services/api';

export const taskService = {
  getByProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data.data;
  },
  
  create: async (projectId, data) => {
    const response = await api.post(`/projects/${projectId}/tasks`, data);
    return response.data.data;
  },
  
  update: async (taskId, data) => {
    const response = await api.put(`/tasks/${taskId}`, data);
    return response.data.data;
  },
  
  updateStatus: async (taskId, status) => {
    const response = await api.patch(`/tasks/${taskId}/status`, { status });
    return response.data.data;
  },
  
  delete: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },
  
  reorder: async (projectId, taskIds) => {
    const response = await api.post(`/projects/${projectId}/tasks/reorder`, { taskIds });
    return response.data;
  }
};