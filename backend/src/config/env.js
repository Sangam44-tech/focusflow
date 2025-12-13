// backend/src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // JWT
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  
  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // AI
  openaiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  
  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
};