// backend/src/repositories/user.repository.js
import prisma from '../config/database.js';

export const userRepository = {
  create: async (data) => {
    return prisma.user.create({
      data: {
        ...data,
        subscription: {
          create: { plan: 'FREE' }
        }
      },
      include: { subscription: true }
    });
  },
  
  findByEmail: async (email) => {
    return prisma.user.findUnique({
      where: { email },
      include: { subscription: true }
    });
  },
  
  findById: async (id) => {
    return prisma.user.findUnique({
      where: { id },
      include: { subscription: true }
    });
  },
  
  incrementTokenVersion: async (id) => {
    return prisma.user.update({
      where: { id },
      data: { tokenVersion: { increment: 1 } }
    });
  },

  findByIdWithPassword: async (id) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        tokenVersion: true,
        subscription: true
      }
    });
  },

  updatePassword: async (id, hashedPassword) => {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
  },

  updateProfile: async (id, data) => {
    return prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email
      },
      include: { subscription: true }
    });
  }
};