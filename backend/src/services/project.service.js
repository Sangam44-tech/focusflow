// backend/src/services/project.service.js
import { projectRepository } from '../repositories/project.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { ProjectStatus } from '@prisma/client';

export const projectService = {
  create: async (userId, data, userPlan = 'FREE') => {
    return projectRepository.create({
      ...data,
      userId
    });
  },
  
  getAll: async (userId) => {
    return projectRepository.findAllByUser(userId);
  },
  
  getById: async (id, userId) => {
    const project = await projectRepository.findById(id, userId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    return project;
  },
  
  update: async (id, userId, data) => {
    // Verify ownership
    const project = await projectRepository.findById(id, userId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    return projectRepository.update(id, userId, data);
  },
  
  delete: async (id, userId) => {
    // Verify ownership
    const project = await projectRepository.findById(id, userId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    return projectRepository.delete(id);
  },
  
  getStats: async (userId) => {
    return projectRepository.getStats(userId);
  },
  
  updateStatus: async (id, userId, status) => {
    // Verify ownership
    const project = await projectRepository.findById(id, userId);
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    
    // Validate status using Prisma enum
    if (!Object.values(ProjectStatus).includes(status)) {
      throw new ApiError(400, 'Invalid project status');
    }
    
    return projectRepository.update(id, userId, { status });
  }
};