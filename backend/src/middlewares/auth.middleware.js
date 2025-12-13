// backend/src/middlewares/auth.middleware.js
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { userRepository } from '../repositories/user.repository.js';

export const auth = asyncHandler(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Access token required');
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Get user from database
    const user = await userRepository.findById(decoded.userId);
    
    if (!user) {
      throw new ApiError(401, 'User not found');
    }
    
    // Attach user to request (without password)
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      subscription: user.subscription
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid access token');
    }
    throw error;
  }
});

// Optional auth - doesn't throw if no token
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await userRepository.findById(decoded.userId);
    
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription
      };
    }
  } catch (error) {
    // Silently fail - user remains undefined
  }
  
  next();
});