import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, GraduationCap, Download, Search, Filter } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import toast from 'react-hot-toast';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  year: string;
  skills: string[];
  resume: string;
  createdAt: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = async (userId: string, userName: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/resume/${userId}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userName}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download resume');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.degree.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">View and manage registered users</p>
          </div>
          
          {/* Search */}
          <div className="mt-4 sm:mt-0 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold">Total Users</h3>
            <p className="text-2xl font-bold text-white mt-2">{users.length}</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold">With Resume</h3>
            <p className="text-2xl font-bold text-white mt-2">
              {users.filter(user => user.resume).length}
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold">This Month</h3>
            <p className="text-2xl font-bold text-white mt-2">
              {users.filter(user => {
                const userDate = new Date(user.createdAt);
                const currentDate = new Date();
                return userDate.getMonth() === currentDate.getMonth() && 
                       userDate.getFullYear() === currentDate.getFullYear();
              }).length}
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold">Filtered</h3>
            <p className="text-2xl font-bold text-white mt-2">{filteredUsers.length}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Education</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Skills</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{user.name}</div>
                            <div className="text-gray-400 text-sm">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">
                          <div className="flex items-center mb-1">
                            <Phone className="h-4 w-4 mr-2" />
                            {user.phone}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">
                          <div className="font-medium">{user.college || 'Not specified'}</div>
                          <div className="text-sm">{user.degree || 'Not specified'} - {user.year || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.skills && user.skills.length > 0 ? (
                            user.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No skills listed</span>
                          )}
                          {user.skills && user.skills.length > 3 && (
                            <span className="text-gray-400 text-xs">+{user.skills.length - 3} more</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <User className="h-4 w-4" />
                          </button>
                          {user.resume && (
                            <button
                              onClick={() => downloadResume(user._id, user.name)}
                              className="text-green-400 hover:text-green-300 transition-colors"
                              title="Download Resume"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">User Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">Name:</span>
                      <p className="text-white font-medium">{selectedUser.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Email:</span>
                      <p className="text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Phone:</span>
                      <p className="text-white">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Joined:</span>
                      <p className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-sm">College:</span>
                      <p className="text-white">{selectedUser.college || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Degree:</span>
                      <p className="text-white">{selectedUser.degree || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Year:</span>
                      <p className="text-white">{selectedUser.year || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {selectedUser.skills && selectedUser.skills.length > 0 && (
                  <div className="bg-gray-700/50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.skills.map((skill, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resume */}
                {selectedUser.resume && (
                  <div className="bg-gray-700/50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Resume</h3>
                    <button
                      onClick={() => downloadResume(selectedUser._id, selectedUser.name)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;