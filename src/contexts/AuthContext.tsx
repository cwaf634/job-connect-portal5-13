
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dummyUsers, localStorageUtils, STORAGE_KEYS, DataManager } from '@/data/dummyData';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'student' | 'employer' | 'administrator';
  subscriptionTier?: string;
  profilePhoto?: string;
  profile?: {
    phone?: string;
    location?: string;
    bio?: string;
    skills?: string[];
    experience?: string;
    company?: string;
    department?: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: 'student' | 'employer' | 'administrator') => Promise<boolean>;
  register: (email: string, password: string, name: string, userType: 'student' | 'employer' | 'administrator') => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<User['profile']> & { subscriptionTier?: string; profilePhoto?: string; name?: string }) => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  // Load registered users from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorageUtils.get(STORAGE_KEYS.USERS, []);
    if (storedUsers.length > 0) {
      setRegisteredUsers(storedUsers);
    } else {
      // Initialize with default users if no stored users
      setRegisteredUsers(dummyUsers);
    }
  }, []);

  // Save to localStorage whenever registeredUsers changes
  useEffect(() => {
    if (registeredUsers.length > 0) {
      localStorageUtils.set(STORAGE_KEYS.USERS, registeredUsers);
    }
  }, [registeredUsers]);


  const addRegisteredUser = (newUser: User) => {
    setRegisteredUsers(prev => {
      // Add new user at the top of the list
      const updated = [newUser, ...prev];
      return updated;
    });
  };

  const login = async (email: string, password: string, userType: 'student' | 'employer' | 'administrator'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get fresh users from DataManager to ensure we have the latest data
    const currentUsers = DataManager.getUsers();
    
    // Check if user exists in registered users with correct credentials
    const foundUser = currentUsers.find(u => 
      u.email === email && u.userType === userType
    );
    
    if (foundUser) {
      setUser(foundUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string, userType: 'student' | 'employer' | 'administrator'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = registeredUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
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
    
    addRegisteredUser(newUser);
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (profileData: Partial<User['profile']> & { subscriptionTier?: string; profilePhoto?: string; name?: string }) => {
    if (user) {
      const { subscriptionTier, profilePhoto, name, ...profileOnly } = profileData;
      const updatedUser = {
        ...user,
        ...(name && { name }),
        ...(subscriptionTier && { subscriptionTier }),
        ...(profilePhoto !== undefined && { profilePhoto }),
        profile: {
          ...user.profile,
          ...profileOnly
        }
      };
      setUser(updatedUser);
      
      // Update in registered users as well
      setRegisteredUsers(prev => 
        prev.map(u => u.id === user.id ? updatedUser : u)
      );
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
    registeredUsers,
    addRegisteredUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
