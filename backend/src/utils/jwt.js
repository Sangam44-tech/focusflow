// backend/src/utils/jwt.js
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    config.accessTokenSecret,
    { expiresIn: config.accessTokenExpiry }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    config.refreshTokenSecret,
    { expiresIn: config.refreshTokenExpiry }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.accessTokenSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.refreshTokenSecret);
};

export const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth',
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', { path: '/api/auth' });
};