// backend/src/validations/ai.schema.js
import { z } from 'zod';

export const generatePlanSchema = z.object({
  goal: z.string().min(10, 'Goal must be at least 10 characters').max(500),
  experience: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  hoursPerDay: z.number().min(0.5).max(12),
  durationWeeks: z.number().min(1).max(52).optional().default(4),
  focusAreas: z.array(z.string()).optional(),
  additionalContext: z.string().max(1000).optional(),
});

export const importPlanSchema = z.object({
  planId: z.string(),
  projectName: z.string().min(1).max(100).optional(),
  selectedTaskIds: z.array(z.number()).optional(), // If user wants to import specific tasks
});