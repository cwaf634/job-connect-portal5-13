import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, User, Calendar, Clock, CheckCircle, Eye, Check, X } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useApplications } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthContext';

interface EmployerNotificationsProps {
  appliedJobs?: any[];
}

const EmployerNotifications = ({ appliedJobs = [] }: EmployerNotificationsProps) => {
  const { getPanelNotifications, markAsRead } = useNotifications();
  const { updateApplicationStatus, applications } = useApplications();
  const { user, registeredUsers } = useAuth();

  // Get notifications specific to employer panel only
  const employerNotifications = getPanelNotifications('employer');

  // Get current shopkeeper name
  const shopkeeperName = user?.name || 'Main Shop Owner';
  
  // Filter applications to only show those from registered students and for this shopkeeper
  const shopkeeperApplications = applications.filter(app => {
    const isFromRegisteredStudent = registeredUsers.some(u => 
      u.userType === 'student' && (u.email === app.email || u.name === app.studentName)
    );
    const isForThisShopkeeper = app.shopkeeper === shopkeeperName || 
                               app.shopkeeper === user?.profile?.company;
    return isFromRegisteredStudent && isForThisShopkeeper;
  });

  // Convert applications to notification format
  const jobNotifications = shopkeeperApplications.map(job => ({
    id: job.id,
    type: 'job_application',
    title: 'New Job Application',
    message: `${job.studentName} applied for ${job.jobTitle} position`,
    jobTitle: job.jobTitle,
    applicantName: job.studentName,
    appliedDate: job.appliedDate,
    status: job.status,
    experience: job.experience,
    coverLetter: job.coverLetter,
    shopkeeper: job.shopkeeper,
    isRead: job.status !== 'pending'
  }));

  // Combine with employer-specific notifications only
  const allNotifications = [...employerNotifications.map(n => ({
    ...n,
    type: n.type,
    title: n.title,
    message: n.message,
    status: 'info',
    isRead: n.isRead
  })), ...jobNotifications];

  const handleApprove = (id: number) => {
    updateApplicationStatus(id, 'accepted');
  };

  const handleReject = (id: number) => {
    updateApplicationStatus(id, 'rejected');
  };

  const handleMarkAsRead = (id: string | number) => {
    if (typeof id === 'string') {
      markAsRead(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'accepted': return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-300';
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shop Notifications</h2>
          <p className="text-gray-600">Applications from registered students for {shopkeeperName}</p>
        </div>
        <Badge className="bg-red-100 text-red-700 border border-red-300">
          <Bell className="w-4 h-4 mr-1" />
          {unreadCount} New
        </Badge>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {allNotifications.length > 0 ? allNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-all duration-300 hover:shadow-lg border-2 ${
              !notification.isRead ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    {'shopkeeper' in notification && notification.shopkeeper && (
                      <p className="text-sm text-green-600 font-medium">For: {notification.shopkeeper}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusColor(notification.status)} border`}>
                    {notification.status}
                  </Badge>
                  {!notification.isRead && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {notification.type === 'job_application' && 'jobTitle' in notification && (
                <>
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Job Position</p>
                      <p className="text-gray-900">{notification.jobTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Registered Student</p>
                      <p className="text-gray-900">{notification.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Applied Date</p>
                      <div className="flex items-center text-gray-900">
                        <Calendar className="w-4 h-4 mr-1" />
                        {notification.appliedDate}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Experience</p>
                      <p className="text-gray-900">{notification.experience}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter</p>
                    <div className="p-3 bg-white border rounded-lg">
                      <p className="text-sm text-gray-800">{notification.coverLetter}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-wrap gap-2">
                {notification.type === 'job_application' && notification.status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(notification.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleReject(notification.id)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                
                {!notification.isRead && typeof notification.id === 'string' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Mark as Read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
              <p className="text-gray-600">Applications from registered students will appear here when they apply through your shop.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployerNotifications;
