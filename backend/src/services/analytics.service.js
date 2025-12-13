// backend/src/services/analytics.service.js
import prisma from '../config/database.js';
import { analyticsRepository } from '../repositories/analytics.repository.js';

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const analyticsCache = {
  get: (key) => {
    const item = cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      cache.delete(key);
      return null;
    }
    return item.value;
  },
  set: (key, value, ttl = CACHE_TTL) => {
    cache.set(key, { value, expiry: Date.now() + ttl });
  },
  delete: (key) => {
    cache.delete(key);
  },
  invalidateUser: (userId) => {
    for (const key of cache.keys()) {
      if (key.includes(userId)) {
        cache.delete(key);
      }
    }
  }
};

export const analyticsService = {
  // Get overview statistics (with caching)
  getOverviewStats: async (userId) => {
    const cacheKey = `overview:${userId}`;
    const cached = analyticsCache.get(cacheKey);
    
    if (cached) return cached;

    const [projects, tasks, streak] = await Promise.all([
      prisma.project.count({ where: { userId } }),
      prisma.task.groupBy({
        by: ['status'],
        where: { project: { userId } },
        _count: true
      }),
      calculateStreak(userId)
    ]);

    const completedTasks = tasks.find(t => t.status === 'COMPLETED')?._count || 0;
    const activeTasks = tasks.find(t => t.status === 'IN_PROGRESS')?._count || 0;
    const todoTasks = tasks.find(t => t.status === 'TODO')?._count || 0;
    const totalTasks = tasks.reduce((sum, t) => sum + t._count, 0);

    const result = {
      totalProjects: projects,
      totalTasks,
      completedTasks,
      activeTasks,
      todoTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      currentStreak: streak.current,
      bestStreak: streak.best
    };

    analyticsCache.set(cacheKey, result);
    return result;
  },

  // Get task completion trend (last 30 days)
  getCompletionTrend: async (userId, days = 30) => {
    const cacheKey = `trend:${userId}:${days}`;
    const cached = analyticsCache.get(cacheKey);
    
    if (cached) return cached;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const taskLogs = await prisma.taskLog.findMany({
      where: {
        task: { project: { userId } },
        action: 'status_change',
        newStatus: 'COMPLETED',
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by date
    const grouped = taskLogs.reduce((acc, log) => {
      const date = log.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Fill in missing dates with 0
    const result = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        completed: grouped[dateStr] || 0
      });
    }

    analyticsCache.set(cacheKey, result);
    return result;
  },

  // Calculate activity heatmap data
  getActivityHeatmap: async (userId, months = 6) => {
    const cacheKey = `heatmap:${userId}:${months}`;
    const cached = analyticsCache.get(cacheKey);
    
    if (cached) return cached;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setHours(0, 0, 0, 0);

    const activities = await prisma.taskLog.findMany({
      where: {
        task: { project: { userId } },
        createdAt: { gte: startDate }
      },
      select: { createdAt: true }
    });

    // Group by date and count
    const heatmap = activities.reduce((acc, activity) => {
      const date = activity.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    analyticsCache.set(cacheKey, heatmap);
    return heatmap;
  },

  // Calculate goal health score
  getHealthScore: async (userId) => {
    const cacheKey = `health:${userId}`;
    const cached = analyticsCache.get(cacheKey);
    
    if (cached) return cached;

    const stats = await analyticsService.getOverviewStats(userId);
    const trend = await analyticsService.getCompletionTrend(userId, 14);

    // Calculate individual scores
    const consistencyScore = calculateConsistencyScore(trend);
    const completionScore = stats.completionRate;
    const onTimeScore = await calculateOnTimeScore(userId);
    const activeProjectScore = calculateActiveProjectScore(stats);

    const overallScore = Math.round(
      (consistencyScore * 0.3) +
      (completionScore * 0.3) +
      (onTimeScore * 0.25) +
      (activeProjectScore * 0.15)
    );

    const result = {
      overall: overallScore,
      breakdown: {
        consistency: consistencyScore,
        completion: completionScore,
        onTime: onTimeScore,
        activeProjects: activeProjectScore
      }
    };

    analyticsCache.set(cacheKey, result);
    return result;
  },

  // Get recent completed tasks
  getRecentCompleted: async (userId, limit = 5) => {
    return analyticsRepository.getRecentCompletedTasks(userId, limit);
  },

  // Get overdue tasks count
  getOverdueCount: async (userId) => {
    return analyticsRepository.getOverdueTasks(userId);
  },

  // Get upcoming deadlines
  getUpcomingDeadlines: async (userId, days = 7) => {
    return analyticsRepository.getUpcomingDeadlines(userId, days);
  },

  // Get full dashboard data
  getDashboardData: async (userId) => {
    const cacheKey = `dashboard:${userId}`;
    const cached = analyticsCache.get(cacheKey);
    
    if (cached) return cached;

    const [
      overview,
      trend,
      healthScore,
      recentCompleted,
      overdueCount,
      upcomingDeadlines
    ] = await Promise.all([
      analyticsService.getOverviewStats(userId),
      analyticsService.getCompletionTrend(userId, 30),
      analyticsService.getHealthScore(userId),
      analyticsService.getRecentCompleted(userId, 5),
      analyticsService.getOverdueCount(userId),
      analyticsService.getUpcomingDeadlines(userId, 7)
    ]);

    const result = {
      overview,
      trend,
      healthScore,
      recentCompleted,
      overdueCount,
      upcomingDeadlines
    };

    analyticsCache.set(cacheKey, result);
    return result;
  },

  // Invalidate cache when tasks change
  invalidateUserCache: (userId) => {
    analyticsCache.invalidateUser(userId);
  }
};

// ==================== HELPER FUNCTIONS ====================

// Calculate streak
const calculateStreak = async (userId) => {
  const logs = await prisma.taskLog.findMany({
    where: {
      task: { project: { userId } },
      newStatus: 'COMPLETED'
    },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });

  if (logs.length === 0) return { current: 0, best: 0 };

  // Get unique dates
  const dates = [...new Set(logs.map(l =>
    l.createdAt.toISOString().split('T')[0]
  ))].sort().reverse();

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 1;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Check if streak is active (today or yesterday)
  if (dates[0] === today || dates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diff = (prevDate - currDate) / 86400000;

      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate best streak
  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const diff = (prevDate - currDate) / 86400000;

    if (diff === 1) {
      tempStreak++;
    } else {
      bestStreak = Math.max(bestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak, currentStreak);

  return { current: currentStreak, best: bestStreak };
};

// Calculate consistency score based on trend
const calculateConsistencyScore = (trend) => {
  if (!trend || trend.length === 0) return 0;

  const daysWithActivity = trend.filter(d => d.completed > 0).length;
  const totalDays = trend.length;

  return Math.round((daysWithActivity / totalDays) * 100);
};

// Calculate on-time completion score
const calculateOnTimeScore = async (userId) => {
  const [completedOnTime, completedLate] = await Promise.all([
    prisma.task.count({
      where: {
        project: { userId },
        status: 'COMPLETED',
        dueDate: { not: null },
        completedAt: { not: null },
        AND: {
          completedAt: { lte: prisma.task.fields.dueDate }
        }
      }
    }).catch(() => 0),
    prisma.task.count({
      where: {
        project: { userId },
        status: 'COMPLETED',
        dueDate: { not: null },
        completedAt: { not: null }
      }
    }).catch(() => 0)
  ]);

  // Simplified calculation
  const tasksWithDueDate = await prisma.task.count({
    where: {
      project: { userId },
      status: 'COMPLETED',
      dueDate: { not: null }
    }
  });

  if (tasksWithDueDate === 0) return 100;

  const overdueTasks = await prisma.task.count({
    where: {
      project: { userId },
      status: { not: 'COMPLETED' },
      dueDate: { lt: new Date() }
    }
  });

  const totalWithDueDate = tasksWithDueDate + overdueTasks;
  if (totalWithDueDate === 0) return 100;

  return Math.round(((totalWithDueDate - overdueTasks) / totalWithDueDate) * 100);
};

// Calculate active project score
const calculateActiveProjectScore = (stats) => {
  if (stats.totalProjects === 0) return 0;

  // Ideal: have tasks in progress
  const hasActiveTasks = stats.activeTasks > 0;
  const hasReasonableLoad = stats.activeTasks <= stats.totalProjects * 5;
  const hasTodoTasks = stats.todoTasks > 0;

  let score = 50; // Base score

  if (hasActiveTasks) score += 25;
  if (hasReasonableLoad) score += 15;
  if (hasTodoTasks) score += 10;

  return Math.min(score, 100);
};

export default analyticsService;