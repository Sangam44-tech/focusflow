// frontend/src/pages/Settings.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Card, CardBody } from '../components/common/Card';
import { Input } from '../components/common/Input';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />
              
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
              
              <Button type="submit" loading={loading}>
                Update Profile
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
              
              <Input
                label="New Password"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
              
              <Button type="submit" loading={loading}>
                Change Password
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Preferences */}
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive email updates about your projects</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Task Reminders</h3>
                  <p className="text-sm text-gray-500">Get reminded about upcoming deadlines</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Weekly Reports</h3>
                  <p className="text-sm text-gray-500">Receive weekly productivity summaries</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-yellow-800">Export Data</h3>
                  <p className="text-sm text-yellow-600">Download all your projects and tasks</p>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-red-800">Delete Account</h3>
                  <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                </div>
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};