// backend/src/routes/oauth.routes.js
import { Router } from 'express';
import { googleCallback } from '../controllers/oauth.controller.js';

const router = Router();

// Google OAuth routes
router.get('/google', (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=openid email profile`;
  
  res.redirect(googleAuthUrl);
});

router.get('/google/callback', googleCallback);

export default router;