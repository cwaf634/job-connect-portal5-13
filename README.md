
# JobConnect - Government Job Portal

A comprehensive job portal application built with React, TypeScript, and modern web technologies. This platform serves students, employers, and administrators with role-based dashboards and features.

## 🚀 Features

### For Students
- Browse available government jobs
- Apply for positions with document upload
- Track application status
- Upload and manage certificates
- Take mock tests for exam preparation
- Subscription plans for premium features
- Real-time chat with employers

### For Employers/Shop Owners
- Review student applications
- Manage notifications
- Chat with applicants
- Dashboard with application analytics

### For Administrators
- Complete user management (CRUD operations)
- Shopkeeper management
- Certificate verification system
- Subscription plan management
- Payment processing oversight
- System-wide analytics

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Fetching**: TanStack React Query
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Notifications**: Sonner

## 📦 Dependencies

### Core Dependencies
```json
{
  "@hookform/resolvers": "^3.9.0",
  "@radix-ui/react-*": "Various versions for UI components",
  "@tanstack/react-query": "^5.56.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.0.0",
  "date-fns": "^4.1.0",
  "embla-carousel-react": "^8.3.0",
  "input-otp": "^1.2.4",
  "lucide-react": "^0.462.0",
  "next-themes": "^0.3.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-day-picker": "^8.10.1",
  "react-hook-form": "^7.53.0",
  "react-resizable-panels": "^2.1.3",
  "react-router-dom": "^6.26.2",
  "recharts": "^2.12.7",
  "sonner": "^1.5.0",
  "tailwind-merge": "^2.5.2",
  "tailwindcss-animate": "^1.0.7",
  "vaul": "^0.9.3",
  "zod": "^3.23.8"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for backend)

### Frontend Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Backend Installation

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your MongoDB URI and other configurations.

4. **Start the backend server**
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

### Full Stack Setup
1. Run backend server: `cd backend && npm run dev`
2. Run frontend server: `npm run dev`
3. Access the application at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔐 Demo Credentials

### Student Panel
- Email: `student@jobconnect.com`
- Password: `student123`

### Shop Owner Panel
- Email: `shopowner@jobconnect.com`
- Password: `shop123`

### Administrator Panel
- Email: `admin@jobconnect.com`
- Password: `admin123`

## 🎨 Panel Color Coding

- **Student Panel**: Blue theme (`blue-600` to `blue-700`)
- **Employer Panel**: Green theme (`green-600` to `green-700`)
- **Admin Panel**: Purple theme (`purple-600` to `purple-700`)

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Dashboard.tsx   # Main dashboard component
│   ├── DashboardNavigation.tsx
│   ├── Admin*.tsx      # Admin panel components
│   └── ...
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── main.tsx           # Application entry point
```

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features Implementation

### Role-Based Access Control
- Different dashboards and navigation for each user type
- Color-coded panels for visual distinction
- Secure routing based on user permissions

### Certificate Management
- Upload and verification system
- Admin approval workflow
- Status tracking for students

### Subscription System
- Admin-created plans
- Feature-based access control
- Payment integration ready

### Real-time Features
- Live notifications
- Application status updates
- Chat functionality

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

This project can be deployed to various platforms:

- **Vercel**: Optimal for React applications
- **Netlify**: Easy deployment with git integration
- **GitHub Pages**: Free hosting for static sites

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Configure build settings (usually auto-detected)
3. Deploy with one click

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Certificate preview requires backend integration
- Payment processing needs payment gateway setup
- Real-time chat requires WebSocket implementation

## 🔮 Future Enhancements

- Real-time notifications with WebSocket
- Advanced analytics dashboard
- Mobile app development
- Multi-language support expansion
- AI-powered job recommendations

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ using React and modern web technologies.
