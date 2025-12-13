// frontend/src/features/ai-planner/hooks/useAIPlanner.js
import { useState, useCallback } from 'react';
import { aiService } from '../services/aiService';
import toast from 'react-hot-toast';

export const useAIPlanner = () => {
  const [generating, setGenerating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const generatePlan = useCallback(async (data) => {
    setGenerating(true);
    try {
      const plan = await aiService.generatePlan(data);
      setCurrentPlan(plan);
      toast.success('Plan generated successfully!');
      return plan;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate plan';
      toast.error(message);
      throw error;
    } finally {
      setGenerating(false);
    }
  }, []);

  const fetchPlans = useCallback(async (limit = 10) => {
    setLoading(true);
    try {
      const data = await aiService.getUserPlans(limit);
      setPlans(data);
      return data;
    } catch (error) {
      toast.error('Failed to fetch plans');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const importPlan = useCallback(async (planId, projectName) => {
    setImporting(true);
    try {
      const project = await aiService.importPlan(planId, projectName);
      setCurrentPlan(prev => prev?.id === planId ? { ...prev, imported: true } : prev);
      toast.success('Plan imported as project!');
      return project;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to import plan';
      toast.error(message);
      throw error;
    } finally {
      setImporting(false);
    }
  }, []);

  const deletePlan = useCallback(async (planId) => {
    try {
      await aiService.deletePlan(planId);
      setPlans(prev => prev.filter(p => p.id !== planId));
      if (currentPlan?.id === planId) {
        setCurrentPlan(null);
      }
      toast.success('Plan deleted');
    } catch (error) {
      toast.error('Failed to delete plan');
      throw error;
    }
  }, [currentPlan]);

  const clearCurrentPlan = useCallback(() => {
    setCurrentPlan(null);
  }, []);

  return {
    generating,
    importing,
    loading,
    currentPlan,
    plans,
    generatePlan,
    fetchPlans,
    importPlan,
    deletePlan,
    clearCurrentPlan,
    setCurrentPlan,
  };
};