
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'profile_update' | 'photo_update' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  panel?: 'student' | 'employer' | 'administrator'; // Add panel specificity
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
  getPanelNotifications: (panel: 'student' | 'employer' | 'administrator') => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getPanelNotifications = (panel: 'student' | 'employer' | 'administrator') => {
    return notifications.filter(notif => notif.panel === panel || !notif.panel);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      clearAll,
      unreadCount,
      getPanelNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
