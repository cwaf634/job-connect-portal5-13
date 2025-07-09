import React, { useState } from 'react';
import { Building2, FileText, Users, Award, Target, CreditCard, MessageCircle, Bell, User, LogOut, Camera, Menu, X, UserPlus, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import NotificationPopover from './NotificationPopover';

interface DashboardNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userType: 'student' | 'employer' | 'administrator';
  userName: string;
  onLogout: () => void;
  onDocumentUpload?: (document: any) => void;
  appliedJobs?: any[];
}

const DashboardNavigation = ({ activeTab, onTabChange, userType, userName, onLogout, onDocumentUpload, appliedJobs = [] }: DashboardNavigationProps) => {
  const { getPanelNotifications } = useNotifications();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get panel-specific notifications
  const panelNotifications = getPanelNotifications(userType);
  const jobNotifications = userType === 'employer' ? appliedJobs.filter(job => job.status === 'pending').length : 0;
  const totalUnreadCount = userType === 'employer' 
    ? jobNotifications + panelNotifications.filter(n => !n.isRead).length 
    : panelNotifications.filter(n => !n.isRead).length;

  const handleLogoClick = () => {
    onTabChange('dashboard');
    setIsMobileMenuOpen(false);
  };

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDocument = {
        id: Date.now(),
        name: 'Quick Upload',
        certificateName: file.name.replace(/\.[^/.]+$/, ""),
        type: 'Document',
        status: 'pending',
        uploadDate: new Date().toISOString().split('T')[0],
        verifiedDate: null,
        fileUrl: `/uploaded-${file.name}`
      };

      if (onDocumentUpload) {
        onDocumentUpload(newDocument);
      }

      toast({
        title: "Document Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });

      e.target.value = '';
    }
  };

  const getNavItems = () => {
    const baseItems = [
      { id: 'dashboard', label: t('dashboard') || 'Dashboard', icon: Building2 }
    ];

    if (userType === 'student') {
      return [
        ...baseItems,
        { id: 'jobs', label: 'Jobs Available', icon: FileText },
        { id: 'applications', label: t('applications') || 'My Applications', icon: Users },
        { id: 'certificates', label: t('certificates') || 'Certificates', icon: Award },
        { id: 'mock-tests', label: t('mockTests') || 'Mock Tests', icon: Target },
        { id: 'subscription', label: t('subscription') || 'Subscription', icon: CreditCard },
        { id: 'chat', label: t('chat') || 'Chat', icon: MessageCircle }
      ];
    } else if (userType === 'employer') {
      return [
        ...baseItems,
        { id: 'student-applications', label: t('studentApplications') || 'Applications', icon: Users },
        { id: 'notifications', label: t('notifications') || 'Notifications', icon: Bell },
        { id: 'chat', label: t('chat') || 'Chat', icon: MessageCircle }
      ];
    } else {
      return [
        ...baseItems,
        { id: 'user-management', label: 'Users', icon: UserPlus },
        { id: 'shopkeeper-management', label: 'Shopkeepers', icon: Building2 },
        { id: 'certificate-verification', label: 'Certificates', icon: Award },
        { id: 'subscription-plans', label: 'Plans', icon: CreditCard },
        { id: 'payment', label: 'Payment', icon: Target },
        { id: 'chat', label: t('chat') || 'Chat', icon: MessageCircle }
      ];
    }
  };

  const getPanelColor = () => {
    switch (userType) {
      case 'student': return 'from-blue-600 to-blue-700';
      case 'employer': return 'from-green-600 to-green-700';
      case 'administrator': return 'from-purple-600 to-purple-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getPanelBadgeColor = () => {
    switch (userType) {
      case 'student': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'employer': return 'bg-green-100 text-green-700 border-green-300';
      case 'administrator': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const navItems = getNavItems();

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header - Made smaller */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <div className={`w-7 h-7 bg-gradient-to-r ${getPanelColor()} rounded-lg flex items-center justify-center`}>
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gray-900">{t('jobConnect')}</h1>
              <p className="text-xs text-gray-600">{t('governmentJobPortal')}</p>
            </div>
            <Badge variant="secondary" className={`ml-2 border text-xs ${getPanelBadgeColor()}`}>
              {userType === 'employer' ? 'Shop' : userType === 'administrator' ? 'Admin' : userType.charAt(0).toUpperCase() + userType.slice(1)}
            </Badge>
          </div>

          {/* Desktop Controls - Made smaller */}
          <div className="hidden lg:flex items-center space-x-2">
            <Select value={currentLanguage} onValueChange={setLanguage}>
              <SelectTrigger className="w-20 h-7 border text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="english">🇺🇸 EN</SelectItem>
                <SelectItem value="hindi">🇮🇳 HI</SelectItem>
                <SelectItem value="odia">🇮🇳 OD</SelectItem>
              </SelectContent>
            </Select>

            {userType === 'student' && (
              <div className="relative">
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleDocumentUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="document-upload"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="border border-gray-300 hover:bg-blue-50 w-7 h-7 p-0"
                  asChild
                >
                  <label htmlFor="document-upload" className="cursor-pointer flex items-center justify-center">
                    <Camera className="w-3 h-3" />
                  </label>
                </Button>
              </div>
            )}

            <NotificationPopover appliedJobs={appliedJobs}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative border border-gray-300 hover:bg-yellow-50 w-7 h-7 p-0"
              >
                <Bell className="w-3 h-3" />
                {totalUnreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-3 h-3 text-xs bg-red-500 text-white rounded-full flex items-center justify-center p-0">
                    {totalUnreadCount}
                  </Badge>
                )}
              </Button>
            </NotificationPopover>

            <Button 
              variant="ghost" 
              size="sm" 
              className="border border-gray-300 hover:bg-green-50 flex items-center space-x-1 px-2"
              onClick={() => onTabChange('profile')}
            >
              <Avatar className="w-4 h-4">
                <AvatarImage src={user?.profilePhoto} alt={userName} />
                <AvatarFallback className={`text-xs ${getPanelBadgeColor()}`}>
                  {userName?.charAt(0)?.toUpperCase() || <User className="w-2 h-2" />}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{userName?.split(' ')[0] || 'Profile'}</span>
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout} 
              className="text-red-600 hover:text-red-700 border border-red-300 hover:bg-red-50 font-medium px-2"
            >
              <LogOut className="w-3 h-3 mr-1" />
              <span className="text-xs">{t('logout') || 'Logout'}</span>
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center space-x-2">
            <NotificationPopover appliedJobs={appliedJobs}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative border border-gray-300 hover:bg-yellow-50 w-7 h-7 p-0"
              >
                <Bell className="w-3 h-3" />
                {totalUnreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-3 h-3 text-xs bg-red-500 text-white rounded-full flex items-center justify-center p-0">
                    {totalUnreadCount}
                  </Badge>
                )}
              </Button>
            </NotificationPopover>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-7 h-7 p-0"
            >
              {isMobileMenuOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
            </Button>
          </div>
        </div>

        {/* Desktop Navigation Tabs - Made smaller and no overflow */}
        <div className="hidden lg:flex space-x-3 py-2 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-gray-100 border whitespace-nowrap flex-shrink-0 ${
                  activeTab === item.id
                    ? `text-${userType === 'student' ? 'blue' : userType === 'employer' ? 'green' : 'purple'}-600 bg-${userType === 'student' ? 'blue' : userType === 'employer' ? 'green' : 'purple'}-50 border-${userType === 'student' ? 'blue' : userType === 'employer' ? 'green' : 'purple'}-300`
                    : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-gray-100">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? `text-${userType === 'student' ? 'blue' : userType === 'employer' ? 'green' : 'purple'}-600 bg-${userType === 'student' ? 'blue' : userType === 'employer' ? 'green' : 'purple'}-50 border border-${userType === 'student' ? 'blue' : userType === 'employer' ? 'green' : 'purple'}-300`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <div className="border-t border-gray-100 pt-2 mt-2">
                <button
                  onClick={() => handleTabClick('profile')}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={user?.profilePhoto} alt={userName} />
                    <AvatarFallback className={`text-xs ${getPanelBadgeColor()}`}>
                      {userName?.charAt(0)?.toUpperCase() || <User className="w-3 h-3" />}
                    </AvatarFallback>
                  </Avatar>
                  <span>Profile</span>
                </button>
                
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardNavigation;
