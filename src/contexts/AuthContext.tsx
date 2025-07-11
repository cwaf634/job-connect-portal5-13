import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  _id: string;
  id: string;
  email: string;
  name: string;
  userType: 'student' | 'employer' | 'administrator';
  phone?: string;
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
  // Backend specific fields
  studentDetails?: {
    dateOfBirth?: Date;
    address?: string;
    education?: string;
    experience?: string;
    skills?: string[];
    resume?: string;
    certificates?: any[];
    subscriptionPlan?: string;
    subscriptionExpiry?: Date;
    mockTestsCompleted?: number;
  };
  employerDetails?: {
    companyName?: string;
    companyAddress?: string;
    companyPhone?: string;
    shopName?: string;
    location?: string;
    businessLicense?: string;
    verificationStatus?: string;
  };
  adminDetails?: {
    permissions?: string[];
    lastLogin?: Date;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registeredUsers: User[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, userType: User['userType'], additionalData?: any) => Promise<boolean>;
  logout: () => void;
  addRegisteredUser: (user: User) => void;
  updateProfile: (profileData: Partial<User>) => void;
  token: string | null;
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

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [token, setToken] = useState<string | null>(null);

  // Check for existing auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('jobconnect_token');
    const storedUser = localStorage.getItem('jobconnect_current_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        // Ensure id field is set from _id
        if (parsedUser._id && !parsedUser.id) {
          parsedUser.id = parsedUser._id;
        }
        setUser(parsedUser);
        
        // Verify token with backend
        verifyToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('jobconnect_token');
        localStorage.removeItem('jobconnect_current_user');
      }
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      const userData = data.user;
      
      // Ensure id field is set from _id
      if (userData._id && !userData.id) {
        userData.id = userData._id;
      }
      
      setUser(userData);
      localStorage.setItem('jobconnect_current_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed:', data.message);
        return false;
      }

      const { token: authToken, user: userData } = data;
      
      // Ensure id field is set from _id
      if (userData._id && !userData.id) {
        userData.id = userData._id;
      }

      // Map backend userType to frontend userType
      if (userData.userType === 'admin') {
        userData.userType = 'administrator';
      }

      setToken(authToken);
      setUser(userData);
      
      localStorage.setItem('jobconnect_token', authToken);
      localStorage.setItem('jobconnect_current_user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    userType: User['userType'],
    additionalData?: any
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Map frontend userType to backend userType
      const backendUserType = userType === 'administrator' ? 'admin' : userType;
      
      const requestBody = {
        email,
        password,
        name,
        userType: backendUserType,
        ...additionalData
      };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Registration failed:', data.message);
        return false;
      }

      const { token: authToken, user: userData } = data;
      
      // Ensure id field is set from _id
      if (userData._id && !userData.id) {
        userData.id = userData._id;
      }

      // Map backend userType to frontend userType
      if (userData.userType === 'admin') {
        userData.userType = 'administrator';
      }

      setToken(authToken);
      setUser(userData);
      
      localStorage.setItem('jobconnect_token', authToken);
      localStorage.setItem('jobconnect_current_user', JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addRegisteredUser = (newUser: User) => {
    setRegisteredUsers(prev => [...prev, newUser]);
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user || !token) return;
    
    try {
      // Update locally first for immediate UI feedback
      const updatedUser = { ...user, ...profileData };
      if (profileData.profile) {
        updatedUser.profile = { ...user.profile, ...profileData.profile };
      }
      
      setUser(updatedUser);
      localStorage.setItem('jobconnect_current_user', JSON.stringify(updatedUser));
      
      // Update in registered users list
      setRegisteredUsers(prev => 
        prev.map(u => u.id === user.id ? updatedUser : u)
      );

      // TODO: Implement backend profile update endpoint
      // const response = await fetch(`${API_BASE_URL}/users/profile`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(profileData),
      // });
      
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('jobconnect_token');
      localStorage.removeItem('jobconnect_current_user');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    registeredUsers,
    login,
    register,
    logout,
    addRegisteredUser,
    updateProfile,
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
