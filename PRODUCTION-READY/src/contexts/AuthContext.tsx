import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  year: string;
  schoolName: string;
  schoolPassedYear: string;
  puCollegeName: string;
  puPassedYear: string;
  currentCourse: string;
  skills: string[];
  resume: string;
  profilePicture: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      if (userType === 'admin') {
        const adminData = localStorage.getItem('adminData');
        if (adminData) {
          setAdmin(JSON.parse(adminData));
        }
      } else {
        const userData = localStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    }
    
    setIsLoading(false);
  }, []);

  const sendOTP = async (email: string) => {
    const response = await axios.post(`${API_BASE_URL}/send-otp`, { email });
    return response.data;
  };

  const register = async (userData: any) => {
    let registrationData = { ...userData };

    // Handle resume file conversion to base64
    if (userData.resume instanceof File) {
      const base64 = await convertFileToBase64(userData.resume);
      registrationData.resumeData = base64;
      registrationData.resumeFilename = userData.resume.name;
      registrationData.resumeContentType = userData.resume.type;
      delete registrationData.resume;
    }

    // Handle profile picture file conversion to base64
    if (userData.profilePicture instanceof File) {
      const base64 = await convertFileToBase64(userData.profilePicture);
      registrationData.profilePictureData = base64;
      registrationData.profilePictureFilename = userData.profilePicture.name;
      registrationData.profilePictureContentType = userData.profilePicture.type;
      delete registrationData.profilePicture;
    }

    // Handle skills array
    if (Array.isArray(userData.skills)) {
      registrationData.skills = userData.skills;
    }

    const response = await axios.post(`${API_BASE_URL}/register`, registrationData);

    const { token, user: newUser } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(newUser));
    localStorage.setItem('userType', 'user');
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(newUser);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data:application/pdf;base64, prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    const { token, user: userData } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userType', 'user');
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const adminLogin = async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, { username, password });
    const { token, admin: adminData } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    localStorage.setItem('userType', 'admin');
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminData');
    localStorage.removeItem('userType');
    
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setAdmin(null);
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
      sendOTP
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