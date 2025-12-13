// backend/src/services/task.service.js
import { taskRepository } from '../repositories/task.repository.js';
import { projectRepository } from '../repositories/project.repository.js';
import { ApiError } from '../utils/ApiError.js';

export const taskService = {
  create: async (projectId, userId, data, userPlan = 'FREE') => {
    // Verify project ownership
    const project = await projectRepository.findById(projectId, userId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    return taskRepository.create({
      ...data,
      projectId
    });
  },
  
  getByProject: async (projectId, userId) => {
    // Verify project ownership
    const project = await projectRepository.findById(projectId, userId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    return taskRepository.findByProject(projectId);
  },
  
  update: async (taskId, userId, data) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    // Verify ownership through project
    if (task.project.userId !== userId) {
      throw new ApiError(403, 'Not authorized');
    }
    
    return taskRepository.update(taskId, data);
  },
  
  updateStatus: async (taskId, userId, status) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    if (task.project.userId !== userId) {
      throw new ApiError(403, 'Not authorized');
    }
    
    return taskRepository.updateStatus(taskId, status);
  },
  
  delete: async (taskId, userId) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }
    
    if (task.project.userId !== userId) {
      throw new ApiError(403, 'Not authorized');
    }
    
    return taskRepository.delete(taskId);
  },
  
  reorder: async (projectId, userId, taskIds) => {
    const project = await projectRepository.findById(projectId, userId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    return taskRepository.reorder(projectId, taskIds);
  }
};