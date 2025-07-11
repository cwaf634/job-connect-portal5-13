
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DataManager } from '@/data/dataManager';

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
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, userType: User['userType']) => Promise<boolean>;
  logout: () => void;
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

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('jobconnect_current_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('jobconnect_current_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const users = DataManager.getUsers();
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        // In a real app, you'd verify the password here
        // For demo purposes, we'll accept specific demo passwords
        const validPasswords = {
          'student@jobconnect.com': 'student123',
          'shopowner@jobconnect.com': 'shop123',
          'admin@jobconnect.com': 'admin123'
        };
        
        const expectedPassword = validPasswords[email as keyof typeof validPasswords];
        if (password === expectedPassword || password === 'demo123') {
          setUser(foundUser);
          localStorage.setItem('jobconnect_current_user', JSON.stringify(foundUser));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, userType: User['userType']): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const users = DataManager.getUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        return false; // User already exists
      }
      
      const newUser: Omit<User, 'id'> = {
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
      
      const createdUser = DataManager.addUser(newUser);
      setUser(createdUser);
      localStorage.setItem('jobconnect_current_user', JSON.stringify(createdUser));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobconnect_current_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
