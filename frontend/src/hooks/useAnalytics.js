import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/overview');
      return data.data;
    },
    staleTime: 5 * 60 * 1000  // Cache for 5 minutes
  });
};

export const useProductivity = () => {
  return useQuery({
    queryKey: ['analytics', 'productivity'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/productivity');
      return data.data;
    },
    staleTime: 5 * 60 * 1000
  });
};

export const useTrends = (days = 30) => {
  return useQuery({
    queryKey: ['analytics', 'trends', days],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/trend?days=${days}`);
      return data.data;
    },
    staleTime: 10 * 60 * 1000  // Cache for 10 minutes
  });
};