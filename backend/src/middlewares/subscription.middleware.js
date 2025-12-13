// middlewares/subscription.middleware.js

export const requirePremium = asyncHandler(async (req, res, next) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.user.id }
  });
  
  if (!subscription || subscription.plan === 'FREE') {
    throw new ApiError(403, 'This feature requires a Premium subscription');
  }
  
  if (subscription.status !== 'ACTIVE') {
    throw new ApiError(403, 'Your subscription is not active');
  }
  
  // Check if subscription has expired
  if (subscription.currentPeriodEnd && new Date() > subscription.currentPeriodEnd) {
    throw new ApiError(403, 'Your subscription has expired');
  }
  
  next();
});

export const checkProjectLimit = asyncHandler(async (req, res, next) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: req.user.id }
  });
  
  if (subscription?.plan === 'PREMIUM') {
    return next(); // No limit for premium
  }
  
  const projectCount = await prisma.project.count({
    where: { userId: req.user.id }
  });
  
  if (projectCount >= 3) {
    throw new ApiError(403, 'Free plan limited to 3 projects. Upgrade to Premium!');
  }
  
  next();
});

// Usage in routes
router.post('/projects', auth, checkProjectLimit, createProject);
router.post('/ai/generate', auth, requirePremium, generateAIPlan);