// backend/src/controllers/auth.controller.js
import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../services/auth.service.js';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/jwt.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  
  setRefreshTokenCookie(res, result.refreshToken);
  
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  
  setRefreshTokenCookie(res, result.refreshToken);
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    }
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await authService.refresh(refreshToken);
  
  setRefreshTokenCookie(res, result.refreshToken);
  
  res.json({
    success: true,
    data: {
      accessToken: result.accessToken
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  clearRefreshTokenCookie(res);
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, currentPassword, newPassword);
  
  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await authService.updateProfile(req.user.id, { name, email });
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});