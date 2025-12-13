// backend/src/middlewares/rateLimiter.middleware.js
import rateLimit from 'express-rate-limit';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints rate limiter (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many attempts, please try again in 15 minutes'
  },
  skipSuccessfulRequests: true, // Don't count successful logins
});

// AI generation rate limiter
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'AI generation limit reached. Upgrade to Premium for more.'
  },
});