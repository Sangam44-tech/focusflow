// frontend/src/features/analytics/hooks/useAnalytics.js
import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import toast from 'react-hot-toast';

export const useAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const analytics = await analyticsService.getFullAnalytics();
      setData(analytics);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};