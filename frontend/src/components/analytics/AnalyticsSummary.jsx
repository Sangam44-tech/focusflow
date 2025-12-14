// frontend/src/components/analytics/AnalyticsSummary.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

export const AnalyticsSummary = ({ userId, compact = false }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    
    // Listen for analytics refresh events
    const handleRefresh = () => fetchAnalytics();
    window.addEventListener('analyticsRefresh', handleRefresh);
    
    return () => {
      window.removeEventListener('analyticsRefresh', handleRefresh);
    };
  }, [userId]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/overview');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    {
      label: 'Total Goals',
      value: analytics.totalProjects || 0,
      color: 'text-blue-600'
    },
    {
      label: 'Active Goals',
      value: analytics.activeProjects || 0,
      color: 'text-green-600'
    },
    {
      label: 'Completed Goals',
      value: analytics.completedProjects || 0,
      color: 'text-purple-600'
    },
    {
      label: 'Total Tasks',
      value: analytics.totalTasks || 0,
      color: 'text-gray-700'
    },
    {
      label: 'Completed Tasks',
      value: analytics.completedTasks || 0,
      color: 'text-emerald-600'
    },
    {
      label: 'Completion Rate',
      value: `${analytics.completionRate || 0}%`,
      color: 'text-orange-600'
    }
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {stats.slice(0, 4).map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-lg font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-gray-600">{stat.label}</span>
          <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
        </div>
      ))}
      
      {analytics.currentStreak > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-gray-600">Current Streak</span>
          <span className="font-semibold text-orange-600">
            {analytics.currentStreak} days 🔥
          </span>
        </div>
      )}
    </div>
  );
};