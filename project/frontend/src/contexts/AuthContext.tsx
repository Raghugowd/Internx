import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  currentCity: string;
  futureGoals: string;
  studyPreference: string;
  section: string;
  higherEducation: string;
  twelfthPU: {
    institution: string;
    passedYear: string;
    percentage: string;
  };
  ugDegree: {
    institution: string;
    course: string;
    year: string;
    percentage: string;
  };
  pgMasters: {
    institution: string;
    course: string;
    year: string;
    percentage: string;
  };
  skills: string[];
  keywords: string[];
  resume: boolean;
  profilePicture: boolean;
  applicationCount: number;
}

interface Admin {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  sendOTP: (email: string) => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fixed API base URL configuration
const getApiBaseUrl = () => {
  // Always use localhost for development
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Configure axios defaults
axios.defaults.timeout = 10000; // 10 second timeout
axios.defaults.withCredentials = true;

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider initializing...');
    console.log('📍 API Base URL:', API_BASE_URL);
    
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      if (userType === 'admin') {
        const adminData = localStorage.getItem('adminData');
        if (adminData) {
          try {
            const parsedAdmin = JSON.parse(adminData);
            setAdmin(parsedAdmin);
            console.log('✅ Admin restored from localStorage:', parsedAdmin.username);
          } catch (error) {
            console.error('❌ Error parsing admin data:', error);
            localStorage.removeItem('adminData');
          }
        }
      } else {
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            console.log('✅ User restored from localStorage:', parsedUser.email);
          } catch (error) {
            console.error('❌ Error parsing user data:', error);
            localStorage.removeItem('userData');
          }
        }
      }
    }
    
    setIsLoading(false);
    console.log('✅ AuthProvider initialized');
  }, []);

  const sendOTP = async (email: string) => {
    try {
      console.log('📧 Sending OTP to:', email);
      const response = await axios.post(`${API_BASE_URL}/send-otp`, { email });
      console.log('✅ OTP sent successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Send OTP failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      console.log('👤 Registering user:', userData.email);
      let registrationData = { ...userData };

      // Handle resume file conversion to base64
      if (userData.resume instanceof File) {
        console.log('📄 Converting resume to base64...');
        const base64 = await convertFileToBase64(userData.resume);
        registrationData.resumeData = base64;
        registrationData.resumeFilename = userData.resume.name;
        registrationData.resumeContentType = userData.resume.type;
        delete registrationData.resume;
      }

      // Handle profile picture file conversion to base64
      if (userData.profilePicture instanceof File) {
        console.log('🖼️ Converting profile picture to base64...');
        const base64 = await convertFileToBase64(userData.profilePicture);
        registrationData.profilePictureData = base64;
        registrationData.profilePictureFilename = userData.profilePicture.name;
        registrationData.profilePictureContentType = userData.profilePicture.type;
        delete registrationData.profilePicture;
      }

      // Handle skills and keywords arrays
      if (Array.isArray(userData.skills)) {
        registrationData.skills = userData.skills;
      }
      if (Array.isArray(userData.keywords)) {
        registrationData.keywords = userData.keywords;
      }

      const response = await axios.post(`${API_BASE_URL}/register`, registrationData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(newUser));
      localStorage.setItem('userType', 'user');
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(newUser);
      
      console.log('✅ User registered successfully:', newUser.email);
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Logging in user:', email);
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userType', 'user');
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      console.log('✅ User login successful:', userData.email);
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const adminLogin = async (username: string, password: string) => {
    try {
      console.log('🔐 Admin login attempt:', username);
      const response = await axios.post(`${API_BASE_URL}/admin/login`, { username, password });
      const { token, admin: adminData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('adminData', JSON.stringify(adminData));
      localStorage.setItem('userType', 'admin');
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAdmin(adminData);
      
      console.log('✅ Admin login successful:', adminData.username);
    } catch (error: any) {
      console.error('❌ Admin login failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      console.log('📝 Updating profile...');
      let updateData = { ...userData };

      // Handle profile picture file conversion to base64
      if (userData.profilePicture instanceof File) {
        const base64 = await convertFileToBase64(userData.profilePicture);
        updateData.profilePictureData = base64;
        updateData.profilePictureFilename = userData.profilePicture.name;
        updateData.profilePictureContentType = userData.profilePicture.type;
        delete updateData.profilePicture;
      }

      // Handle resume file conversion to base64
      if (userData.resume instanceof File) {
        const base64 = await convertFileToBase64(userData.resume);
        updateData.resumeData = base64;
        updateData.resumeFilename = userData.resume.name;
        updateData.resumeContentType = userData.resume.type;
        delete updateData.resume;
      }

      const response = await axios.put(`${API_BASE_URL}/profile`, updateData);
      const { user: updatedUser } = response.data;
      
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      console.log('✅ Profile updated successfully');
    } catch (error: any) {
      console.error('❌ Profile update failed:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminData');
    localStorage.removeItem('userType');
    
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setAdmin(null);
    
    console.log('✅ Logout successful');
  };

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      isLoading,
      login,
      adminLogin,
      register,
      logout,
      sendOTP,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};