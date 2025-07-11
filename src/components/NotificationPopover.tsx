
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User, Camera, Check, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';

interface NotificationPopoverProps {
  children: React.ReactNode;
  appliedJobs?: any[];
}

const NotificationPopover = ({ children, appliedJobs = [] }: NotificationPopoverProps) => {
  const { getPanelNotifications, markAsRead, clearAll } = useNotifications();
  const { user } = useAuth();

  const userType = user?.userType || 'student';
  const userNotifications = getPanelNotifications(userType === 'administrator' ? 'administrator' : userType);
  const jobNotifications = userType === 'employer' ? appliedJobs.filter(job => job.status === 'pending') : [];
  
  const allNotifications = [
    ...userNotifications,
    ...jobNotifications.map(job => ({
      id: `job-${job.id}`,
      type: 'job_application',
      title: 'New Job Application',
      message: `${job.studentName} applied for ${job.jobTitle}`,
      timestamp: new Date(job.appliedDate),
      isRead: false,
      panel: userType
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'profile_update': return <User className="w-4 h-4 text-blue-600" />;
      case 'photo_update': return <Camera className="w-4 h-4 text-green-600" />;
      case 'job_application': return <Bell className="w-4 h-4 text-orange-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'profile_update': return 'bg-blue-100 text-blue-700';
      case 'photo_update': return 'bg-green-100 text-green-700';
      case 'job_application': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          {children}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-white border shadow-lg" align="end" sideOffset={8}>
        <div className="max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-gray-50">
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-600">{unreadCount} unread</p>
            </div>
            {allNotifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="p-2">
            {allNotifications.length > 0 ? (
              allNotifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg mb-2 border transition-all hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {format(notification.timestamp, 'MMM dd, hh:mm a')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <Badge className={`text-xs ${getTypeColor(notification.type)}`}>
                            {notification.type.replace('_', ' ')}
                          </Badge>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      {!notification.isRead && notification.type !== 'job_application' && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="mt-2 h-6 px-2 text-xs"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm">No notifications</p>
              </div>
            )}
          </div>

          {allNotifications.length > 5 && (
            <div className="border-t p-3 bg-gray-50">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View All Notifications
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
