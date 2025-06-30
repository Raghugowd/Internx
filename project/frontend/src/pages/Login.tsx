import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Briefcase, X, Shield, FileText, CheckCircle, Users, Search, UserCheck, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
        <div className="overflow-y-auto max-h-[90vh]">
          {children}
        </div>
      </div>
    </div>
  );

  const TermsModal = () => (
    <ModalOverlay onClose={() => setShowTermsModal(false)}>
      <div className="p-8 lg:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h2>
          <p className="text-gray-600">Please read our terms carefully before proceeding</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-700">
          {/* Service Description */}
          <section>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Our Service</h3>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-l-4 border-green-500">
              <p className="font-medium text-green-800 mb-2">🚀 We Apply on Your Behalf</p>
              <p className="text-gray-700">
                Our platform streamlines your internship search by automatically applying to relevant opportunities that match your profile and preferences. We act as your professional representative in the application process, ensuring your applications are submitted promptly and professionally.
              </p>
            </div>
          </section>

          {/* Application Process */}
          <section>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <UserCheck className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Application Process</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <Search className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-medium">Smart Matching</h4>
                </div>
                <p className="text-sm text-gray-600">We analyze your profile and match you with suitable internship opportunities based on your skills, interests, and career goals.</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium">Professional Applications</h4>
                </div>
                <p className="text-sm text-gray-600">Our team ensures all applications are submitted with proper formatting, relevant cover letters, and optimized timing.</p>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Your Responsibilities</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Provide accurate and up-to-date profile information</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Respond promptly to interview invitations and employer communications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Maintain professional conduct throughout the application process</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Notify us immediately of any changes in your availability or preferences</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Terms */}
          <section>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Important Terms</h3>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-xl">
                <h4 className="font-medium text-yellow-800 mb-2">Account Security</h4>
                <p className="text-yellow-700 text-sm">You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
              </div>
              <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-xl">
                <h4 className="font-medium text-blue-800 mb-2">Service Availability</h4>
                <p className="text-blue-700 text-sm">While we strive for 99.9% uptime, we cannot guarantee uninterrupted access to our services due to maintenance or unforeseen circumstances.</p>
              </div>
              <div className="border-l-4 border-purple-400 bg-purple-50 p-4 rounded-r-xl">
                <h4 className="font-medium text-purple-800 mb-2">Intellectual Property</h4>
                <p className="text-purple-700 text-sm">All content, trademarks, and intellectual property on our platform remain our exclusive property unless otherwise stated.</p>
              </div>
            </div>
          </section>

          
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={() => setShowTermsModal(false)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </ModalOverlay>
  );

  const PrivacyModal = () => (
    <ModalOverlay onClose={() => setShowPrivacyModal(false)}>
      <div className="p-8 lg:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
          <p className="text-gray-600">Your privacy is our top priority</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-700">
          {/* Data Collection */}
          <section>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Information We Collect</h3>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
              <p className="font-medium text-blue-800 mb-2">🔒 We Protect Your Data</p>
              <p className="text-gray-700 mb-4">
                When we apply for internships on your behalf, we collect and use only the information necessary to create compelling applications and match you with suitable opportunities.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Personal Information</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Full name and contact details</li>
                    <li>• Educational background</li>
                    <li>• Work experience and skills</li>
                    <li>• Career preferences and goals</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Technical Information</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• IP address and device information</li>
                    <li>• Browser type and version</li>
                    <li>• Usage patterns and preferences</li>
                    <li>• Application interaction data</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Data */}
          <section>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">How We Use Your Information</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Opportunity Matching</h4>
                <p className="text-sm text-gray-600">Analyze your profile to find and apply to internships that align with your skills and career aspirations.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Application Submission</h4>
                <p className="text-sm text-gray-600">Create and submit professional applications to employers on your behalf using your provided information.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Service Improvement</h4>
                <p className="text-sm text-gray-600">Enhance our matching algorithms and application success rates through data analysis and user feedback.</p>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Data Protection & Security</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">🔐 Security Measures</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• End-to-end encryption for data transmission</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Multi-factor authentication for account access</li>
                    <li>• SOC 2 Type II compliance certification</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">⚖️ Data Rights</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Right to access your personal data</li>
                    <li>• Right to correct inaccurate information</li>
                    <li>• Right to delete your account and data</li>
                    <li>• Right to data portability and export</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Third Party Sharing */}
          <section>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="h-4 w-4 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Information Sharing</h3>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-xl">
                <h4 className="font-medium text-green-800 mb-2">✅ When We Share</h4>
                <p className="text-green-700 text-sm">We share your information with potential employers only when applying for internships on your behalf, and only the information necessary for the application process.</p>
              </div>
              <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-xl">
                <h4 className="font-medium text-red-800 mb-2">🚫 When We Don't Share</h4>
                <p className="text-red-700 text-sm">We never sell your personal information to third parties or use it for advertising purposes outside of your internship applications.</p>
              </div>
            </div>
          </section>

         
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={() => setShowPrivacyModal(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </ModalOverlay>
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-green-600 p-3 rounded-2xl">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue your internship journey
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">
                  Sign up here
                </Link>
              </p>
              <p className="text-sm">
                <Link to="/forgot-password" className="text-green-600 hover:text-green-700">
                  Forgot your password?
                </Link>
              </p>
            </div>

            {/* Terms and Privacy Links */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">
                By signing in, you agree to our policies
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-xs">
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2"
                >
                  Terms & Conditions
                </button>
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>

          {/* Admin Login Link */}
          <div className="text-center">
            <Link
              to="/admin/login"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTermsModal && <TermsModal />}
      {showPrivacyModal && <PrivacyModal />}
    </>
  );
};

export default Login;