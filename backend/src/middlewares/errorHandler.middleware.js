// backend/src/middlewares/errorHandler.middleware.js
import { config } from '../config/env.js';
import { Prisma } from '@prisma/client';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Log error
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        statusCode = 400;
        message = 'A record with this value already exists';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid reference';
        break;
      default:
        statusCode = 400;
        message = 'Database error';
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Validation errors (Zod)
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Stripe errors
  if (err.type === 'StripeCardError') {
    statusCode = 400;
    message = err.message;
  }

  // Don't leak error details in production
  const response = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(config.nodeEnv === 'development' && {
      stack: err.stack,
      originalError: err.message,
    }),
  };

  res.status(statusCode).json(response);
};