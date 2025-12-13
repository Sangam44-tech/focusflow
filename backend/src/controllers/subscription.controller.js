// backend/src/controllers/payment.controller.js
// Payment features disabled - uncomment when ready

/*
import razorpay from '../config/razorpay.js';
import prisma from '../config/database.js';
import crypto from 'crypto';
import { PLANS } from '../config/stripe.js';

export const createOrder = async (req, res) => {
  // ... code
};

export const verifyPayment = async (req, res) => {
  // ... code
};

export const getSubscriptionStatus = async (req, res) => {
  // ... code
};
*/

// Placeholder exports to prevent import errors
export const createOrder = (req, res) => {
  res.status(503).json({ message: 'Payment features disabled' });
};

export const verifyPayment = (req, res) => {
  res.status(503).json({ message: 'Payment features disabled' });
};

export const getSubscriptionStatus = (req, res) => {
  res.status(503).json({ message: 'Payment features disabled' });
};