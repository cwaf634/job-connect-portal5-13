import React, { useState, useEffect } from 'react';
import DashboardNavigation from './DashboardNavigation';
import JobsSection from './JobsSection';
import StudentApplicationsSection from './StudentApplicationsSection';
import CertificatesSection from './CertificatesSection';
import MockTestsSection from './MockTestsSection';
import SubscriptionSection from './SubscriptionSection';
import ChatSection from './ChatSection';
import EmployerStudentApplications from './EmployerStudentApplications';
import EmployerNotifications from './EmployerNotifications';
import UserNotifications from './UserNotifications';
import ProfileManagement from './ProfileManagement';
import AdminUserManagement from './AdminUserManagement';
import AdminShopkeeperManagement from './AdminShopkeeperManagement';
import AdminCertificateVerification from './AdminCertificateVerification';
import AdminSubscriptionPlans from './AdminSubscriptionPlans';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, FileText, Award, Target, CreditCard, MessageCircle, Bell, User, TrendingUp, Calendar, MapPin, Clock, CheckCircle, UserPlus, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const { user, logout } = useAuth();
  const { addNotification } = useNotifications();

  // Real-time notifications for new job applications
  useEffect(() => {
    if (user?.userType === 'employer' && appliedJobs.length > 0) {
      const latestJob = appliedJobs[0];
      if (latestJob && Date.now() - new Date(latestJob.appliedDate).getTime() < 5000) {
        addNotification({
          type: 'info',
          title: 'New Job Application',
          message: `${latestJob.studentName} applied for ${latestJob.jobTitle}`,
          panel: 'employer'
        });
      }
    }
  }, [appliedJobs, user?.userType, addNotification]);

  const handleLogout = () => {
    logout();
  };

  const handleDocumentUpload = (document) => {
    setUploadedDocuments(prev => [document, ...prev]);
    
    // Add notification for document upload
    addNotification({
      type: 'photo_update',
      title: 'Document Uploaded',
      message: `Successfully uploaded ${document.certificateName}`,
      panel: user?.userType || 'student'
    });
  };

  const handleJobApplied = (job) => {
    const applicationData = {
      id: Date.now(),
      jobTitle: job.title,
      department: job.department,
      location: job.location,
      salary: job.salary,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      govtLink: `https://example.gov/${job.id}`,
      studentName: user?.name || 'Current User',
      email: user?.email || '',
      phone: user?.profile?.phone || '+91 9876543210',
      shopkeeper: 'Main Shop Owner Portal',
      hasDocument: uploadedDocuments.length > 0,
      qualifications: ['Graduate', 'Computer Skills'],
      experience: user?.profile?.experience || 'Fresher',
      coverLetter: `I am interested in applying for the ${job.title} position. I believe my skills and enthusiasm make me a suitable candidate for this role.`
    };
    setAppliedJobs(prev => [applicationData, ...prev]);

    // Add notification for job application
    addNotification({
      type: 'info',
      title: 'Application Submitted',
      message: `Your application for ${job.title} has been submitted successfully`,
      panel: 'student'
    });
  };

  const getDashboardStats = () => {
    if (user?.userType === 'student') {
      return [
        { 
          title: 'Available Jobs', 
          value: 10, // Total available jobs
          icon: Building2, 
          color: 'bg-blue-500',
          onClick: () => setActiveTab('jobs'),
          description: 'Browse and apply'
        },
        { 
          title: 'Jobs Applied', 
          value: appliedJobs.length, 
          icon: FileText, 
          color: 'bg-green-500',
          onClick: () => setActiveTab('applications'),
          description: 'View all applications'
        },
        { 
          title: 'Certificates', 
          value: uploadedDocuments.length, 
          icon: Award, 
          color: 'bg-purple-500',
          onClick: () => setActiveTab('certificates'),
          description: 'Manage certificates'
        },
        { 
          title: 'Tests Taken', 
          value: 5, 
          icon: Target, 
          color: 'bg-orange-500',
          onClick: () => setActiveTab('mock-tests'),
          description: 'Practice tests'
        }
      ];
    } else if (user?.userType === 'employer') {
      return [
        { 
          title: 'Total Applications', 
          value: appliedJobs.length, 
          icon: Users, 
          color: 'bg-green-500',
          onClick: () => setActiveTab('student-applications'),
          description: 'Review applications'
        },
        { 
          title: 'Pending Review', 
          value: appliedJobs.filter(job => job.status === 'pending').length, 
          icon: Clock, 
          color: 'bg-yellow-500',
          onClick: () => setActiveTab('student-applications'),
          description: 'Need attention'
        },
        { 
          title: 'Accepted', 
          value: appliedJobs.filter(job => job.status === 'accepted').length, 
          icon: CheckCircle, 
          color: 'bg-blue-500',
          onClick: () => setActiveTab('student-applications'),
          description: 'Approved candidates'
        },
        { 
          title: 'Notifications', 
          value: appliedJobs.filter(job => job.status === 'pending').length, 
          icon: Bell, 
          color: 'bg-red-500',
          onClick: () => setActiveTab('notifications'),
          description: 'Check updates'
        }
      ];
    } else if (user?.userType === 'administrator') {
      // Only show actual data that exists in the system
      const totalStudents = 1; // Current student user
      const totalShopkeepers = 1; // Main shop owner
      const pendingCertificates = uploadedDocuments.filter(doc => doc.status === 'pending').length;
      const activePlans = 3; // Available subscription plans

      return [
        { 
          title: 'Students', 
          value: totalStudents, 
          icon: Users, 
          color: 'bg-blue-500',
          onClick: () => setActiveTab('user-management'),
          description: 'Manage students'
        },
        { 
          title: 'Shopkeepers', 
          value: totalShopkeepers, 
          icon: Building2, 
          color: 'bg-green-500',
          onClick: () => setActiveTab('shopkeeper-management'),
          description: 'Manage shopkeepers'
        },
        { 
          title: 'Pending Certificates', 
          value: pendingCertificates, 
          icon: Award, 
          color: 'bg-yellow-500',
          onClick: () => setActiveTab('certificate-verification'),
          description: 'Verify certificates'
        },
        { 
          title: 'Subscription Plans', 
          value: activePlans, 
          icon: CreditCard, 
          color: 'bg-purple-500',
          onClick: () => setActiveTab('subscription-plans'),
          description: 'Manage plans'
        }
      ];
    }
    return [];
  };

  const getPanelGradient = () => {
    switch (user?.userType) {
      case 'student': return 'from-blue-600 to-blue-700';
      case 'employer': return 'from-green-600 to-green-700';
      case 'administrator': return 'from-purple-600 to-purple-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const renderDashboardContent = () => {
    const stats = getDashboardStats();
    
    return (
      <div className="space-y-6 lg:space-y-8 overflow-hidden">
        {/* Welcome Header */}
        <div className={`bg-gradient-to-r ${getPanelGradient()} rounded-2xl p-4 lg:p-8 text-white`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-blue-100 text-sm lg:text-lg">
                {user?.userType === 'employer' 
                  ? 'Manage applications and connect with talented candidates'
                  : user?.userType === 'student'
                  ? 'Discover opportunities and build your career'
                  : 'Oversee the platform and manage all operations'
                }
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 lg:w-32 h-20 lg:h-32 bg-white/10 rounded-full flex items-center justify-center">
                {user?.userType === 'administrator' ? (
                  <Shield className="w-10 lg:w-16 h-10 lg:h-16 text-white" />
                ) : (
                  <Building2 className="w-10 lg:w-16 h-10 lg:h-16 text-white" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Now clickable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300 cursor-pointer transform hover:scale-105"
                onClick={stat.onClick}
              >
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs lg:text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`w-10 lg:w-12 h-10 lg:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions - Mobile responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card className="border-2 hover:border-blue-300 transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="w-4 lg:w-5 h-4 lg:h-5 mr-2 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-3 lg:space-y-4">
                {user?.userType === 'student' ? (
                  appliedJobs.length > 0 ? (
                    appliedJobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm lg:text-base truncate">{job.jobTitle}</p>
                          <p className="text-xs lg:text-sm text-gray-600 truncate">{job.department}</p>
                        </div>
                        <Badge className={`ml-2 text-xs ${
                          job.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          job.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {job.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Building2 className="w-6 lg:w-8 h-6 lg:h-8 mx-auto mb-2" />
                      <p className="text-sm lg:text-base">No applications yet</p>
                      <p className="text-xs text-gray-400">Apply to jobs to see activity</p>
                    </div>
                  )
                ) : user?.userType === 'employer' ? (
                  appliedJobs.length > 0 ? (
                    appliedJobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm lg:text-base truncate">{job.studentName}</p>
                          <p className="text-xs lg:text-sm text-gray-600 truncate">{job.jobTitle}</p>
                        </div>
                        <Badge className={`ml-2 text-xs ${
                          job.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          job.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {job.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Users className="w-6 lg:w-8 h-6 lg:h-8 mx-auto mb-2" />
                      <p className="text-sm lg:text-base">No applications yet</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Total Students</span>
                      <Badge className="bg-blue-100 text-blue-700">1</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Pending Certificates</span>
                      <Badge className="bg-yellow-100 text-yellow-700">1</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 lg:p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">Active Plans</span>
                      <Badge className="bg-green-100 text-green-700">3</Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-300 transition-all duration-300">
            <CardContent className="p-4 lg:p-6">
              <h3 className="text-lg lg:text-xl font-semibold mb-4 flex items-center">
                <Calendar className="w-4 lg:w-5 h-4 lg:h-5 mr-2 text-green-600" />
                Quick Actions
              </h3>
              <div className="space-y-2 lg:space-y-3">
                {user?.userType === 'student' ? (
                  <>
                    <button 
                      onClick={() => setActiveTab('jobs')}
                      className="w-full text-left p-2 lg:p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center text-sm lg:text-base"
                    >
                      <Building2 className="w-3 lg:w-4 h-3 lg:h-4 mr-2 lg:mr-3 text-blue-600" />
                      Browse Available Jobs
                    </button>
                    <button 
                      onClick={() => setActiveTab('applications')}
                      className="w-full text-left p-2 lg:p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center text-sm lg:text-base"
                    >
                      <FileText className="w-3 lg:w-4 h-3 lg:h-4 mr-2 lg:mr-3 text-green-600" />
                      View My Applications
                    </button>
                    <button 
                      onClick={() => setActiveTab('certificates')}
                      className="w-full text-left p-2 lg:p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors flex items-center text-sm lg:text-base"
                    >
                      <Award className="w-3 lg:w-4 h-3 lg:h-4 mr-2 lg:mr-3 text-purple-600" />
                      Upload Certificates
                    </button>
                  </>
                ) : user?.userType === 'employer' ? (
                  <>
                    <button 
                      onClick={() => setActiveTab('student-applications')}
                      className="w-full text-left p-2 lg:p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center text-sm lg:text-base"
                    >
                      <Users className="w-3 lg:w-4 h-3 lg:h-4 mr-2 lg:mr-3 text-blue-600" />
                      Review Applications
                    </button>
                    <button 
                      onClick={() => setActiveTab('notifications')}
                      className="w-full text-left p-2 lg:p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors flex items-center text-sm lg:text-base"
                    >
                      <Bell className="w-3 lg:w-4 h-3 lg:h-4 mr-2 lg:mr-3 text-yellow-600" />
                      Check Notifications
                    </button>
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="w-full text-left p-2 lg:p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center text-sm lg:text-base"
                    >
                      <MessageCircle className="w-3 lg:w-4 h-3 lg:h-4 mr-2 lg:mr-3 text-green-600" />
                      Chat with Students
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setActiveTab('user-management')}
                      className="w-full text-left p-2 lg:p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center text-sm lg:text-base"
                    >
                      <UserPlus className="w-3 lg:w-4 h-3 lg:h-4 mr-2 lg:mr-3 text-blue-600" />
                      Manage Users
                    </button>
                    <button 
                      onClick={() => setActiveTab('certificate-verification')}
                      className="w-full text-left p-2 lg:p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors flex items-center text-sm lg:text-base"
                    >
                      <Award className="w-3 lg:w-4 h-3 lg:h-4 mr-2 lg:mr-3 text-yellow-600" />
                      Verify Certificates
                    </button>
                    <button 
                      onClick={() => setActiveTab('subscription-plans')}
                      className="w-full text-left p-2 lg:p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors flex items-center text-sm lg:text-base"
                    >
                      <CreditCard className="w-3 lg:w-4 h-3 lg:h-4 mr-2 lg:mr-3 text-purple-600" />
                      Manage Plans
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardContent();
      case 'jobs':
        return <JobsSection onJobApplied={handleJobApplied} />;
      case 'applications':
        return <StudentApplicationsSection appliedJobs={appliedJobs} />;
      case 'certificates':
        return <CertificatesSection uploadedDocuments={uploadedDocuments} />;
      case 'mock-tests':
        return <MockTestsSection />;
      case 'subscription':
        return <SubscriptionSection />;
      case 'chat':
        return <ChatSection />;
      case 'student-applications':
        return <EmployerStudentApplications appliedJobs={appliedJobs} />;
      case 'notifications':
        return <EmployerNotifications appliedJobs={appliedJobs} />;
      case 'user-notifications':
        return <UserNotifications />;
      case 'profile':
        return <ProfileManagement />;
      case 'user-management':
        return <AdminUserManagement />;
      case 'shopkeeper-management':
        return <AdminShopkeeperManagement />;
      case 'certificate-verification':
        return <AdminCertificateVerification uploadedDocuments={uploadedDocuments} />;
      case 'subscription-plans':
        return <AdminSubscriptionPlans />;
      case 'payment':
        return <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Management</h3>
          <p className="text-gray-600">Payment processing and transaction management features will be available here.</p>
        </div>;
      default:
        return <div>Section not found</div>;
    }
  };

  const getBackgroundGradient = () => {
    switch (user?.userType) {
      case 'student': return 'from-blue-50 to-blue-100';
      case 'employer': return 'from-green-50 to-green-100';
      case 'administrator': return 'from-purple-50 to-purple-100';
      default: return 'from-gray-50 to-blue-50';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} overflow-x-hidden`}>
      <DashboardNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userType={user?.userType || 'student'}
        userName={user?.name || 'User'}
        onLogout={handleLogout}
        onDocumentUpload={handleDocumentUpload}
        appliedJobs={appliedJobs}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8 overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
