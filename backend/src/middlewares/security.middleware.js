// backend/src/middlewares/security.middleware.js
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { ApiError } from '../utils/ApiError.js';

// Content Security Policy
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https://api.stripe.com', 'https://api.openai.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", 'https://js.stripe.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// Rate limiters for different endpoints
export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.user?.id || req.ip;
    },
  });
};

// Specific limiters
export const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5,
  'Too many login attempts. Please try again in 15 minutes.'
);

export const apiLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  100,
  'Too many requests. Please slow down.'
);

export const aiLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10,
  'AI generation limit reached. Upgrade to Premium for more.'
);

// Speed limiter (slow down repeated requests)
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 500,
});

// Request size limiter
export const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 10 * 1024; // 10KB
  
  if (contentLength > maxSize) {
    throw new ApiError(413, 'Request entity too large');
  }
  next();
};

// Sanitize request data
export const sanitizeRequest = (req, res, next) => {
  // Remove any potential NoSQL injection patterns
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
      // Block keys starting with $ or containing .
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      sanitized[key] = sanitize(obj[key]);
    }
    
    return sanitized;
  };
  
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  
  next();
};