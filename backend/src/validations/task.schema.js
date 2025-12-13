// backend/src/validations/task.schema.js
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const updateTaskStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
});

export const reorderTasksSchema = z.object({
  taskIds: z.array(z.string()),
});