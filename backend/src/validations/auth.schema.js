// backend/src/validations/auth.schema.js
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])/,
      'Password must contain at least one lowercase letter'
    )
    .regex(
      /^(?=.*[A-Z])/,
      'Password must contain at least one uppercase letter'
    )
    .regex(
      /^(?=.*\d)/,
      'Password must contain at least one number'
    )
    .regex(
      /^(?=.*[@$!%*?&])/,
      'Password must contain at least one special character (@$!%*?&)'
    ),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])/,
      'Password must contain at least one lowercase letter'
    )
    .regex(
      /^(?=.*[A-Z])/,
      'Password must contain at least one uppercase letter'
    )
    .regex(
      /^(?=.*\d)/,
      'Password must contain at least one number'
    )
    .regex(
      /^(?=.*[@$!%*?&])/,
      'Password must contain at least one special character (@$!%*?&)'
    ),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
});