
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dummyUsers, localStorageUtils, STORAGE_KEYS, DataManager } from '@/data/dummyData';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'student' | 'employer' | 'admin';
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
  login: (email: string, password: string, userType: 'student' | 'employer' | 'admin') => Promise<boolean>;
  register: (email: string, password: string, name: string, userType: 'student' | 'employer' | 'admin') => Promise<boolean>;
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
      localStorageUtils.set(STORAGE_KEYS.USERS, dummyUsers);
    }

    // Check for existing session
    const savedUser = localStorageUtils.get(STORAGE_KEYS.CURRENT_USER, null);
    if (savedUser) {
      setUser(savedUser);
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
      const updated = [newUser, ...prev];
      localStorageUtils.set(STORAGE_KEYS.USERS, updated);
      return updated;
    });
  };

  const login = async (email: string, password: string, userType: 'student' | 'employer' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get fresh users from DataManager and localStorage
      const currentUsers = DataManager.getUsers();
      const storedUsers = localStorageUtils.get(STORAGE_KEYS.USERS, []);
      const allUsers = [...currentUsers, ...storedUsers];
      
      // Normalize userType for comparison (handle both 'employer' and 'admin' cases)
      const normalizedUserType = userType === 'employer' ? 'employer' : userType;
      
      // Check if user exists with correct credentials and user type
      const foundUser = allUsers.find(u => {
        const userTypeMatch = u.userType === normalizedUserType || 
                             (normalizedUserType === 'employer' && u.userType === 'employer') ||
                             (normalizedUserType === 'admin' && (u.userType === 'admin' || u.userType === 'administrator'));
        
        return u.email === email && userTypeMatch;
      });
      
      if (foundUser) {
        // Normalize the user type for consistency
        const normalizedUser = {
          ...foundUser,
          userType: foundUser.userType === 'administrator' ? 'admin' : foundUser.userType
        } as User;
        
        setUser(normalizedUser);
        localStorageUtils.set(STORAGE_KEYS.CURRENT_USER, normalizedUser);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, userType: 'student' | 'employer' | 'admin'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const currentUsers = DataManager.getUsers();
      const storedUsers = localStorageUtils.get(STORAGE_KEYS.USERS, []);
      const allUsers = [...currentUsers, ...storedUsers];
      
      const existingUser = allUsers.find(u => u.email === email);
      if (existingUser) {
        setIsLoading(false);
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        userType: userType === 'admin' ? 'admin' : userType,
        subscriptionTier: userType === 'student' ? 'Basic' : undefined,
        profilePhoto: '',
        profile: {
          phone: '',
          location: '',
          bio: '',
          skills: [],
          experience: '',
          company: userType === 'employer' ? '' : undefined,
          department: ''
        }
      };
      
      addRegisteredUser(newUser);
      setUser(newUser);
      localStorageUtils.set(STORAGE_KEYS.CURRENT_USER, newUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorageUtils.remove(STORAGE_KEYS.CURRENT_USER);
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
      localStorageUtils.set(STORAGE_KEYS.CURRENT_USER, updatedUser);
      
      // Update in registered users as well
      setRegisteredUsers(prev => {
        const updated = prev.map(u => u.id === user.id ? updatedUser : u);
        localStorageUtils.set(STORAGE_KEYS.USERS, updated);
        return updated;
      });
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
