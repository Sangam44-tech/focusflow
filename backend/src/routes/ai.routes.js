// backend/src/routes/ai.routes.js
import { Router } from 'express';
import {
  generatePlan,
  importPlan,
  getPlans,
  deletePlan,
} from '../controllers/ai.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(auth);

router.post('/generate', generatePlan);
router.post('/import', importPlan);
router.get('/plans', getPlans);
router.delete('/plans/:id', deletePlan);

export default router;