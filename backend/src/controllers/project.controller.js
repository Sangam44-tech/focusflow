
// backend/src/controllers/project.controller.js
import { asyncHandler } from '../utils/asyncHandler.js';
import { projectService } from '../services/project.service.js';
import { analyticsService } from '../services/analytics.service.js';

export const createProject = asyncHandler(async (req, res) => {
  console.log('Creating project:', {
    userId: req.user.id,
    body: req.body,
    subscription: req.user.subscription
  });
  
  const project = await projectService.create(
    req.user.id,
    req.body,
    req.user.subscription?.plan || 'FREE'
  );
  
  console.log('Project created:', project);
  
  // Invalidate analytics cache for real-time updates
  analyticsService.invalidateUserCache(req.user.id);
  
  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: project
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getAll(req.user.id);
  
  res.json({
    success: true,
    data: projects
  });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getById(req.params.id, req.user.id);
  
  res.json({
    success: true,
    data: project
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.update(
    req.params.id,
    req.user.id,
    req.body
  );
  
  // Invalidate analytics cache for real-time updates
  analyticsService.invalidateUserCache(req.user.id);
  
  res.json({
    success: true,
    message: 'Project updated successfully',
    data: project
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.delete(req.params.id, req.user.id);
  
  // Invalidate analytics cache for real-time updates
  analyticsService.invalidateUserCache(req.user.id);
  
  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
});

export const getProjectStats = asyncHandler(async (req, res) => {
  const stats = await projectService.getStats(req.user.id);
  
  res.json({
    success: true,
    data: stats
  });
});

export const updateProjectStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const project = await projectService.updateStatus(
    req.params.id,
    req.user.id,
    status
  );
  
  // Invalidate analytics cache for real-time updates
  analyticsService.invalidateUserCache(req.user.id);
  
  res.json({
    success: true,
    message: 'Project status updated',
    data: project
  });
});