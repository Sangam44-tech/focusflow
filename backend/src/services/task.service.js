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
    return taskRepository.update(taskId, data, userId);
  },
  
  updateStatus: async (taskId, userId, status) => {
    const task = await taskRepository.updateStatus(taskId, status, userId);
    
    // If task is completed, check if project should be marked as completed
    if (status === 'COMPLETED') {
      await checkProjectCompletion(task.projectId);
    }
    
    return task;
  },
  
  delete: async (taskId, userId) => {
    return taskRepository.delete(taskId, userId);
  },
  
  reorder: async (projectId, userId, taskIds) => {
    const project = await projectRepository.findById(projectId, userId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    return taskRepository.reorder(projectId, taskIds);
  }
};

// Helper function to check if project should be marked as completed
const checkProjectCompletion = async (projectId) => {
  try {
    const tasks = await taskRepository.findByProject(projectId);
    
    // If project has tasks and all are completed, mark project as completed
    if (tasks.length > 0 && tasks.every(task => task.status === 'COMPLETED')) {
      const project = await projectRepository.findById(projectId);
      if (project && project.status !== 'COMPLETED') {
        await projectRepository.update(projectId, project.userId, { status: 'COMPLETED' });
      }
    }
  } catch (error) {
    console.error('Error checking project completion:', error);
    // Don't throw error to avoid breaking task update
  }
};