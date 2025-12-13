// backend/src/controllers/task.controller.js
import { asyncHandler } from '../utils/asyncHandler.js';
import { taskService } from '../services/task.service.js';
import { analyticsService } from '../services/analytics.service.js';

export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.create(
    req.params.projectId,
    req.user.id,
    req.body,
    req.user.subscription?.plan || 'FREE'
  );
  
  // Invalidate analytics cache
  analyticsService.invalidateUserCache(req.user.id);
  
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getByProject(req.params.projectId, req.user.id);
  
  res.json({
    success: true,
    data: tasks
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.update(req.params.id, req.user.id, req.body);
  
  // Invalidate analytics cache
  analyticsService.invalidateUserCache(req.user.id);
  
  res.json({
    success: true,
    message: 'Task updated successfully',
    data: task
  });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await taskService.updateStatus(
    req.params.id,
    req.user.id,
    req.body.status
  );
  
  // Invalidate analytics cache
  analyticsService.invalidateUserCache(req.user.id);
  
  res.json({
    success: true,
    message: 'Task status updated',
    data: task
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  await taskService.delete(req.params.id, req.user.id);
  
  // Invalidate analytics cache
  analyticsService.invalidateUserCache(req.user.id);
  
  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});

export const reorderTasks = asyncHandler(async (req, res) => {
  await taskService.reorder(
    req.params.projectId,
    req.user.id,
    req.body.taskIds
  );
  
  res.json({
    success: true,
    message: 'Tasks reordered successfully'
  });
});