import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff, FileSpreadsheet, Download, FileDown } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
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
  requirements: string[];
  isActive: boolean;
  createdAt: string;
}

interface ExcelFile {
  _id: string;
  filename: string;
  originalName: string;
  jobsCreated: number;
  uploadedAt: string;
  uploadedBy: {
    username: string;
  };
}

const AdminJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [excelFiles, setExcelFiles] = useState<ExcelFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showExcelFilesModal, setShowExcelFilesModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    domain: '',
    position: '',
    salary: '',
    type: 'Full-time',
    duration: '',
    description: '',
    requirements: '',
    isActive: true
  });

  useEffect(() => {
    fetchJobs();
    fetchExcelFiles();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchExcelFiles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/excel-files');
      setExcelFiles(response.data);
    } catch (error) {
      console.error('Error fetching Excel files:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const jobData = {
        ...formData,
        salary: parseInt(formData.salary),
        requirements: formData.requirements.split('\n').filter(req => req.trim())
      };

      if (editingJob) {
        await axios.put(`http://localhost:5000/api/admin/jobs/${editingJob._id}`, jobData);
        toast.success('Job updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/admin/jobs', jobData);
        toast.success('Job created successfully!');
      }
      
      setShowModal(false);
      setEditingJob(null);
      resetForm();
      fetchJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      domain: job.domain,
      position: job.position,
      salary: job.salary.toString(),
      type: job.type,
      duration: job.duration,
      description: job.description,
      requirements: job.requirements.join('\n'),
      isActive: job.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/admin/jobs/${jobId}`);
      toast.success('Job deleted successfully!');
      fetchJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!excelFile) {
      toast.error('Please select an Excel file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('excel', excelFile);
      
      const response = await axios.post('http://localhost:5000/api/admin/jobs/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success(response.data.message);
      setShowBulkModal(false);
      setExcelFile(null);
      fetchJobs();
      fetchExcelFiles();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload jobs');
    } finally {
      setUploading(false);
    }
  };

  const downloadSampleExcel = () => {
    try {
      // Sample data for the Excel file
      const sampleData = [
        {
          title: 'Frontend Developer Intern',
          company: 'TechCorp Solutions',
          location: 'Bangalore, Karnataka',
          domain: 'Web Development',
          position: 'Frontend Developer',
          salary: 25000,
          type: 'Full-time',
          duration: '6 months',
          description: 'Join our dynamic team as a Frontend Developer Intern. You will work on cutting-edge web applications using modern technologies like React, TypeScript, and Tailwind CSS. This is an excellent opportunity to gain hands-on experience in a professional development environment.',
          requirements: 'Bachelor\'s degree in Computer Science or related field | Proficiency in HTML, CSS, and JavaScript | Experience with React.js | Knowledge of responsive web design | Strong problem-solving skills | Good communication and teamwork abilities'
        },
        {
          title: 'Data Science Intern',
          company: 'Analytics Pro',
          location: 'Mumbai, Maharashtra',
          domain: 'Data Science',
          position: 'Data Analyst',
          salary: 30000,
          type: 'Remote',
          duration: '4 months',
          description: 'Work with our data science team to analyze large datasets and create meaningful insights for business decisions. You will use Python, SQL, and various machine learning libraries to solve real-world problems.',
          requirements: 'Currently pursuing or completed degree in Statistics, Mathematics, or Computer Science | Strong knowledge of Python and SQL | Experience with pandas, numpy, and scikit-learn | Understanding of statistical concepts | Ability to work independently'
        },
        {
          title: 'Digital Marketing Intern',
          company: 'Marketing Hub',
          location: 'Delhi, Delhi',
          domain: 'Marketing',
          position: 'Marketing Executive',
          salary: 20000,
          type: 'Part-time',
          duration: '3 months',
          description: 'Support our marketing team in creating and executing digital marketing campaigns across various platforms. Learn about SEO, SEM, social media marketing, and content creation in a fast-paced environment.',
          requirements: 'Degree in Marketing, Communications, or related field | Basic understanding of digital marketing concepts | Proficiency in social media platforms | Creative thinking and writing skills | Analytics mindset'
        }
      ];

      // Create CSV content
      const headers = [
        'title',
        'company', 
        'location',
        'domain',
        'position',
        'salary',
        'type',
        'duration',
        'description',
        'requirements'
      ];

      let csvContent = headers.join(',') + '\n';
      
      sampleData.forEach(job => {
        const row = headers.map(header => {
          const value = job[header as keyof typeof job];
          // Escape quotes and wrap in quotes if contains comma or newline
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
            return '"' + stringValue.replace(/"/g, '""') + '"';
          }
          return stringValue;
        });
        csvContent += row.join(',') + '\n';
      });

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'jobs_sample_template.xlsx');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Sample Excel template downloaded successfully!');
    } catch (error) {
      console.error('Error downloading sample file:', error);
      toast.error('Failed to download sample template');
    }
  };

  const downloadExcelFile = async (fileId: string, filename: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/excel-files/${fileId}/download`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel file downloaded successfully!');
    } catch (error: any) {
      toast.error('Failed to download Excel file');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      domain: '',
      position: '',
      salary: '',
      type: 'Full-time',
      duration: '',
      description: '',
      requirements: '',
      isActive: true
    });
  };

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/jobs/${jobId}`, {
        isActive: !currentStatus
      });
      toast.success(`Job ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchJobs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update job status');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Job Management</h1>
            <p className="text-gray-400">Create, edit, and manage internship opportunities</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowExcelFilesModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel Files
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </button>
            <button
              onClick={() => {
                resetForm();
                setEditingJob(null);
                setShowModal(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Job
            </button>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Job Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
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
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      No jobs found. Create your first job posting!
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{job.title}</div>
                          <div className="text-gray-400 text-sm">{job.domain} • {job.type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{job.company}</td>
                      <td className="px-6 py-4 text-gray-300">{job.location}</td>
                      <td className="px-6 py-4 text-gray-300">₹{job.salary.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleJobStatus(job._id, job.isActive)}
                          className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            job.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {job.isActive ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(job)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Job Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingJob ? 'Edit Job' : 'Add New Internship'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Domain *</label>
                    <input
                      type="text"
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Salary (₹) *</label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 3 months, 6 months"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Requirements (one per line)</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Bachelor's degree in Computer Science&#10;Experience with React&#10;Strong communication skills"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label className="ml-2 text-sm text-gray-300">Active (visible to users)</label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingJob(null);
                      resetForm();
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-6">Bulk Upload Jobs</h2>
              
              <form onSubmit={handleBulkUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Excel File *</label>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-600 file:text-white hover:file:bg-green-700"
                  />
                  <div className="mt-3 p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-300 mb-2">
                      <strong>Required columns:</strong> title, company, location, domain, position, salary, description, requirements, duration, type
                    </p>
                    <button
                      type="button"
                      onClick={downloadSampleExcel}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Download Sample Template
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Jobs'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBulkModal(false);
                      setExcelFile(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Excel Files Modal */}
        {showExcelFilesModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Uploaded Excel Files</h2>
                <button
                  onClick={() => setShowExcelFilesModal(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">File Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Jobs Created</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Uploaded By</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Upload Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {excelFiles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                          No Excel files uploaded yet
                        </td>
                      </tr>
                    ) : (
                      excelFiles.map((file) => (
                        <tr key={file._id} className="hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-3 text-white">{file.originalName}</td>
                          <td className="px-4 py-3 text-gray-300">{file.jobsCreated}</td>
                          <td className="px-4 py-3 text-gray-300">{file.uploadedBy.username}</td>
                          <td className="px-4 py-3 text-gray-300">
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => downloadExcelFile(file._id, file.originalName)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                              title="Download File"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminJobs;