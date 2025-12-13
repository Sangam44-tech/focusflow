// backend/src/controllers/ai.controller.js
import { aiService } from '../services/ai.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generatePlan = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userPlan = req.user.subscription?.plan || 'FREE';
  
  try {
    const plan = await aiService.generatePlan(userId, req.body, userPlan);
    
    res.json({
      success: true,
      data: plan,
      message: 'Plan generated successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to generate plan'
    });
  }
});

export const importPlan = asyncHandler(async (req, res) => {
  const { planId, projectName } = req.body;
  const userId = req.user.id;
  const userPlan = req.user.subscription?.plan || 'FREE';
  
  try {
    const project = await aiService.importPlanToProject(userId, planId, projectName, userPlan);
    
    res.json({
      success: true,
      message: 'Plan imported successfully',
      data: {
        project,
        tasksCreated: project.tasks?.length || 0
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to import plan'
    });
  }
});

export const getPlans = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  try {
    const plans = await aiService.getUserPlans(userId, 20);
    
    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plans'
    });
  }
});

export const deletePlan = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  try {
    await aiService.deletePlan(id, userId);
    
    res.json({
      success: true,
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete plan'
    });
  }
});