// backend/src/routes/analytics.routes.js
import { Router } from 'express';
import {
  getOverview,
  getCompletionTrend,
  getActivityHeatmap,
  getStreak,
  getHealthScore,
  getUpcomingDeadlines,
  getProductivityByDay,
  getFullAnalytics,
} from '../controllers/analytics.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(auth);

router.get('/', getFullAnalytics);
router.get('/overview', getOverview);
router.get('/trend', getCompletionTrend);
router.get('/heatmap', getActivityHeatmap);
router.get('/streak', getStreak);
router.get('/health', getHealthScore);
router.get('/deadlines', getUpcomingDeadlines);
router.get('/productivity', getProductivityByDay);

export default router;