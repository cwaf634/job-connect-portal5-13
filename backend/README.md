
# JobConnect Backend API

A comprehensive Node.js backend API for the JobConnect government job portal application, built with Express.js and MongoDB.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Student, Employer, Admin)
- Secure password hashing with bcrypt
- Token-based session management

### User Management
- User registration and login
- Profile management with photo upload
- Role-specific user data handling
- Account activation/deactivation

### Job Management
- CRUD operations for job postings
- Job search and filtering
- Application deadline management
- Category-based job organization

### Application System
- Job application submission with document upload
- Application status tracking
- Employer application review system
- Application withdrawal functionality

### Certificate Verification
- Certificate upload and storage
- Admin verification workflow
- Status tracking and notifications
- Multiple certificate types support

### Mock Test System
- Mock test creation and management
- Timed test taking functionality
- Result calculation and storage
- Performance analytics

### Subscription Management
- Multiple subscription plans
- Feature-based access control
- Payment integration ready
- Subscription status tracking

### Real-time Chat
- Chat system between students and employers
- Message threading
- File sharing capabilities
- Read status tracking

### Notification System
- Real-time notifications
- Email notification support
- Category-based notifications
- Read/unread status management

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: Validator.js
- **Security**: bcryptjs, helmet, cors
- **Development**: Nodemon

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobconnect-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/jobconnect
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Create upload directories**
   ```bash
   mkdir -p uploads/{profiles,documents,certificates}
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🗄️ Database Setup

### MongoDB Connection
Make sure MongoDB is running locally or update the `MONGODB_URI` in your `.env` file for a remote connection.

### Seed Sample Data
```bash
npm run seed
```

This will create:
- Admin user: `admin@jobconnect.com` / `admin123`
- Shop owner: `shopowner@jobconnect.com` / `shop123`
- Student: `student@jobconnect.com` / `student123`
- Sample jobs and subscription plans
- Sample mock test

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `POST /api/users/profile-picture` - Upload profile picture
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (admin/employer)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications/student` - Get student applications
- `GET /api/applications/employer` - Get employer applications
- `GET /api/applications/admin` - Get all applications (admin)
- `PUT /api/applications/:id/status` - Update application status
- `GET /api/applications/:id` - Get application details

### Certificates
- `POST /api/certificates` - Upload certificate
- `GET /api/certificates/student` - Get student certificates
- `GET /api/certificates/admin` - Get all certificates (admin)
- `PUT /api/certificates/:id/verify` - Verify certificate (admin)

### Mock Tests
- `GET /api/mock-tests` - Get all mock tests
- `GET /api/mock-tests/:id` - Get mock test
- `POST /api/mock-tests/:id/submit` - Submit test result
- `GET /api/mock-tests/results/my-results` - Get user results
- `POST /api/mock-tests` - Create mock test (admin)

### Subscriptions
- `GET /api/subscriptions` - Get subscription plans
- `POST /api/subscriptions` - Create plan (admin)
- `POST /api/subscriptions/subscribe` - Subscribe to plan
- `GET /api/subscriptions/status` - Get subscription status

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Chat
- `GET /api/chat` - Get user chats
- `GET /api/chat/:id` - Get chat details
- `POST /api/chat` - Create chat
- `POST /api/chat/:id/messages` - Send message
- `PUT /api/chat/:id/read` - Mark messages as read

## 📁 Project Structure

```
backend/
├── models/              # Mongoose models
│   ├── User.js
│   ├── Job.js
│   ├── Application.js
│   ├── Certificate.js
│   ├── MockTest.js
│   ├── Notification.js
│   └── Chat.js
├── routes/              # Express routes
│   ├── auth.js
│   ├── users.js
│   ├── jobs.js
│   ├── applications.js
│   ├── certificates.js
│   ├── subscriptions.js
│   ├── notifications.js
│   ├── mockTests.js
│   └── chat.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   └── upload.js
├── utils/               # Utility functions
│   ├── email.js
│   └── validation.js
├── scripts/             # Utility scripts
│   └── seedData.js
├── uploads/             # File uploads
│   ├── profiles/
│   ├── documents/
│   └── certificates/
├── server.js            # Main server file
├── package.json
├── .env.example
└── README.md
```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File upload restrictions
- CORS configuration
- Rate limiting ready
- Helmet security headers

## 📤 File Upload

The API supports file uploads for:
- Profile pictures (5MB limit, images only)
- Application documents (10MB limit, PDF/DOC/images)
- Certificates (10MB limit, PDF/images)

Files are stored in the `uploads/` directory with organized subfolders.

## 🧪 Testing

```bash
# Run tests
npm test
```

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:
- `MONGODB_URI`
- `JWT_SECRET`
- `EMAIL_*` variables
- `NODE_ENV=production`

### File Uploads
In production, consider using cloud storage (AWS S3, Cloudinary) instead of local file storage.

### Database
Use MongoDB Atlas or a similar cloud database service for production.

## 📊 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": {...},
  "token": "jwt_token_if_applicable"
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "detailed_error_message"
}
```

### Paginated Response
```json
{
  "data": [...],
  "totalPages": 10,
  "currentPage": 1,
  "total": 100
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Email functionality requires proper SMTP configuration
- File uploads use local storage (consider cloud storage for production)
- Real-time chat requires WebSocket implementation for live updates

## 🔮 Future Enhancements

- WebSocket integration for real-time features
- Advanced analytics and reporting
- Payment gateway integration
- API rate limiting
- Advanced caching with Redis
- Microservices architecture migration

---

For frontend integration, ensure CORS is properly configured and API endpoints match the frontend expectations.
