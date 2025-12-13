// backend/src/controllers/analytics.controller.js
import { asyncHandler } from '../utils/asyncHandler.js';
import { analyticsService } from '../services/analytics.service.js';
import prisma from '../config/database.js';

export const getOverview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const data = await analyticsService.getOverviewStats(userId);
  
  res.json({
    success: true,
    data
  });
});

export const getCompletionTrend = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const days = parseInt(req.query.days) || 30;
  const data = await analyticsService.getCompletionTrend(userId, days);
  
  res.json({ success: true, data });
});

export const getActivityHeatmap = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const months = parseInt(req.query.months) || 6;
  const data = await analyticsService.getActivityHeatmap(userId, months);
  
  res.json({ success: true, data });
});

export const getStreak = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const overview = await analyticsService.getOverviewStats(userId);
  
  res.json({ 
    success: true, 
    data: { 
      current: overview.currentStreak, 
      best: overview.bestStreak 
    } 
  });
});

export const getHealthScore = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const data = await analyticsService.getHealthScore(userId);
  
  res.json({ success: true, data });
});

export const getUpcomingDeadlines = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const tasks = await prisma.task.findMany({
    where: {
      project: { userId },
      status: { not: 'COMPLETED' },
      dueDate: {
        lte: nextWeek,
        gte: new Date()
      }
    },
    include: { project: true },
    orderBy: { dueDate: 'asc' }
  });
  
  res.json({ success: true, data: tasks });
});

export const getProductivityByDay = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  // Get task completion data by day of week
  const taskLogs = await prisma.taskLog.findMany({
    where: {
      task: { project: { userId } },
      newStatus: 'COMPLETED',
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    },
    select: { createdAt: true }
  });
  
  const dayStats = {
    Monday: { completed: 0, created: 0 },
    Tuesday: { completed: 0, created: 0 },
    Wednesday: { completed: 0, created: 0 },
    Thursday: { completed: 0, created: 0 },
    Friday: { completed: 0, created: 0 },
    Saturday: { completed: 0, created: 0 },
    Sunday: { completed: 0, created: 0 }
  };
  
  taskLogs.forEach(log => {
    const dayName = log.createdAt.toLocaleDateString('en-US', { weekday: 'long' });
    if (dayStats[dayName]) {
      dayStats[dayName].completed++;
    }
  });
  
  // Get task creation data
  const createdTasks = await prisma.task.findMany({
    where: {
      project: { userId },
      createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    },
    select: { createdAt: true }
  });
  
  createdTasks.forEach(task => {
    const dayName = task.createdAt.toLocaleDateString('en-US', { weekday: 'long' });
    if (dayStats[dayName]) {
      dayStats[dayName].created++;
    }
  });
  
  const data = Object.entries(dayStats).map(([day, stats]) => ({
    day,
    completed: stats.completed,
    created: stats.created
  }));
  
  res.json({ success: true, data });
});

export const getFullAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const data = await analyticsService.getDashboardData(userId);
  
  res.json({
    success: true,
    data
  });
});