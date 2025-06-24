import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, Briefcase, Clock, Building, TrendingUp, Sparkles } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  domain: string;
  position: string;
  salary: number;
  type: string;
  duration: string;
  description: string;
  createdAt: string;
}

interface Pagination {
  current: number;
  pages: number;
  total: number;
}

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({ current: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    domain: '',
    position: '',
    minSalary: '',
    maxSalary: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [pagination.current]);

  useEffect(() => {
    // Get filters from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const newFilters = {
      search: urlParams.get('search') || '',
      location: urlParams.get('location') || '',
      domain: urlParams.get('domain') || '',
      position: urlParams.get('position') || '',
      minSalary: urlParams.get('minSalary') || '',
      maxSalary: urlParams.get('maxSalary') || ''
    };
    setFilters(newFilters);
  }, []);

  const fetchJobs = async (page = pagination.current) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      
      params.set('page', page.toString());
      params.set('limit', '12');

      const response = await axios.get(`http://localhost:5000/api/jobs?${params.toString()}`);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchJobs(1);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      domain: '',
      position: '',
      minSalary: '',
      maxSalary: ''
    });
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchJobs(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modern Header with Gradient */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100/80 backdrop-blur-sm border border-green-200/50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>New opportunities added daily</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-green-600 bg-clip-text text-transparent mb-4">
            Find Your Perfect Internship
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing opportunities from top companies and kickstart your career journey
          </p>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl shadow-green-500/5 p-8 mb-8">
          {/* Main Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-green-500 transition-colors" />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200/80 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              />
            </div>
            <div className="flex-1 relative group">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-green-500 transition-colors" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200/80 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white/80"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105"
            >
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`border border-gray-300/80 hover:border-green-500/50 text-gray-700 hover:text-green-600 px-6 py-4 rounded-2xl font-medium transition-all duration-300 flex items-center backdrop-blur-sm ${showFilters ? 'bg-green-50/80 border-green-300' : 'bg-white/50 hover:bg-white/80'}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Enhanced Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200/50 pt-6 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Domain</label>
                  <input
                    type="text"
                    placeholder="e.g., Technology, Marketing"
                    value={filters.domain}
                    onChange={(e) => handleFilterChange('domain', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300/80 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Position</label>
                  <input
                    type="text"  
                    placeholder="e.g., Developer, Intern"
                    value={filters.position}
                    onChange={(e) => handleFilterChange('position', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300/80 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Min Salary (₹)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={filters.minSalary}
                    onChange={(e) => handleFilterChange('minSalary', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300/80 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Max Salary (₹)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={filters.maxSalary}
                    onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300/80 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSearch}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="border border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600 px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Results Count */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <p className="text-gray-600 font-medium">
              Showing <span className="text-green-600 font-semibold">{jobs.length}</span> of <span className="text-green-600 font-semibold">{pagination.total}</span> opportunities
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live updates</span>
          </div>
        </div>

        {/* Enhanced Jobs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
              <div className="absolute top-0 left-0 animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-green-50 rounded-3xl p-8 max-w-md mx-auto">
              <Briefcase className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search filters to discover more opportunities</p>
              <button
                onClick={clearFilters}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {jobs.map((job, index) => (
              <div 
                key={job._id} 
                className="group bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-lg shadow-gray-500/5 p-8 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-2xl group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                    <Briefcase className="h-7 w-7 text-green-600" />
                  </div>
                  <span className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200/50">
                    {job.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-800 transition-colors duration-300">
                  {job.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-3 text-green-500" />
                    <span className="text-sm font-medium">{job.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-3 text-green-500" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-3 text-green-500" />
                    <span className="text-sm">{job.duration}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                        ₹{job.salary.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">/month</span>
                    </div>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center space-x-3">
            <button
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  page === pagination.current
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/80 backdrop-blur-sm'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 bg-white/80 backdrop-blur-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;