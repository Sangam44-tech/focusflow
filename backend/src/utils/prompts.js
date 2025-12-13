// backend/src/utils/prompts.js

export const generateTaskPlanPrompt = (input) => {
  const { goal, experience, hoursPerDay, durationWeeks, focusAreas, additionalContext } = input;
  
  const systemPrompt = `You are an expert learning coach, project planner, and productivity specialist. Your job is to create detailed, actionable task plans that help users achieve their goals.

RULES:
1. Break down the goal into specific, measurable, achievable tasks
2. Consider the user's experience level when determining complexity
3. Account for the available time per day
4. Create realistic timelines
5. Include clear success criteria for each task
6. Add helpful tips and resources
7. ALWAYS respond with valid JSON only - no markdown, no explanations outside JSON

EXPERIENCE LEVELS:
- BEGINNER: Start from basics, more hand-holding, simpler tasks
- INTERMEDIATE: Assume foundational knowledge, moderate complexity
- ADVANCED: Complex tasks, assume expertise, focus on optimization`;

  const userPrompt = `Create a detailed task plan for the following:

GOAL: ${goal}
EXPERIENCE LEVEL: ${experience}
TIME AVAILABLE: ${hoursPerDay} hours per day
DURATION: ${durationWeeks} weeks
${focusAreas?.length ? `FOCUS AREAS: ${focusAreas.join(', ')}` : ''}
${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ''}

Respond with this exact JSON structure:
{
  "planTitle": "string - catchy title for the plan",
  "summary": "string - brief overview of the plan",
  "estimatedTotalHours": number,
  "tasks": [
    {
      "weekNumber": number (1-${durationWeeks}),
      "title": "string - clear task title",
      "description": "string - detailed description",
      "estimatedHours": number,
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "subtasks": ["string array of smaller steps"],
      "successCriteria": "string - how to know task is complete",
      "tips": "string - helpful advice for this task"
    }
  ],
  "resources": [
    {
      "title": "string",
      "url": "string - valid URL",
      "type": "ARTICLE" | "VIDEO" | "COURSE" | "BOOK" | "DOCUMENTATION",
      "description": "string - why this resource is helpful"
    }
  ],
  "weeklyMilestones": [
    {
      "week": number,
      "milestone": "string - what should be achieved by end of this week"
    }
  ],
  "tips": ["string array of general tips for success"]
}`;

  return { systemPrompt, userPrompt };
};

export const validateAIResponse = (response) => {
  const schema = z.object({
    planTitle: z.string(),
    summary: z.string(),
    estimatedTotalHours: z.number(),
    tasks: z.array(z.object({
      weekNumber: z.number(),
      title: z.string(),
      description: z.string(),
      estimatedHours: z.number(),
      priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
      subtasks: z.array(z.string()).optional(),
      successCriteria: z.string().optional(),
      tips: z.string().optional(),
    })).min(1),
    resources: z.array(z.object({
      title: z.string(),
      url: z.string().optional(),
      type: z.enum(['ARTICLE', 'VIDEO', 'COURSE', 'BOOK', 'DOCUMENTATION']),
      description: z.string().optional(),
    })).optional(),
    weeklyMilestones: z.array(z.object({
      week: z.number(),
      milestone: z.string(),
    })).optional(),
    tips: z.array(z.string()).optional(),
  });

  return schema.parse(response);
};