import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User, Camera, Check, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const UserNotifications = () => {
  const { getPanelNotifications, markAsRead, clearAll } = useNotifications();
  const { user } = useAuth();

  // Get notifications specific to current user's panel
  const userType = user?.userType || 'student';
  const userNotifications = getPanelNotifications(userType === 'administrator' ? 'administrator' : userType);

  const getIcon = (type: string) => {
    switch (type) {
      case 'profile_update': return <User className="w-5 h-5 text-blue-600" />;
      case 'photo_update': return <Camera className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'profile_update': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'photo_update': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Notifications</h2>
          <p className="text-gray-600">Stay updated with your profile changes</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
            <Bell className="w-4 h-4 mr-1" />
            {unreadCount} New
          </Badge>
          {userNotifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {userNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-all duration-300 hover:shadow-lg border-2 ${
              !notification.isRead ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {getIcon(notification.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getTypeColor(notification.type)} border`}>
                    {notification.type.replace('_', ' ')}
                  </Badge>
                  {!notification.isRead && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {format(notification.timestamp, 'MMM dd, yyyy at hh:mm a')}
              </p>
              
              {!notification.isRead && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => markAsRead(notification.id)}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Mark as Read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {userNotifications.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
            <p className="text-gray-600">You'll see updates about your profile changes here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserNotifications;
