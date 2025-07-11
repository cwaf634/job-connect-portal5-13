
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DataManager } from '@/data/dummyData';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'student' | 'employer' | 'administrator';
  subscriptionTier: string;
  profilePhoto: string;
  profile: {
    phone: string;
    location: string;
    bio: string;
    skills: string[];
    experience: string;
    company: string;
    department: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, userType: 'student' | 'employer' | 'administrator') => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => void;
  registeredUsers: User[];
  addRegisteredUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load registered users
    const users = DataManager.getUsers();
    setRegisteredUsers(users);

    // Initialize default users if none exist
    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: '1',
          email: 'student@jobconnect.com',
          name: 'Rahul Kumar',
          userType: 'student',
          subscriptionTier: 'Premium',
          profilePhoto: '',
          profile: {
            phone: '+91 9876543210',
            location: 'Mumbai, Maharashtra',
            bio: 'Engineering student seeking government job opportunities',
            skills: ['Computer Skills', 'Communication'],
            experience: '1 year',
            company: '',
            department: ''
          }
        },
        {
          id: '2',
          email: 'shopowner@jobconnect.com',
          name: 'Main Shop Owner',
          userType: 'employer',
          subscriptionTier: 'Basic',
          profilePhoto: '',
          profile: {
            phone: '+91 9876543211',
            location: 'Delhi, India',
            bio: 'Government job portal shop owner',
            skills: [],
            experience: '5 years',
            company: 'Government Job Portal Shop',
            department: 'Job Services'
          }
        },
        {
          id: '3',
          email: 'admin@jobconnect.com',
          name: 'Demo Administrator',
          userType: 'administrator',
          subscriptionTier: 'Pro',
          profilePhoto: '',
          profile: {
            phone: '+91 9876543212',
            location: 'New Delhi, India',
            bio: 'System administrator',
            skills: ['Administration', 'Management'],
            experience: '10 years',
            company: 'JobConnect Admin',
            department: 'Administration'
          }
        }
      ];

      defaultUsers.forEach(user => DataManager.addUser(user));
      setRegisteredUsers(defaultUsers);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get the latest users from DataManager
    const users = DataManager.getUsers();
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser && password === 'respective123') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string, userType: 'student' | 'employer' | 'administrator'): Promise<boolean> => {
    const users = DataManager.getUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      return false; // User already exists
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      userType,
      subscriptionTier: 'Basic',
      profilePhoto: '',
      profile: {
        phone: '',
        location: '',
        bio: '',
        skills: [],
        experience: '',
        company: '',
        department: ''
      }
    };

    DataManager.addUser(newUser);
    setRegisteredUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (profileData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in registeredUsers array
      setRegisteredUsers(prev => 
        prev.map(u => u.id === user.id ? updatedUser : u)
      );
    }
  };

  const addRegisteredUser = (newUser: User) => {
    DataManager.addUser(newUser);
    setRegisteredUsers(prev => [...prev, newUser]);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    registeredUsers,
    addRegisteredUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
