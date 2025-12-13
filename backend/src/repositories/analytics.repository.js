// backend/src/repositories/analytics.repository.js
import prisma from '../config/database.js';

export const analyticsRepository = {
  getTaskStats: async (userId) => {
    return prisma.task.groupBy({
      by: ['status'],
      where: {
        project: { userId },
      },
      _count: true,
    });
  },

  getProjectStats: async (userId) => {
    return prisma.project.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
    });
  },

  getCompletedTasksByDateRange: async (userId, startDate, endDate) => {
    return prisma.taskLog.findMany({
      where: {
        task: { project: { userId } },
        newStatus: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        taskId: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  getTaskActivity: async (userId, startDate, endDate) => {
    return prisma.taskLog.findMany({
      where: {
        task: { project: { userId } },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        action: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  getRecentCompletedTasks: async (userId, limit = 5) => {
    return prisma.task.findMany({
      where: {
        project: { userId },
        status: 'COMPLETED',
      },
      include: {
        project: {
          select: { name: true, color: true },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });
  },

  getOverdueTasks: async (userId) => {
    return prisma.task.count({
      where: {
        project: { userId },
        status: { not: 'COMPLETED' },
        dueDate: { lt: new Date() },
      },
    });
  },

  getUpcomingDeadlines: async (userId, days = 7) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.task.findMany({
      where: {
        project: { userId },
        status: { not: 'COMPLETED' },
        dueDate: {
          gte: new Date(),
          lte: futureDate,
        },
      },
      include: {
        project: {
          select: { name: true, color: true },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 10,
    });
  },

  getTasksCreatedByDateRange: async (userId, startDate, endDate) => {
    return prisma.task.findMany({
      where: {
        project: { userId },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
      },
    });
  },
};