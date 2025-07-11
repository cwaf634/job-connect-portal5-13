
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Building2, Shield, Mail, Lock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUserType?: 'student' | 'employer' | 'administrator' | null;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, defaultUserType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'student' | 'employer' | 'administrator'>(
    defaultUserType || 'student'
  );
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  // Demo credentials for different panels
  const demoCredentials = {
    student: {
      email: 'student@jobconnect.com',
      password: 'student123',
      name: 'Demo Student'
    },
    employer: {
      email: 'shopowner@jobconnect.com',
      password: 'shop123',
      name: 'Demo Shop Owner'
    },
    administrator: {
      email: 'admin@jobconnect.com',
      password: 'admin123',
      name: 'Demo Administrator'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome back! Redirecting to your ${userType} dashboard.`,
        });
        onClose();
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDemoLogin = (type: 'student' | 'employer' | 'administrator') => {
    const credentials = demoCredentials[type];
    setEmail(credentials.email);
    setPassword(credentials.password);
    setUserType(type);
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'student': return <User className="w-4 h-4" />;
      case 'employer': return <Building2 className="w-4 h-4" />;
      case 'administrator': return <Shield className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-6">
        <DialogHeader className="text-center space-y-2 mb-6">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </DialogTitle>
          <p className="text-sm text-gray-600">Sign in to your account</p>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* User Type Selection */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
            {Object.entries(demoCredentials).map(([type, creds]) => (
              <button
                key={type}
                type="button"
                onClick={() => handleDemoLogin(type as any)}
                className={`p-2 rounded-md text-xs font-medium transition-all ${
                  userType === type 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  {getUserTypeIcon(type)}
                  <span className="capitalize">{type === 'employer' ? 'Shop' : type === 'administrator' ? 'Admin' : type}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-2 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-2 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Student: student@jobconnect.com</div>
              <div>Shop: shopowner@jobconnect.com</div>
              <div>Admin: admin@jobconnect.com</div>
              <div className="text-gray-500 mt-1">Password: respective123</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
