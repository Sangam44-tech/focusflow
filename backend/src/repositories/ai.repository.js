// backend/src/repositories/ai.repository.js
import prisma from '../config/database.js';

export const aiRepository = {
  createPlan: async (data) => {
    return prisma.aIPlan.create({
      data,
    });
  },

  findById: async (id) => {
    return prisma.aIPlan.findUnique({
      where: { id },
    });
  },

  findByUser: async (userId, limit = 10) => {
    return prisma.aIPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  markAsImported: async (id, projectId) => {
    return prisma.aIPlan.update({
      where: { id },
      data: { 
        imported: true,
        importedToProject: projectId,
      },
    });
  },

  delete: async (id) => {
    return prisma.aIPlan.delete({
      where: { id },
    });
  },

  countByUser: async (userId, since = null) => {
    const where = { userId };
    if (since) {
      where.createdAt = { gte: since };
    }
    return prisma.aIPlan.count({ where });
  },
};