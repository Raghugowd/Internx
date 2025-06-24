import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, GraduationCap, FileText, Briefcase, Clock, CheckCircle, XCircle, AlertCircle, School, BookOpen, Calendar, Award, TrendingUp, Eye, MapPin, Building } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Application {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    company: string;
    location: string;
    salary: number;
  };
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  appliedAt: string;
  coverLetter: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
    if (user?.profilePicture) {
      setProfilePictureUrl(`http://localhost:5000/api/profile-picture/${user.id}`);
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/my-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getApplicationStats = () => {
    return {
      total: applications.length,
      pending: applications.filter(app => app.status === 'Pending').length,
      reviewed: applications.filter(app => app.status === 'Reviewed').length,
      accepted: applications.filter(app => app.status === 'Accepted').length,
      rejected: applications.filter(app => app.status === 'Rejected').length,
    };
  };

  const stats = getApplicationStats();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
                <p className="text-green-100 text-lg">Track your career journey and manage your applications</p>
              </div>
              <div className="mt-6 md:mt-0 flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-green-100 text-sm">Total Applications</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold">{stats.accepted}</div>
                  <div className="text-green-100 text-sm">Accepted</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-green-100 text-sm">Pending</div>
                </div> <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-2xl font-bold">{stats.reviewed}</div>
                  <div className="text-green-100 text-sm">Reviewed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Enhanced Profile Section */}
          <div className="lg:col-span-4">
            
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-green-200 shadow-lg">
                    {profilePictureUrl ? (
                      <img 
                        src={profilePictureUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={() => setProfilePictureUrl(null)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <User className="h-16 w-16 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h2>
                <p className="text-gray-600 text-lg">{user.email}</p>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium text-gray-900">{user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium text-gray-900">{user.phone}</div>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                  Education
                </h3>
                <div className="space-y-4">
                  {user.schoolName && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="flex items-start">
                        <School className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900">{user.schoolName}</div>
                          {user.schoolPassedYear && (
                            <div className="text-sm text-gray-600">Graduated: {user.schoolPassedYear}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {user.puCollegeName && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="flex items-start">
                        <BookOpen className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900">{user.puCollegeName}</div>
                          {user.puPassedYear && (
                            <div className="text-sm text-gray-600">Completed: {user.puPassedYear}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {user.college && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="flex items-start">
                        <GraduationCap className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                        <div>
                          <div className="font-semibold text-gray-900">{user.college}</div>
                          {user.currentCourse && (
                            <div className="text-sm text-gray-600">{user.currentCourse}</div>
                          )}
                          {user.degree && (
                            <div className="text-sm text-gray-600">{user.degree} - {user.year}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              {user.skills && user.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-green-600" />
                    Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-semibold border border-green-300 hover:shadow-md transition-all duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg p-6 text-center border border-yellow-200">
                <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-yellow-800 mb-1">{stats.pending}</div>
                <div className="text-sm text-yellow-700 font-medium">Pending</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 text-center border border-blue-200">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-800 mb-1">{stats.reviewed}</div>
                <div className="text-sm text-blue-700 font-medium">Reviewed</div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white text-center shadow-xl">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-200" />
              <h3 className="text-lg font-bold mb-2">Ready for More?</h3>
              <p className="text-green-100 text-sm mb-4">Explore new opportunities and advance your career</p>
              <a
                href="/jobs"
                className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 inline-block"
              >
                Browse Internships
              </a>
            </div>
          </div>

          {/* Applications Section */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h2>
                  <p className="text-gray-600">Track the status of your job applications</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 font-medium">Live Updates</span>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading applications...</p>
                  </div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Applications Yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start your career journey by applying for internships and job opportunities
                  </p>
                  <a
                    href="/jobs"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 inline-block"
                  >
                    Explore Opportunities
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {applications.map((application, index) => (
                    <div 
                      key={application._id} 
                      className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-start mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                              <Briefcase className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {application.jobId.title}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Building className="w-4 h-4 mr-2 text-gray-400" />
                                  <span className="font-medium">{application.jobId.company}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>{application.jobId.location}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-green-600 font-bold">₹{application.jobId.salary.toLocaleString()}</span>
                                  <span className="ml-1">per month</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                  <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-3">
                          <div className="flex items-center">
                            {getStatusIcon(application.status)}
                            <span className={`ml-3 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(application.status)}`}>
                              {application.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {application.coverLetter && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <div className="flex items-center mb-3">
                            <FileText className="w-4 h-4 text-gray-500 mr-2" />
                            <h4 className="font-semibold text-gray-900">Cover Letter</h4>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                              {application.coverLetter}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;