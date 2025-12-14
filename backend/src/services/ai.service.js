// backend/src/services/ai.service.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { aiRepository } from '../repositories/ai.repository.js';
import { projectRepository } from '../repositories/project.repository.js';
import { ApiError } from '../utils/ApiError.js';
import prisma from '../config/database.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rate limits
const FREE_PLAN_DAILY_LIMIT = 3;
const PREMIUM_PLAN_DAILY_LIMIT = 50;

export const aiService = {
  generatePlan: async (userId, input, userPlan) => {
    // Check rate limits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const usageCount = await aiRepository.countByUser(userId, today);
    const limit = userPlan === 'PREMIUM' ? PREMIUM_PLAN_DAILY_LIMIT : FREE_PLAN_DAILY_LIMIT;
    
    if (userPlan === 'FREE' && usageCount >= FREE_PLAN_DAILY_LIMIT) {
      throw new ApiError(403, 'Daily AI generation limit reached. Upgrade to Premium for more!');
    }
    
    if (usageCount >= limit) {
      throw new ApiError(429, 'Daily AI generation limit reached. Please try again tomorrow.');
    }

    const goalText = typeof input === 'string' ? input : input.goal;
    const deadline = typeof input === 'object' ? input.deadline : null;

    try {
      // Call Gemini API
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const deadlineText = deadline ? `\n\nIMPORTANT: The user wants to complete this by ${new Date(deadline).toLocaleDateString()}. Create a realistic timeline that fits within this deadline.` : '';
      
      const prompt = `You are a project planning assistant. Create a detailed project plan for the following goal: "${goalText}"${deadlineText}

Return a JSON response with this exact structure:
{
  "projectName": "Clear project name",
  "projectDescription": "Brief description",
  "tasks": [
    {
      "title": "Task title",
      "description": "Task description",
      "priority": "HIGH|MEDIUM|LOW",
      "estimatedDays": 7
    }
  ]
}

Create 5-8 actionable tasks. For estimatedDays: HIGH priority = 7-14 days, MEDIUM = 3-7 days, LOW = 1-3 days.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new ApiError(500, 'AI response did not contain a valid JSON object.');
      }
      
      const rawResponse = JSON.parse(jsonMatch[0]);
      
      // Validate and structure response with deadline calculation
      const tasks = (rawResponse.tasks || []).map(task => ({
        title: task.title || 'Untitled Task',
        description: task.description || '',
        priority: ['HIGH', 'MEDIUM', 'LOW'].includes(task.priority) ? task.priority : 'MEDIUM',
        estimatedDays: task.estimatedDays || getPriorityDays(task.priority)
      }));
      
      const validatedPlan = {
        projectName: rawResponse.projectName || 'Generated Project',
        projectDescription: rawResponse.projectDescription || 'AI generated project',
        deadline: deadline,
        tasks: calculateTaskDeadlines(tasks, deadline)
      };

      // Save to database
      const aiPlan = await aiRepository.createPlan({
        userId,
        goal: goalText,
        context: typeof input === 'object' ? input : { goal: goalText },
        generatedTasks: validatedPlan,
      });

      return {
        id: aiPlan.id,
        ...validatedPlan,
        createdAt: aiPlan.createdAt,
      };

    } catch (error) {
      console.error('AI Generation Error:', error);
      
      // Create a fallback plan if AI fails
      const fallbackTasks = [
        { title: 'Research and Planning', description: 'Gather information and create a detailed plan', priority: 'HIGH', estimatedDays: 7 },
        { title: 'Setup and Preparation', description: 'Set up necessary tools and environment', priority: 'MEDIUM', estimatedDays: 3 },
        { title: 'Implementation Phase 1', description: 'Begin the main work', priority: 'HIGH', estimatedDays: 10 },
        { title: 'Testing and Review', description: 'Test and review the work done', priority: 'MEDIUM', estimatedDays: 5 },
        { title: 'Final Adjustments', description: 'Make final improvements', priority: 'LOW', estimatedDays: 2 },
        { title: 'Completion and Documentation', description: 'Finalize and document the project', priority: 'MEDIUM', estimatedDays: 3 }
      ];
      
      const fallbackPlan = {
        projectName: `Project: ${goalText}`,
        projectDescription: `A project to achieve: ${goalText}`,
        deadline: deadline,
        tasks: calculateTaskDeadlines(fallbackTasks, deadline)
      };
      
      // Save fallback plan to database
      const aiPlan = await aiRepository.createPlan({
        userId,
        goal: goalText,
        context: typeof input === 'object' ? input : { goal: goalText },
        generatedTasks: fallbackPlan,
      });

      return {
        id: aiPlan.id,
        ...fallbackPlan,
        createdAt: aiPlan.createdAt,
      };
    }
  },

  getPlanById: async (planId, userId) => {
    const plan = await aiRepository.findById(planId);
    
    if (!plan) {
      throw new ApiError(404, 'Plan not found');
    }
    
    if (plan.userId !== userId) {
      throw new ApiError(403, 'Not authorized to access this plan');
    }
    
    return plan;
  },

  getUserPlans: async (userId, limit = 10) => {
    return aiRepository.findByUser(userId, limit);
  },

  importPlanToProject: async (userId, planId, projectName, userPlan) => {
    // Get the plan
    const plan = await aiRepository.findById(planId);
    
    if (!plan) {
      throw new ApiError(404, 'Plan not found');
    }
    
    if (plan.userId !== userId) {
      throw new ApiError(403, 'Not authorized');
    }
    
    if (plan.imported) {
      throw new ApiError(400, 'This plan has already been imported');
    }

    // Check project limits for free users
    if (userPlan === 'FREE') {
      const projectCount = await projectRepository.countByUser(userId);
      if (projectCount >= 3) {
        throw new ApiError(403, 'Free plan limited to 3 projects. Upgrade to Premium!');
      }
    }

    const generatedTasks = plan.generatedTasks;
    const name = projectName || generatedTasks.projectName;

    console.log('Import plan data:', {
      planId,
      deadline: generatedTasks.deadline,
      tasksCount: generatedTasks.tasks?.length,
      firstTaskDueDate: generatedTasks.tasks?.[0]?.dueDate
    });

    // Create project with tasks
    const project = await prisma.project.create({
      data: {
        userId,
        name,
        description: generatedTasks.projectDescription,
        deadline: generatedTasks.deadline ? new Date(generatedTasks.deadline) : null,
        color: '#6366f1',
        priority: 'MEDIUM',
        tasks: {
          create: generatedTasks.tasks.map((task, index) => ({
            title: task.title,
            description: task.description,
            priority: task.priority,
            order: index,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
          })),
        },
      },
      include: { tasks: true },
    });

    console.log('Created project:', {
      id: project.id,
      name: project.name,
      deadline: project.deadline,
      tasksWithDueDates: project.tasks.map(t => ({ title: t.title, dueDate: t.dueDate }))
    });

    // Mark plan as imported
    await aiRepository.markAsImported(planId, project.id);

    return project;
  },

  deletePlan: async (planId, userId) => {
    const plan = await aiRepository.findById(planId);
    
    if (!plan) {
      throw new ApiError(404, 'Plan not found');
    }
    
    if (plan.userId !== userId) {
      throw new ApiError(403, 'Not authorized');
    }
    
    return aiRepository.delete(planId);
  },
};

// Helper function to get default days based on priority
function getPriorityDays(priority) {
  switch (priority) {
    case 'HIGH': return 10;
    case 'MEDIUM': return 5;
    case 'LOW': return 2;
    default: return 5;
  }
}

// Helper function to calculate task deadlines intelligently
function calculateTaskDeadlines(tasks, projectDeadline) {
  if (!projectDeadline) {
    // No deadline provided, use estimated days from today
    let currentDate = new Date();
    return tasks.map(task => {
      currentDate = new Date(currentDate.getTime() + (task.estimatedDays * 24 * 60 * 60 * 1000));
      return {
        ...task,
        dueDate: currentDate.toISOString()
      };
    });
  }

  // Calculate total estimated days
  const totalDays = tasks.reduce((sum, task) => sum + task.estimatedDays, 0);
  const startDate = new Date();
  const endDate = new Date(projectDeadline);
  const availableDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  if (availableDays <= 0) {
    // Deadline is in the past or today, set all tasks to today
    return tasks.map(task => ({
      ...task,
      dueDate: new Date().toISOString()
    }));
  }
  
  // Distribute deadlines proportionally
  let currentDate = new Date(startDate);
  const scaleFactor = Math.max(0.1, availableDays / totalDays); // Minimum 10% of estimated time
  
  return tasks.map((task, index) => {
    const adjustedDays = Math.max(1, Math.round(task.estimatedDays * scaleFactor));
    currentDate = new Date(currentDate.getTime() + (adjustedDays * 24 * 60 * 60 * 1000));
    
    // Ensure we don't exceed the project deadline
    if (currentDate > endDate) {
      currentDate = new Date(endDate);
    }
    
    return {
      ...task,
      dueDate: currentDate.toISOString(),
      adjustedDays
    };
  });
}

// Helper function to calculate due date based on week number (legacy)
function calculateDueDate(weekNumber) {
  const date = new Date();
  date.setDate(date.getDate() + (weekNumber * 7));
  return date;
}