# InternHub - Professional Internship Portal

A comprehensive internship portal built with React, Node.js, Express, and MongoDB. The application features separate admin and user interfaces with full CRUD operations, file uploads, and responsive design.

## Project Structure

```
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
├── server/            # Placeholder server (use backend instead)
└── package.json       # Root package.json for scripts
```

## Features

### User Features
- User registration with email OTP verification
- Profile management with resume and photo upload
- Job search and filtering
- Job application with cover letters
- Application tracking dashboard
- Responsive design for all devices

### Admin Features
- Secure admin authentication
- Job management (CRUD operations)
- Bulk job upload via Excel files
- Application management and status updates
- User management
- Analytics dashboard
- System settings

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Email**: Nodemailer
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd internship-portal
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
# In backend/.env
MONGODB_URI=mongodb://localhost:27017/internship-portal
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
PORT=5000
```

4. Start the development servers:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Server placeholder: http://localhost:3001

### Default Admin Credentials
- Username: `wizdom`
- Password: `wizdom123`

## API Endpoints

### Authentication
- `POST /api/send-otp` - Send OTP for email verification
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/admin/login` - Admin login
- `POST /api/forgot-password` - Password reset

### Jobs
- `GET /api/jobs` - Get jobs with pagination and filters
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs/:id/apply` - Apply for job

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/jobs` - Get all jobs
- `POST /api/admin/jobs` - Create job
- `PUT /api/admin/jobs/:id` - Update job
- `DELETE /api/admin/jobs/:id` - Delete job
- `POST /api/admin/jobs/bulk-upload` - Bulk upload jobs
- `GET /api/admin/applications` - Get all applications
- `PUT /api/admin/applications/:id` - Update application status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Analytics data

## Deployment

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@internhub.com or create an issue in the repository.