import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Create uploads directory for Excel files
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync('uploads/excel')) {
  fs.mkdirSync('uploads/excel');
}

// Enhanced User Schema with additional fields and profile picture
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Academic Information
  college: { type: String },
  degree: { type: String },
  year: { type: String },
  
  // Additional Academic Details
  schoolName: { type: String },
  schoolPassedYear: { type: String },
  puCollegeName: { type: String },
  puPassedYear: { type: String },
  currentCourse: { type: String },
  
  skills: [String],
  resume: {
    data: String, // base64 encoded file data
    filename: String,
    contentType: String
  },
  
  // Profile Picture stored as base64
  profilePicture: {
    data: String, // base64 encoded image data
    filename: String,
    contentType: String
  },
  
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Enhanced Job Schema
const jobschema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  domain: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  description: { type: String, required: true },
  requirements: [String],
  duration: { type: String, required: true },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Remote'], default: 'Full-time' },
  
  // Additional fields from Excel data
  source: { type: String, default: 'Manual' }, // internshala, manual, etc.
  postedBy: { type: String },
  applicationDeadline: { type: Date },
  state: { type: String },
  category: { type: String },
  companyWebsite: { type: String },
  companyEmail: { type: String },
  companyLinkedIn: { type: String },
  applicationLink: { type: String },
  stipendRange: { type: String },
  ppoSalary: { type: String },
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Excel File Schema for storing uploaded files
const excelFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  jobsCreated: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now }
});

// Application Schema
const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], default: 'Pending' },
  coverLetter: { type: String },
  appliedAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Job = mongoose.model('Job', jobschema);
const ExcelFile = mongoose.model('ExcelFile', excelFileSchema);
const Application = mongoose.model('Application', applicationSchema);

// Create default admin and sample jobs
async function createDefaultData() {
  try {
    const existingAdmin = await Admin.findOne({ username: 'wizdom' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('wizdom@123', 12);
      await Admin.create({
        username: 'wizdom',
        password: hashedPassword,
        email: process.env.EMAIL_USER
      });
      console.log('Default admin created: username=wizdom, password=wizdom@123');
    }

    // Add sample jobs from the provided data
    const existingjobs = await Job.countDocuments();
    if (existingjobs === 0) {
      const samplejobs = [
        {
          title: "Electrical Engineering Intern",
          company: "Planys Technologies Private Limited",
          location: "Chennai, Tamil Nadu",
          domain: "Electrical Engineering",
          position: "Intern",
          salary: 13500,
          description: "As an intern, you will be actively involved in both the hardware and documentation aspects of ROV (Remotely Operated Vehicle) and AUV (Autonomous Underwater Vehicle) development. Your day-to-day tasks will include:\n\n• Developing and testing embedded systems and working with PCB design tools\n• Performing soldering and hardware testing on OEM components used in marine robotics\n• Assisting with market research, creating Bills of Materials (BOM), preparing reports and manuals, and supporting inventory and vendor coordination\n\nPreferred Skills & Experience:\n• Hands-on experience in electrical or electronics projects\n• Solid understanding of electronic components and the use of testing/measuring instruments\n• Proficiency in Microsoft Office, particularly PowerPoint, Excel, and Word\n• Strong communication skills—both verbal and written",
          requirements: ["Arduino", "C++ Programming", "PCB Design", "Embedded Systems", "Electronics"],
          duration: "6 Months",
          type: "Full-time",
          source: "internshala",
          category: "Engineering",
          companyWebsite: "https://planystech.com/",
          companyEmail: "info@planystech.com",
          applicationDeadline: new Date('2025-06-02'),
          stipendRange: "12,000 - 15,000"
        },
        {
          title: "Sales Engineer Intern",
          company: "Dee Tec Tools LLP",
          location: "Chennai, Tamil Nadu",
          domain: "Sales",
          position: "Sales Engineer",
          salary: 10000,
          description: "As an intern, your day-to-day tasks will include:\n\n• Supporting the sales team in spotting and qualifying potential business leads\n• Coordinating with engineering and product teams to understand and showcase technical aspects of our offerings\n• Making regular visits to industrial zones and hardware markets to identify product needs and opportunities\n• Working with various departments to deliver prompt and accurate responses to customer queries\n• Performing market research and analyzing competitors to help shape strategic sales efforts\n• Participating in client meetings and calls alongside senior sales engineers for real-world exposure\n• Updating CRM systems and helping with sales data reporting and analysis",
          requirements: ["Client Relationship Management (CRM)", "Effective Communication", "Sales", "Sales Strategy", "Sales Support"],
          duration: "3 Months",
          type: "Full-time",
          source: "internshala",
          category: "Sales",
          companyWebsite: "https://deetec.in/",
          companyEmail: "sales@deetec.in",
          applicationDeadline: new Date('2025-06-03')
        },
        {
          title: "Digital Marketing Intern",
          company: "Minav Tech",
          location: "Chennai, Tamil Nadu",
          domain: "Digital Marketing",
          position: "Marketing Intern",
          salary: 4000,
          description: "Selected intern's day-to-day responsibilities include:\n\n1. Working with digital marketing projects to promote and use tools for digital marketing activities\n2. Designing posters and posting on all social media websites\n3. Creating and maintaining technical documentation",
          requirements: ["Digital Marketing", "Search Engine Optimization (SEO)", "Social Media Marketing", "Content Creation"],
          duration: "6 Months",
          type: "Full-time",
          source: "internshala",
          category: "Marketing",
          companyWebsite: "https://minavtechs.com/",
          companyEmail: "info@minavtechs.com",
          applicationDeadline: new Date('2025-06-25')
        },
        {
          title: "Graphic Design Intern",
          company: "Vayam",
          location: "Chennai, Tamil Nadu",
          domain: "Design",
          position: "Graphic Designer",
          salary: 13500,
          description: "As a selected intern, your daily responsibilities will include:\n\n• Designing fresh and innovative product labels\n• Creating eye-catching posters for social media campaigns and website banners\n• Brainstorming original ideas and bringing them to life through design\n• Applying your creativity to meet and exceed the organization's visual standards",
          requirements: ["Adobe After Effects", "Adobe Illustrator", "Adobe Photoshop Lightroom CC", "Adobe Premiere Pro", "CorelDRAW"],
          duration: "3 Months",
          type: "Full-time",
          source: "internshala",
          category: "Design",
          stipendRange: "10,000 - 17,000",
          applicationDeadline: new Date('2025-06-02')
        },
        {
          title: "Business Development Intern",
          company: "El RevGen Healthcare Solutions Private Limited",
          location: "Chennai, Tamil Nadu",
          domain: "Business Development",
          position: "Business Development Associate",
          salary: 7250,
          description: "As a selected intern, you'll play a crucial role in supporting business development efforts, particularly in the US healthcare space. Your day-to-day tasks will include:\n\n• Conducting research to identify potential leads, such as hospitals, clinics, and healthcare providers in the U.S.\n• Assisting in drafting introductory emails, pitch decks, and follow-up communications\n• Updating and maintaining CRM records with accurate lead status, contact info, and meeting notes\n• Collaborating with the marketing team to source or create tailored promotional materials\n• Helping prepare client proposals, quotations, and service comparison documents\n• Sitting in on discovery calls or client briefings to observe and provide support\n• Monitoring lead engagement, tracking response rates, and managing follow-up schedules\n• Analyzing healthcare billing trends, competitor activity, and industry developments in the U.S.\n• Compiling weekly progress updates for the Business Development Manager\n• Organizing and documenting all client communications in well-structured digital folders",
          requirements: ["Email Marketing", "English Proficiency (Spoken)", "English Proficiency (Written)", "Business Development"],
          duration: "6 Months",
          type: "Full-time",
          source: "internshala",
          category: "Business Development",
          companyWebsite: "https://www.elrevgen.com/",
          companyEmail: "info@elrevgen.com",
          stipendRange: "6,500 - 8,000",
          ppoSalary: "225000 to 275000",
          applicationDeadline: new Date('2025-07-02')
        }
      ];

      await Job.insertMany(samplejobs);
      console.log('Sample jobs created successfully');
    }
  } catch (error) {
    console.error('Error creating default data:', error);
  }
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    createDefaultData();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// File upload configuration for Excel files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/excel/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTP(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification - InternX Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #10b981; margin: 0;">InternX</h1>
          <p style="color: #666; margin: 5px 0;">Professional Internship Portal</p>
        </div>
        
        <div style="background: #f8fffe; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
          <h2 style="color: #10b981; margin-top: 0;">Email Verification Required</h2>
          <p style="color: #333; line-height: 1.6;">
            Thank you for registering with InternX! To complete your registration, please use the following OTP:
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="background: #10b981; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="color: #666; margin-top: 15px; font-size: 14px;">
            This OTP will expire in 10 minutes
          </p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>Security Notice:</strong> If you didn't request this verification, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            © 2024 InternX. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email. Please try again.');
  }
}

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Admin middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.admin = user;
    next();
  });
};

// Routes

// Send OTP
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'User already registered with this email' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUser) {
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    }

    await sendOTP(email, otp);

    global.tempOTPs = global.tempOTPs || {};
    global.tempOTPs[email] = { otp, expiry: otpExpiry };

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: error.message || 'Failed to send OTP' });
  }
});

// Enhanced Register with additional fields
app.post('/api/register', async (req, res) => {
  try {
    const { 
      name, email, password, phone, college, degree, year, skills, otp,
      schoolName, schoolPassedYear, puCollegeName, puPassedYear, currentCourse,
      resumeData, resumeFilename, resumeContentType,
      profilePictureData, profilePictureFilename, profilePictureContentType
    } = req.body;

    // Verify OTP
    const storedOTP = global.tempOTPs?.[email];
    if (!storedOTP || storedOTP.otp !== otp || new Date() > storedOTP.expiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let skillsArray = [];
    if (skills) {
      skillsArray = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : skills;
    }

    const userData = {
      name,
      email,
      password: hashedPassword,
      phone,
      college: college || '',
      degree: degree || '',
      year: year || '',
      schoolName: schoolName || '',
      schoolPassedYear: schoolPassedYear || '',
      puCollegeName: puCollegeName || '',
      puPassedYear: puPassedYear || '',
      currentCourse: currentCourse || '',
      skills: skillsArray,
      resume: resumeData ? {
        data: resumeData,
        filename: resumeFilename || 'resume.pdf',
        contentType: resumeContentType || 'application/pdf'
      } : null,
      profilePicture: profilePictureData ? {
        data: profilePictureData,
        filename: profilePictureFilename || 'profile.jpg',
        contentType: profilePictureContentType || 'image/jpeg'
      } : null,
      isVerified: true
    };

    let user;
    if (existingUser) {
      Object.assign(existingUser, userData);
      user = await existingUser.save();
    } else {
      user = await User.create(userData);
    }

    delete global.tempOTPs[email];

    const token = jwt.sign(
      { userId: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        degree: user.degree,
        year: user.year,
        schoolName: user.schoolName,
        schoolPassedYear: user.schoolPassedYear,
        puCollegeName: user.puCollegeName,
        puPassedYear: user.puPassedYear,
        currentCourse: user.currentCourse,
        skills: user.skills,
        resume: user.resume ? user.resume.filename : null,
        profilePicture: user.profilePicture ? user.profilePicture.filename : null
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(401).json({ message: 'Invalid credentials or unverified account' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        degree: user.degree,
        year: user.year,
        schoolName: user.schoolName,
        schoolPassedYear: user.schoolPassedYear,
        puCollegeName: user.puCollegeName,
        puPassedYear: user.puPassedYear,
        currentCourse: user.currentCourse,
        skills: user.skills,
        resume: user.resume ? user.resume.filename : null,
        profilePicture: user.profilePicture ? user.profilePicture.filename : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get user profile picture
app.get('/api/profile-picture/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    const imageBuffer = Buffer.from(user.profilePicture.data, 'base64');
    
    res.set({
      'Content-Type': user.profilePicture.contentType,
      'Content-Length': imageBuffer.length
    });
    
    res.send(imageBuffer);
  } catch (error) {
    console.error('Get profile picture error:', error);
    res.status(500).json({ message: 'Failed to get profile picture' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

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
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Admin login failed' });
  }
});

// Get all jobs with filters
app.get('/api/jobs', async (req, res) => {
  try {
    const { search, location, domain, position, minSalary, maxSalary, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };

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

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// Get job domains
app.get('/api/domains', async (req, res) => {
  try {
    const domains = await Job.distinct('domain', { isActive: true });
    res.json(domains);
  } catch (error) {
    console.error('Get domains error:', error);
    res.status(500).json({ message: 'Failed to fetch domains' });
  }
});

// Get single job
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Failed to fetch job' });
  }
});

// Apply for job
app.post('/api/jobs/:id/apply', authenticateToken, async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.id;
    const userId = req.user.userId;

    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    const application = await Application.create({
      jobId,
      userId,
      coverLetter: coverLetter || ''
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({ message: 'Failed to apply for job' });
  }
});

// Get user applications
app.get('/api/my-applications', authenticateToken, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.userId })
      .populate('jobId')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Download resume
app.get('/api/resume/:userId', authenticateAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user || !user.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const resumeBuffer = Buffer.from(user.resume.data, 'base64');
    
    res.set({
      'Content-Type': user.resume.contentType,
      'Content-Disposition': `attachment; filename="${user.resume.filename}"`,
      'Content-Length': resumeBuffer.length
    });
    
    res.send(resumeBuffer);
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({ message: 'Failed to download resume' });
  }
});

// Admin Routes

// Get all jobs (admin)
app.get('/api/admin/jobs', authenticateAdmin, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Admin get jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// Create job (admin)
app.post('/api/admin/jobs', authenticateAdmin, async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Failed to create job' });
  }
});

// Update job (admin)
app.put('/api/admin/jobs/:id', authenticateAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Failed to update job' });
  }
});

// Delete job (admin)
app.delete('/api/admin/jobs/:id', authenticateAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Failed to delete job' });
  }
});

// Enhanced bulk upload jobs with Excel support
app.post('/api/admin/jobs/bulk-upload', authenticateAdmin, upload.single('excel'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Excel file required' });
    }

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    // Store Excel file in MongoDB
    const excelFile = await ExcelFile.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      data: fileBuffer,
      contentType: req.file.mimetype,
      uploadedBy: req.admin.adminId
    });

    // Read Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const jobs = [];
    let jobsCreated = 0;

    for (const row of data) {
      try {
        // Map Excel columns to job schema
        const job = {
          title: row.title || row.Title || row.position || row.Position || 'Internship',
          company: row.company || row.Company || row.companyName || row['Company Name'] || 'Unknown Company',
          location: row.location || row.Location || row.city || row.City || 'Not specified',
          domain: row.domain || row.Domain || row.category || row.Category || 'General',
          position: row.position || row.Position || row.role || row.Role || 'Intern',
          salary: parseInt(row.salary || row.Salary || row.stipend || row.Stipend || 0),
          description: row.description || row.Description || row.details || row.Details || 'No description provided',
          requirements: (row.requirements || row.Requirements || row.skills || row.Skills || '').split(',').map(r => r.trim()).filter(r => r),
          duration: row.duration || row.Duration || row.period || row.Period || '3 months',
          type: row.type || row.Type || row.workType || row['Work Type'] || 'Full-time',
          source: row.source || row.Source || 'Excel Upload',
          state: row.state || row.State || '',
          category: row.category || row.Category || row.domain || row.Domain || '',
          companyWebsite: row.companyWebsite || row['Company Website'] || row.website || row.Website || '',
          companyEmail: row.companyEmail || row['Company Email'] || row.email || row.Email || '',
          companyLinkedIn: row.companyLinkedIn || row['Company LinkedIn'] || row.linkedin || row.LinkedIn || '',
          applicationLink: row.applicationLink || row['Application Link'] || row.link || row.Link || '',
          stipendRange: row.stipendRange || row['Stipend Range'] || row.salaryRange || row['Salary Range'] || '',
          ppoSalary: row.ppoSalary || row['PPO Salary'] || row.fullTimeSalary || row['Full Time Salary'] || '',
          applicationDeadline: row.applicationDeadline || row['Application Deadline'] || row.deadline || row.Deadline ? new Date(row.applicationDeadline || row['Application Deadline'] || row.deadline || row.Deadline) : null
        };

        jobs.push(job);
        jobsCreated++;
      } catch (error) {
        console.error('Error processing row:', error, row);
      }
    }

    if (jobs.length > 0) {
      const insertedjobs = await Job.insertMany(jobs);
      
      // Update Excel file record with jobs created count
      excelFile.jobsCreated = insertedjobs.length;
      await excelFile.save();
      
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      
      res.status(201).json({
        message: `${insertedjobs.length} jobs uploaded successfully from Excel file`,
        jobs: insertedjobs,
        excelFileId: excelFile._id
      });
    } else {
      res.status(400).json({ message: 'No valid job data found in Excel file' });
    }
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ message: 'Failed to upload jobs from Excel file' });
  }
});

// Get uploaded Excel files (admin)
app.get('/api/admin/excel-files', authenticateAdmin, async (req, res) => {
  try {
    const files = await ExcelFile.find()
      .populate('uploadedBy', 'username')
      .sort({ uploadedAt: -1 });
    
    res.json(files);
  } catch (error) {
    console.error('Get Excel files error:', error);
    res.status(500).json({ message: 'Failed to fetch Excel files' });
  }
});

// Download Excel file (admin)
app.get('/api/admin/excel-files/:id/download', authenticateAdmin, async (req, res) => {
  try {
    const file = await ExcelFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'Excel file not found' });
    }

    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      'Content-Length': file.data.length
    });
    
    res.send(file.data);
  } catch (error) {
    console.error('Download Excel file error:', error);
    res.status(500).json({ message: 'Failed to download Excel file' });
  }
});

// Get all applications (admin)
app.get('/api/admin/applications', authenticateAdmin, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('jobId')
      .populate('userId')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Admin get applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Update application status (admin)
app.put('/api/admin/applications/:id', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('jobId').populate('userId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Failed to update application' });
  }
});

// Get all users (admin)
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  try {
    const users = await User.find({ isVerified: true })
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get analytics data (admin)
app.get('/api/admin/analytics', authenticateAdmin, async (req, res) => {
  try {
    const totaljobs = await Job.countDocuments();
    const activejobs = await Job.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();
    const totalUsers = await User.countDocuments({ isVerified: true });

    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const jobsByDomain = await Job.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } }
    ]);

    const monthlyRegistrations = await User.aggregate([
      {
        $match: { isVerified: true }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      totaljobs,
      activejobs,
      totalApplications,
      totalUsers,
      applicationsByStatus,
      jobsByDomain,
      monthlyRegistrations
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Get dashboard stats (admin)
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const totaljobs = await Job.countDocuments();
    const activejobs = await Job.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'Pending' });
    const totalUsers = await User.countDocuments({ isVerified: true });

    res.json({
      totaljobs,
      activejobs,
      totalApplications,
      pendingApplications,
      totalUsers
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});