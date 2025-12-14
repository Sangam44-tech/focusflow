// backend/src/controllers/oauth.controller.js
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/database.js';
import jwt from 'jsonwebtoken';

export const googleAuth = asyncHandler(async (req, res) => {
  console.log('Google OAuth request received:', req.body);
  
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  try {
    // Decode JWT token directly (Google Identity Services sends JWT)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const googleUser = JSON.parse(jsonPayload);
    console.log('Decoded Google user:', googleUser);
    
    if (!googleUser.email) {
      return res.status(400).json({
        success: false,
        message: 'No email in Google token'
      });
    }
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    });
    
    // Create user if doesn't exist
    if (!user) {
      console.log('Creating new user for:', googleUser.email);
      user = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          avatar: googleUser.picture,
          provider: 'google',
          providerId: googleUser.sub
        }
      });
    }
    
    console.log('User found/created:', user.id);
    
    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Tokens generated successfully');
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        accessToken,
        refreshToken
      }
    });
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message
    });
  }
});