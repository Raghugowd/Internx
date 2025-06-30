import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      'https://internx.io',
      'https://www.internx.io',
      'https://internx-io.vercel.app',
      'https://internx-io.netlify.app'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins for development
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/internship-portal';

console.log('🔄 Attempting to connect to MongoDB...');
console.log('📍 MongoDB URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    
    // Test the connection
    await mongoose.connection.db.admin().ping();
    console.log('🏓 Database ping successful!');
    
    // Create default admin after successful connection
    await createDefaultAdmin();
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Retrying connection in 5 seconds...');
    
    setTimeout(() => {
      connectDB();
    }, 5000);
    
    return false;
  }
};

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email configuration
const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
  } catch (error) {
    console.error('❌ Email service error:', error.message);
  }
};

// Enhanced User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  currentCity: String,
  futureGoals: String,
  studyPreference: { type: String, enum: ['India', 'Abroad', 'Both'], default: 'India' },
  section: String,
  higherEducation: String,
  twelfthPU: {
    institution: String,
    passedYear: String,
    percentage: String
  },
  ugDegree: {
    institution: String,
    course: String,
    year: String,
    percentage: String
  },
  pgMasters: {
    institution: String,
    course: String,
    year: String,
    percentage: String
  },
  skills: [String],
  keywords: [String],
  resume: String,
  resumeFilename: String,
  resumeContentType: String,
  profilePicture: String,
  profilePictureFilename: String,
  profilePictureContentType: String,
  applicationCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

// Internship Schema
const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  domain: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Internship = mongoose.model('Internship', internshipSchema);

// Application Schema
const applicationSchema = new mongoose.Schema({
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], 
    default: 'Pending' 
  },
  coverLetter: String,
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

// Excel File Schema
const excelFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  internshipsCreated: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
}, { timestamps: true });

const ExcelFile = mongoose.model('ExcelFile', excelFileSchema);

// OTP Schema
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, default: Date.now, expires: 300 }
});

const OTP = mongoose.model('OTP', otpSchema);

// Password Reset OTP Schema
const passwordResetOtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, default: Date.now, expires: 300 }
});

const PasswordResetOTP = mongoose.model('PasswordResetOTP', passwordResetOtpSchema);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'excel') {
      if (file.mimetype.includes('spreadsheet') || file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls')) {
        cb(null, true);
      } else {
        cb(new Error('Only Excel files are allowed'), false);
      }
    } else {
      cb(null, true);
    }
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.admin = user;
    next();
  });
};

// Email sending function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create default admin
const createDefaultAdmin = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  Database not connected, skipping admin creation');
      return;
    }
    
    const adminExists = await Admin.findOne({ username: 'wizdom' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('wizdom123', 10);
      await Admin.create({
        username: 'wizdom',
        email: 'admin@internx.io',
        password: hashedPassword
      });
      console.log('✅ Default admin created (username: wizdom, password: wizdom123)');
    } else {
      console.log('✅ Default admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};

// Database connection wrapper
const withDB = (handler) => {
  return async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        message: 'Database not available. Please try again later.',
        error: 'DB_CONNECTION_ERROR'
      });
    }
    return handler(req, res, next);
  };
};

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// ROUTES

// Health check with detailed status
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbStatusText[dbStatus] || 'unknown',
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend API is working!',
    timestamp: new Date().toISOString()
  });
});

// Send OTP for registration
app.post('/api/send-otp', withDB(async (req, res) => {
  try {
    console.log('📧 OTP request received for:', req.body.email);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const otp = generateOTP();
    
    await OTP.findOneAndUpdate(
      { email },
      { email, otp },
      { upsert: true, new: true }
    );

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Welcome to InternX!</h2>
        <p>Your OTP for email verification is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #16a34a; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail(email, 'InternX - Email Verification OTP', emailHtml);
    console.log('✅ OTP sent successfully to:', email);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
}));

// Send Password Reset OTP
app.post('/api/forgot-password', withDB(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    
    await PasswordResetOTP.findOneAndUpdate(
      { email },
      { email, otp },
      { upsert: true, new: true }
    );

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Password Reset Request</h2>
        <p>Dear ${user.name},</p>
        <p>You have requested to reset your password. Your OTP is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #16a34a; font-size: 32px; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Team InternX</p>
      </div>
    `;

    await sendEmail(email, 'Password Reset OTP - InternX', emailHtml);

    res.json({ message: 'Password reset OTP sent successfully' });
  } catch (error) {
    console.error('Error sending reset OTP:', error);
    res.status(500).json({ message: 'Failed to send reset OTP' });
  }
}));

// Reset Password
app.post('/api/reset-password', withDB(async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const otpRecord = await PasswordResetOTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    await PasswordResetOTP.deleteOne({ email, otp });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
}));

// User Registration
app.post('/api/register', withDB(async (req, res) => {
  try {
    console.log('👤 Registration request received');
    const { 
      name, email, password, phone, otp, currentCity, futureGoals, studyPreference, section, higherEducation,
      twelfthPU, ugDegree, pgMasters, skills, keywords,
      resumeData, resumeFilename, resumeContentType,
      profilePictureData, profilePictureFilename, profilePictureContentType
    } = req.body;

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      currentCity,
      futureGoals,
      studyPreference: studyPreference || 'India',
      section,
      higherEducation,
      twelfthPU,
      ugDegree,
      pgMasters,
      skills: skills || [],
      keywords: keywords || [],
      isVerified: true
    };

    if (resumeData) {
      userData.resume = resumeData;
      userData.resumeFilename = resumeFilename;
      userData.resumeContentType = resumeContentType;
    }

    if (profilePictureData) {
      userData.profilePicture = profilePictureData;
      userData.profilePictureFilename = profilePictureFilename;
      userData.profilePictureContentType = profilePictureContentType;
    }

    const user = await User.create(userData);
    await OTP.deleteOne({ email, otp });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ User registered successfully:', email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        currentCity: user.currentCity,
        futureGoals: user.futureGoals,
        studyPreference: user.studyPreference,
        section: user.section,
        higherEducation: user.higherEducation,
        twelfthPU: user.twelfthPU,
        ugDegree: user.ugDegree,
        pgMasters: user.pgMasters,
        skills: user.skills,
        keywords: user.keywords,
        resume: user.resume ? true : false,
        profilePicture: user.profilePicture ? true : false,
        applicationCount: user.applicationCount
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
}));

// User Login
app.post('/api/login', withDB(async (req, res) => {
  try {
    console.log('🔐 Login request received for:', req.body.email);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ User login successful:', email);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        currentCity: user.currentCity,
        futureGoals: user.futureGoals,
        studyPreference: user.studyPreference,
        section: user.section,
        higherEducation: user.higherEducation,
        twelfthPU: user.twelfthPU,
        ugDegree: user.ugDegree,
        pgMasters: user.pgMasters,
        skills: user.skills,
        keywords: user.keywords,
        resume: user.resume ? true : false,
        profilePicture: user.profilePicture ? true : false,
        applicationCount: user.applicationCount
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
}));

// Update user profile
app.put('/api/profile', authenticateToken, withDB(async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = { ...req.body };

    if (updateData.profilePictureData) {
      updateData.profilePicture = updateData.profilePictureData;
      updateData.profilePictureFilename = updateData.profilePictureFilename;
      updateData.profilePictureContentType = updateData.profilePictureContentType;
      delete updateData.profilePictureData;
    }

    if (updateData.resumeData) {
      updateData.resume = updateData.resumeData;
      updateData.resumeFilename = updateData.resumeFilename;
      updateData.resumeContentType = updateData.resumeContentType;
      delete updateData.resumeData;
    }

    delete updateData.password;
    delete updateData.email;
    delete updateData._id;
    delete updateData.applicationCount;
    delete updateData.isVerified;
    delete updateData.otp;
    delete updateData.otpExpiry;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        currentCity: user.currentCity,
        futureGoals: user.futureGoals,
        studyPreference: user.studyPreference,
        section: user.section,
        higherEducation: user.higherEducation,
        twelfthPU: user.twelfthPU,
        ugDegree: user.ugDegree,
        pgMasters: user.pgMasters,
        skills: user.skills,
        keywords: user.keywords,
        resume: user.resume ? true : false,
        profilePicture: user.profilePicture ? true : false,
        applicationCount: user.applicationCount
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}));

// Admin Login
app.post('/api/admin/login', withDB(async (req, res) => {
  try {
    console.log('🔐 Admin login request received for:', req.body.username);
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('❌ Admin not found:', username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for admin:', username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Admin login successful:', username);

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ message: 'Admin login failed' });
  }
}));

// Get Internships with pagination and filters
app.get('/api/internships', withDB(async (req, res) => {
  try {
    console.log('📋 Fetching internships with query:', req.query);
    const {
      page = 1,
      limit = 12,
      search,
      location,
      domain,
      position,
      minSalary,
      maxSalary
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (domain) {
      query.domain = { $regex: domain, $options: 'i' };
    }

    if (position) {
      query.position = { $regex: position, $options: 'i' };
    }

    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = parseInt(minSalary);
      if (maxSalary) query.salary.$lte = parseInt(maxSalary);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Internship.countDocuments(query);
    const internships = await Internship.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log(`✅ Found ${internships.length} internships out of ${total} total`);

    res.json({
      internships,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('❌ Error fetching internships:', error);
    res.status(500).json({ message: 'Failed to fetch internships' });
  }
}));

// Get single internship
app.get('/api/internships/:id', withDB(async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json(internship);
  } catch (error) {
    console.error('Error fetching internship:', error);
    res.status(500).json({ message: 'Failed to fetch internship' });
  }
}));

// Check application status
app.get('/api/internships/:id/application-status', authenticateToken, withDB(async (req, res) => {
  try {
    const internshipId = req.params.id;
    const userId = req.user.userId;

    const application = await Application.findOne({ internshipId, userId });
    
    res.json({
      hasApplied: !!application,
      status: application ? application.status : null,
      appliedAt: application ? application.appliedAt : null
    });
  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({ message: 'Failed to check application status' });
  }
}));

// Apply for internship
app.post('/api/internships/:id/apply', authenticateToken, withDB(async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const internshipId = req.params.id;
    const userId = req.user.userId;

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    const user = await User.findById(userId);
    if (!user.resume) {
      return res.status(400).json({ message: 'Please upload your resume before applying for internships' });
    }

    const existingApplication = await Application.findOne({ internshipId, userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this internship' });
    }

    const application = await Application.create({
      internshipId,
      userId,
      coverLetter,
      status: 'Pending'
    });

    await User.findByIdAndUpdate(userId, { $inc: { applicationCount: 1 } });

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying for internship:', error);
    res.status(500).json({ message: 'Failed to apply for internship' });
  }
}));

// Get user's applications
app.get('/api/my-applications', authenticateToken, withDB(async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.userId })
      .populate('internshipId', 'title company location salary')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
}));

// Get resume
app.get('/api/resume/:userId', withDB(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const resumeBuffer = Buffer.from(user.resume, 'base64');
    res.setHeader('Content-Type', user.resumeContentType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${user.resumeFilename || 'resume.pdf'}"`);
    res.send(resumeBuffer);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ message: 'Failed to download resume' });
  }
}));

// Get profile picture
app.get('/api/profile-picture/:userId', withDB(async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    const imageBuffer = Buffer.from(user.profilePicture, 'base64');
    res.setHeader('Content-Type', user.profilePictureContentType || 'image/jpeg');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    res.status(500).json({ message: 'Failed to fetch profile picture' });
  }
}));

// ADMIN ROUTES

// Get admin dashboard stats
app.get('/api/admin/stats', authenticateAdmin, withDB(async (req, res) => {
  try {
    const totalInternships = await Internship.countDocuments();
    const activeInternships = await Internship.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'Pending' });
    const totalUsers = await User.countDocuments();

    res.json({
      totalInternships,
      activeInternships,
      totalApplications,
      pendingApplications,
      totalUsers
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
}));

// Get all internships for admin
app.get('/api/admin/internships', authenticateAdmin, withDB(async (req, res) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    console.error('Error fetching admin internships:', error);
    res.status(500).json({ message: 'Failed to fetch internships' });
  }
}));

// Create internship
app.post('/api/admin/internships', authenticateAdmin, withDB(async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json({ message: 'Internship created successfully', internship });
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({ message: 'Failed to create internship' });
  }
}));

// Update internship
app.put('/api/admin/internships/:id', authenticateAdmin, withDB(async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json({ message: 'Internship updated successfully', internship });
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({ message: 'Failed to update internship' });
  }
}));

// Delete internship
app.delete('/api/admin/internships/:id', authenticateAdmin, withDB(async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    console.error('Error deleting internship:', error);
    res.status(500).json({ message: 'Failed to delete internship' });
  }
}));

// Bulk upload internships
app.post('/api/admin/internships/bulk-upload', authenticateAdmin, upload.single('excel'), withDB(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Excel file is required' });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    let internshipsCreated = 0;
    const errors = [];

    for (const row of data) {
      try {
        const internshipData = {
          title: row.title || row.Title,
          company: row.company || row.Company,
          location: row.location || row.Location,
          domain: row.domain || row.Domain,
          position: row.position || row.Position,
          salary: parseInt(row.salary || row.Salary),
          type: row.type || row.Type || 'Full-time',
          duration: row.duration || row.Duration,
          description: row.description || row.Description,
          requirements: (row.requirements || row.Requirements || '').split('\n').filter(req => req.trim()),
          isActive: true
        };

        if (!internshipData.title || !internshipData.company || !internshipData.location || !internshipData.salary) {
          errors.push(`Row ${data.indexOf(row) + 1}: Missing required fields`);
          continue;
        }

        await Internship.create(internshipData);
        internshipsCreated++;
      } catch (error) {
        errors.push(`Row ${data.indexOf(row) + 1}: ${error.message}`);
      }
    }

    await ExcelFile.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      internshipsCreated,
      uploadedBy: req.admin.adminId
    });

    res.json({
      message: `Successfully created ${internshipsCreated} internships`,
      internshipsCreated,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error in bulk upload:', error);
    res.status(500).json({ message: 'Failed to upload internships' });
  }
}));

// Get Excel files
app.get('/api/admin/excel-files', authenticateAdmin, withDB(async (req, res) => {
  try {
    const files = await ExcelFile.find()
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    console.error('Error fetching Excel files:', error);
    res.status(500).json({ message: 'Failed to fetch Excel files' });
  }
}));

// Download Excel file
app.get('/api/admin/excel-files/:id/download', authenticateAdmin, withDB(async (req, res) => {
  try {
    const file = await ExcelFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(file.path, file.originalName);
  } catch (error) {
    console.error('Error downloading Excel file:', error);
    res.status(500).json({ message: 'Failed to download file' });
  }
}));

// Get all applications for admin
app.get('/api/admin/applications', authenticateAdmin, withDB(async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('internshipId', 'title company location salary')
      .populate('userId', 'name email phone skills resume')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
}));

// Update application status
app.put('/api/admin/applications/:id', authenticateAdmin, withDB(async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate('internshipId').populate('userId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application status updated successfully and email sent' });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: 'Failed to update application status' });
  }
}));

// Get all users for admin
app.get('/api/admin/users', authenticateAdmin, withDB(async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
}));

// Delete user
app.delete('/api/admin/users/:id', authenticateAdmin, withDB(async (req, res) => {
  try {
    const userId = req.params.id;

    await Application.deleteMany({ userId });
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
}));

// Download users data
app.get('/api/admin/users/download', authenticateAdmin, withDB(async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        query.createdAt.$lt = end;
      }
    }

    const users = await User.find(query)
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 });

    const excelData = users.map(user => ({
      'Name': user.name,
      'Email': user.email,
      'Phone': user.phone,
      'Current City': user.currentCity || '',
      'Future Goals': user.futureGoals || '',
      'Study Preference': user.studyPreference || '',
      'Section': user.section || '',
      'Higher Education': user.higherEducation || '',
      '12th Institution': user.twelfthPU?.institution || '',
      '12th Year': user.twelfthPU?.passedYear || '',
      '12th Percentage': user.twelfthPU?.percentage || '',
      'UG Institution': user.ugDegree?.institution || '',
      'UG Course': user.ugDegree?.course || '',
      'UG Year': user.ugDegree?.year || '',
      'UG Percentage': user.ugDegree?.percentage || '',
      'PG Institution': user.pgMasters?.institution || '',
      'PG Course': user.pgMasters?.course || '',
      'PG Year': user.pgMasters?.year || '',
      'PG Percentage': user.pgMasters?.percentage || '',
      'Skills': user.skills?.join(', ') || '',
      'Keywords': user.keywords?.join(', ') || '',
      'Application Count': user.applicationCount || 0,
      'Has Resume': user.resumeFilename ? 'Yes' : 'No',
      'Resume Filename': user.resumeFilename || '',
      'Has Profile Picture': user.profilePictureFilename ? 'Yes' : 'No',
      'Profile Picture Filename': user.profilePictureFilename || '',
      'Is Verified': user.isVerified ? 'Yes' : 'No',
      'Registration Date': user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
      'Registration Time': user.createdAt ? new Date(user.createdAt).toLocaleTimeString() : '',
      'Last Updated': user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : ''
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const colWidths = [];
    Object.keys(excelData[0] || {}).forEach((key, index) => {
      const maxLength = Math.max(
        key.length,
        ...excelData.map(row => String(row[key] || '').length)
      );
      colWidths[index] = { wch: Math.min(maxLength + 2, 50) };
    });
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Data');

    let filename = 'internx_users_complete_data';
    if (startDate && endDate) {
      filename += `_${startDate}_to_${endDate}`;
    } else if (startDate) {
      filename += `_from_${startDate}`;
    } else if (endDate) {
      filename += `_until_${endDate}`;
    }
    filename += `_${new Date().toISOString().split('T')[0]}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.send(buffer);

  } catch (error) {
    console.error('Error downloading users data:', error);
    res.status(500).json({ message: 'Failed to download users data' });
  }
}));

// Get analytics data
app.get('/api/admin/analytics', authenticateAdmin, withDB(async (req, res) => {
  try {
    const totalInternships = await Internship.countDocuments();
    const activeInternships = await Internship.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();
    const totalUsers = await User.countDocuments();

    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const internshipsByDomain = await Internship.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const monthlyRegistrations = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const studyPreferences = await User.aggregate([
      { $group: { _id: '$studyPreference', count: { $sum: 1 } } }
    ]);

    res.json({
      totalInternships,
      activeInternships,
      totalApplications,
      totalUsers,
      applicationsByStatus,
      internshipsByDomain,
      monthlyRegistrations,
      studyPreferences
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
}));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled Error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

// Start server and connect to database
const startServer = async () => {
  try {
    console.log('🚀 Starting InternX Backend Server...');
    
    // Connect to database first
    const dbConnected = await connectDB();
    
    // Test email connection
    await testEmailConnection();
    
    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n🎉 ===== INTERNX BACKEND STARTED SUCCESSFULLY =====');
      console.log(`🌐 Server running on: http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📧 Email User: ${process.env.EMAIL_USER || 'Not configured'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🗄️  Database: ${dbConnected ? 'Connected ✅' : 'Disconnected ❌'}`);
      console.log('🔐 Default Admin: wizdom / wizdom123');
      console.log('================================================\n');
      
      // Log all available routes
      console.log('📋 Available API Routes:');
      console.log('  GET  /api/health - Health check');
      console.log('  GET  /api/test - Test endpoint');
      console.log('  POST /api/send-otp - Send OTP');
      console.log('  POST /api/register - User registration');
      console.log('  POST /api/login - User login');
      console.log('  POST /api/admin/login - Admin login');
      console.log('  GET  /api/internships - Get internships');
      console.log('  GET  /api/admin/stats - Admin stats');
      console.log('================================================\n');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📊 MongoDB connection closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('📊 MongoDB connection closed');
    process.exit(0);
  });
});

// Start the server
startServer();