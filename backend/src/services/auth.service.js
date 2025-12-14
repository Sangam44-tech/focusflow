// backend/src/services/auth.service.js
import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.js';
import { registerSchema } from '../validations/auth.schema.js';

export const authService = {
  register: async (data) => {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(400, 'Email already registered');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    // Create user
    const user = await userRepository.create({
      ...data,
      password: hashedPassword
    });
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription
      },
      accessToken,
      refreshToken
    };
  },
  
  login: async (email, password) => {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ApiError(401, 'Invalid email or password');
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription
      },
      accessToken,
      refreshToken
    };
  },
  
  refresh: async (refreshToken) => {
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token required');
    }
    
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await userRepository.findById(decoded.userId);
      
      if (!user || user.tokenVersion !== decoded.tokenVersion) {
        throw new ApiError(401, 'Invalid refresh token');
      }
      
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new ApiError(401, 'Invalid refresh token');
    }
  },
  
  logout: async (userId) => {
    // Increment token version to invalidate all refresh tokens
    await userRepository.incrementTokenVersion(userId);
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    // Get user with password
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Verify current password
    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new ApiError(400, 'New password must be different from current password');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password and increment token version
    await userRepository.updatePassword(userId, hashedNewPassword);
    await userRepository.incrementTokenVersion(userId);
  },

  updateProfile: async (userId, data) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ApiError(400, 'Email already in use');
      }
    }

    // Update user profile
    const updatedUser = await userRepository.updateProfile(userId, data);
    
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      subscription: updatedUser.subscription
    };
  }
};