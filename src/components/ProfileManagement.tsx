import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, Building, Users } from 'lucide-react';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import { useLanguage } from '@/contexts/LanguageContext';

const ProfileManagement = () => {
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills?.join(', ') || '',
    experience: user?.profile?.experience || '',
    company: user?.profile?.company || '',
    department: user?.profile?.department || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (photoUrl: string) => {
    updateProfile({ profilePhoto: photoUrl });
    addNotification({
      type: 'photo_update',
      title: 'Profile Photo Updated',
      message: 'Your profile photo has been changed successfully.'
    });
  };

  const handleSave = () => {
    const changes: string[] = [];
    const originalData = {
      name: user?.name || '',
      phone: user?.profile?.phone || '',
      location: user?.profile?.location || '',
      bio: user?.profile?.bio || '',
      skills: user?.profile?.skills?.join(', ') || '',
      experience: user?.profile?.experience || '',
      company: user?.profile?.company || '',
      department: user?.profile?.department || ''
    };

    // Track what changed
    if (formData.name !== originalData.name) changes.push('name');
    if (formData.phone !== originalData.phone) changes.push('phone');
    if (formData.location !== originalData.location) changes.push('location');
    if (formData.bio !== originalData.bio) changes.push('bio');
    if (formData.skills !== originalData.skills) changes.push('skills');
    if (formData.experience !== originalData.experience) changes.push('experience');
    if (formData.company !== originalData.company) changes.push('company');
    if (formData.department !== originalData.department) changes.push('department');

    const profileData = {
      name: formData.name,
      phone: formData.phone,
      location: formData.location,
      bio: formData.bio,
      skills: formData.skills.split(', ').filter(skill => skill.trim()),
      experience: formData.experience,
      company: formData.company,
      department: formData.department
    };

    updateProfile(profileData);
    setIsEditing(false);
    
    if (changes.length > 0) {
      addNotification({
        type: 'profile_update',
        title: 'Profile Updated',
        message: `Updated: ${changes.join(', ')}`
      });
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
      location: user?.profile?.location || '',
      bio: user?.profile?.bio || '',
      skills: user?.profile?.skills?.join(', ') || '',
      experience: user?.profile?.experience || '',
      company: user?.profile?.company || '',
      department: user?.profile?.department || ''
    });
    setIsEditing(false);
  };

  const renderStudentProfile = () => (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="skills">Skills</Label>
          <Input
            id="skills"
            placeholder="e.g., JavaScript, Python, React"
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Experience Level</Label>
          <Input
            id="experience"
            placeholder="e.g., Fresher, 2 years experience"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>
    </>
  );

  const renderEmployerProfile = () => (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            placeholder="Your company name"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            placeholder="e.g., HR, Engineering, Marketing"
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>
    </>
  );

  const renderAdministratorProfile = () => (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            placeholder="e.g., Education Ministry, IT Department"
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Service</Label>
          <Input
            id="experience"
            placeholder="Years in government service"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </div>
    </>
  );

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <ProfilePhotoUpload
                currentPhoto={user.profilePhoto}
                userName={user.name}
                onPhotoChange={handlePhotoChange}
                disabled={!isEditing}
              />
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-lg">
                  {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)} Profile
                </CardDescription>
              </div>
            </div>
            <div className="space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your personal and professional information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled={true}
                  className="bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Role-specific fields */}
          {user.userType === 'student' && renderStudentProfile()}
          {user.userType === 'employer' && renderEmployerProfile()}
          {user.userType === 'administrator' && renderAdministratorProfile()}

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">About</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Complete your profile to improve visibility</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Account verified and active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2024</div>
            <p className="text-xs text-muted-foreground">Welcome to JobConnect</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileManagement;
