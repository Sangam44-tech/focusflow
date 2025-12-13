// backend/src/routes/task.routes.js
import { Router } from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  reorderTasks
} from '../controllers/task.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  reorderTasksSchema
} from '../validations/task.schema.js';

const router = Router();

router.use(auth);

// Project tasks routes
router.route('/projects/:projectId/tasks')
  .get(getTasks)
  .post(validate(createTaskSchema), createTask);

router.post('/projects/:projectId/tasks/reorder', validate(reorderTasksSchema), reorderTasks);

// Individual task routes
router.route('/tasks/:id')
  .put(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

router.patch('/tasks/:id/status', validate(updateTaskStatusSchema), updateTaskStatus);

export default router;