// backend/src/routes/payment.routes.js
import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
} from '../controllers/subscription.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(auth);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/subscription-status', getSubscriptionStatus);

export default router;