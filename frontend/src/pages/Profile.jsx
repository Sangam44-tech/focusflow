// frontend/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const [projectsRes] = await Promise.all([
        api.get('/projects')
      ]);
      
      const projects = projectsRes.data.data || [];
      
      // Calculate stats from projects data
      const totalTasks = projects.reduce((sum, project) => sum + (project._count?.tasks || 0), 0);
      const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
      const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
      
      setStats({
        totalProjects: projects.length,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks: 0, // Will be calculated from actual task data if needed
        joinDate: user?.createdAt
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        joinDate: user?.createdAt
      });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      const response = await api.put('/auth/profile', updateData);
      updateUser(response.data.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'User'}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="btn-primary"
              >
                Update Profile
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
            
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter current password"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="btn-secondary"
              >
                Change Password
              </Button>
            </form>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Account Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
            
            {stats ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Goals</span>
                  <span className="font-semibold text-gray-900">{stats.totalProjects}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Goals</span>
                  <span className="font-semibold text-green-600">{stats.activeProjects}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed Goals</span>
                  <span className="font-semibold text-blue-600">{stats.completedProjects}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-semibold text-gray-900">{stats.totalTasks}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Goal Completion</span>
                    <span className="font-semibold text-gray-900">
                      {stats.totalProjects > 0 
                        ? Math.round((stats.completedProjects / stats.totalProjects) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-gray-500 text-center">
                    📊 View detailed analytics for more insights
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
};