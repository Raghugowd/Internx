import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, AlertCircle, Download } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Application {
  _id: string;
  internshipId: {
    _id: string;
    title: string;
    company: string;
    location: string;
    salary: number;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    skills: string[];
    resume: boolean;
  };
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  coverLetter: string;
  appliedAt: string;
}

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production URLs
    if (hostname === 'internx.io' || hostname === 'www.internx.io') {
      return 'https://api.internx.io/api';
    }
    
    // Vercel/Netlify deployments
    if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
      return 'https://api.internx.io/api';
    }
    
    // Local development
    return 'http://localhost:5000/api';
  }
  
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

const AdminApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/applications`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/applications/${applicationId}`, { status });
      toast.success(`Application ${status.toLowerCase()} successfully!`);
      fetchApplications();
      setShowModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update application status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Reviewed':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'Accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' || app.status.toLowerCase() === filterStatus
  );

  const downloadResume = async (userId: string, applicantName: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resume/${userId}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${applicantName}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download resume');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Application Management</h1>
            <p className="text-gray-400">Review and manage internship applications</p>
          </div>
          
          {/* Filter */}
          <div className="mt-4 sm:mt-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total', count: applications.length, color: 'from-blue-500 to-blue-600' },
            { label: 'Pending', count: applications.filter(app => app.status === 'Pending').length, color: 'from-yellow-500 to-yellow-600' },
            { label: 'Accepted', count: applications.filter(app => app.status === 'Accepted').length, color: 'from-green-500 to-green-600' },
            { label: 'Rejected', count: applications.filter(app => app.status === 'Rejected').length, color: 'from-red-500 to-red-600' }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <div className={`bg-gradient-to-r ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <span className="text-white font-bold text-lg">{stat.count}</span>
              </div>
              <h3 className="text-white font-semibold">{stat.label} Applications</h3>
            </div>
          ))}
        </div>

        {/* Applications Table */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Internship</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Applied Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No applications found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application._id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{application.userId.name}</div>
                          <div className="text-gray-400 text-sm">{application.userId.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{application.internshipId.title}</div>
                          <div className="text-gray-400 text-sm">{application.internshipId.company}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-2">{application.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowModal(true);
                            }}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {application.userId.resume && (
                            <button
                              onClick={() => downloadResume(application.userId._id, application.userId.name)}
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

        {/* Application Detail Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">Application Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Applicant Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Applicant Information</h3>
                    <div className="bg-gray-700/50 rounded-xl p-4 space-y-3">
                      <div>
                        <span className="text-gray-400 text-sm">Name:</span>
                        <p className="text-white font-medium">{selectedApplication.userId.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Email:</span>
                        <p className="text-white">{selectedApplication.userId.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Phone:</span>
                        <p className="text-white">{selectedApplication.userId.phone}</p>
                      </div>
                      {selectedApplication.userId.skills && selectedApplication.userId.skills.length > 0 && (
                        <div>
                          <span className="text-gray-400 text-sm">Skills:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedApplication.userId.skills.map((skill, index) => (
                              <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resume */}
                  {selectedApplication.userId.resume && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Resume</h4>
                      <button
                        onClick={() => downloadResume(selectedApplication.userId._id, selectedApplication.userId.name)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Resume
                      </button>
                    </div>
                  )}
                </div>

                {/* Internship & Application Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Internship Information</h3>
                    <div className="bg-gray-700/50 rounded-xl p-4 space-y-3">
                      <div>
                        <span className="text-gray-400 text-sm">Position:</span>
                        <p className="text-white font-medium">{selectedApplication.internshipId.title}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Company:</span>
                        <p className="text-white">{selectedApplication.internshipId.company}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Location:</span>
                        <p className="text-white">{selectedApplication.internshipId.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Salary:</span>
                        <p className="text-white">₹{selectedApplication.internshipId.salary.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Applied Date:</span>
                        <p className="text-white">{new Date(selectedApplication.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Current Status:</span>
                        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit mt-1 ${getStatusColor(selectedApplication.status)}`}>
                          {getStatusIcon(selectedApplication.status)}
                          <span className="ml-2">{selectedApplication.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  {selectedApplication.coverLetter && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Cover Letter</h4>
                      <div className="bg-gray-700/50 rounded-xl p-4">
                        <p className="text-gray-300 whitespace-pre-line">{selectedApplication.coverLetter}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateApplicationStatus(selectedApplication._id, 'Reviewed')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Mark as Reviewed
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(selectedApplication._id, 'Accepted')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(selectedApplication._id, 'Rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;