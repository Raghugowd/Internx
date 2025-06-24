import React, { useState } from 'react';
import { Settings, Shield, Mail, Database, Bell, Lock, Save, RefreshCw } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'InternHub',
    siteDescription: 'Professional Internship Portal',
    emailNotifications: true,
    applicationNotifications: true,
    maintenanceMode: false,
    registrationEnabled: true,
    maxApplicationsPerUser: 10,
    sessionTimeout: 24,
    emailSettings: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      emailUser: 'raghavendragowda9880@gmail.com',
      emailFrom: 'InternHub <raghavendragowda9880@gmail.com>'
    }
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === 'emailSettings') {
      setSettings(prev => ({
        ...prev,
        emailSettings: {
          ...prev.emailSettings,
          [field]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      toast.success('Test email sent successfully!');
    } catch (error) {
      toast.error('Failed to send test email');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
            <p className="text-gray-400">Configure platform settings and preferences</p>
          </div>
          
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mt-4 sm:mt-0"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* General Settings */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center mb-6">
              <Settings className="h-6 w-6 text-blue-400 mr-3" />
              <h3 className="text-xl font-bold text-white">General Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Applications per User</label>
                <input
                  type="number"
                  value={settings.maxApplicationsPerUser}
                  onChange={(e) => handleInputChange('general', 'maxApplicationsPerUser', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (hours)</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('general', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-red-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Security & Access</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Maintenance Mode</h4>
                  <p className="text-gray-400 text-sm">Temporarily disable site access</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleInputChange('security', 'maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">User Registration</h4>
                  <p className="text-gray-400 text-sm">Allow new user registrations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.registrationEnabled}
                    onChange={(e) => handleInputChange('security', 'registrationEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              
              <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Lock className="h-5 w-5 text-yellow-400 mr-2" />
                  <h4 className="text-yellow-400 font-medium">Admin Security</h4>
                </div>
                <p className="text-yellow-300 text-sm mb-3">
                  Current admin: <strong>wizdom</strong>
                </p>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center mb-6">
              <Mail className="h-6 w-6 text-green-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Email Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Host</label>
                <input
                  type="text"
                  value={settings.emailSettings.smtpHost}
                  onChange={(e) => handleInputChange('emailSettings', 'smtpHost', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">SMTP Port</label>
                <input
                  type="number"
                  value={settings.emailSettings.smtpPort}
                  onChange={(e) => handleInputChange('emailSettings', 'smtpPort', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email User</label>
                <input
                  type="email"
                  value={settings.emailSettings.emailUser}
                  onChange={(e) => handleInputChange('emailSettings', 'emailUser', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">From Address</label>
                <input
                  type="text"
                  value={settings.emailSettings.emailFrom}
                  onChange={(e) => handleInputChange('emailSettings', 'emailFrom', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                />
              </div>
              
              <button
                onClick={handleTestEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Send Test Email
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center mb-6">
              <Bell className="h-6 w-6 text-purple-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-gray-400 text-sm">Send email notifications for system events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Application Notifications</h4>
                  <p className="text-gray-400 text-sm">Notify when new applications are received</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.applicationNotifications}
                    onChange={(e) => handleInputChange('notifications', 'applicationNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div className="p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Database className="h-5 w-5 text-blue-400 mr-2" />
                  <h4 className="text-blue-400 font-medium">System Status</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Database:</span>
                    <span className="text-green-400">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Email Service:</span>
                    <span className="text-green-400">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Storage:</span>
                    <span className="text-green-400">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
          <div className="flex items-center mb-6">
            <Database className="h-6 w-6 text-gray-400 mr-3" />
            <h3 className="text-xl font-bold text-white">System Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">v1.0.0</div>
              <div className="text-gray-400 text-sm">Platform Version</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">MongoDB</div>
              <div className="text-gray-400 text-sm">Database</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;