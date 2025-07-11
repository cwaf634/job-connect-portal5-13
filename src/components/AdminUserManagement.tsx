import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, UserPlus, Edit, Trash2, Search, Eye, BookOpen, Award, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth, User } from '@/contexts/AuthContext';
import { DataManager } from '@/data/dummyData';

const AdminUserManagement = () => {
  const { registeredUsers, addRegisteredUser } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'student' as 'student' | 'employer' | 'administrator',
    subscriptionTier: 'Basic'
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      userType: formData.userType,
      subscriptionTier: formData.subscriptionTier,
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
    setIsCreateOpen(false);
    setFormData({ name: '', email: '', userType: 'student', subscriptionTier: 'Basic' });
    
    toast({
      title: "User Created",
      description: `${formData.name} has been created successfully and can now login.`,
    });
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      userType: user.userType,
      subscriptionTier: user.subscriptionTier
    });
    setIsEditOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsEditOpen(false);
    setSelectedUser(null);
    setFormData({ name: '', email: '', userType: 'student', subscriptionTier: 'Basic' });
    
    toast({
      title: "User Updated",
      description: `${formData.name} has been updated successfully.`,
    });
  };

  const handleDeleteUser = (userId: number) => {
    toast({
      title: "User Deleted",
      description: `User has been removed successfully.`,
      variant: "destructive",
    });
  };

  // Filter to show only students in user management
  const studentUsers = registeredUsers.filter(user => user.userType === 'student');
  
  const filteredUsers = studentUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string = 'active') => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-700 border border-green-300">Active</Badge>
      : <Badge className="bg-red-100 text-red-700 border border-red-300">Inactive</Badge>;
  };

  const getUserTypeBadge = (userType: string) => {
    const colors = {
      student: 'bg-blue-100 text-blue-700 border-blue-300',
      employer: 'bg-green-100 text-green-700 border-green-300',
      administrator: 'bg-purple-100 text-purple-700 border-purple-300'
    };
    return <Badge className={`border ${colors[userType as keyof typeof colors]}`}>
      {userType.charAt(0).toUpperCase() + userType.slice(1)}
    </Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage registered users who can login to the system</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create New User
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats - Only showing student-related data and clickable */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{studentUsers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-green-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-green-600">{studentUsers.filter(u => u.subscriptionTier !== 'Basic').length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-yellow-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premium Students</p>
                <p className="text-2xl font-bold text-orange-600">{studentUsers.filter(u => u.subscriptionTier === 'Premium').length}</p>
              </div>
              <Award className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-purple-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enterprise Students</p>
                <p className="text-2xl font-bold text-purple-600">{studentUsers.filter(u => u.subscriptionTier === 'Enterprise').length}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Users ({studentUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          {user.profile?.location || 'Location not set'} • {user.profile?.phone || 'Phone not set'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                          Student
                        </Badge>
                        {getStatusBadge('active')}
                        <Badge className={`border ${
                          user.subscriptionTier === 'Premium' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                          user.subscriptionTier === 'Enterprise' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                          'bg-gray-100 text-gray-700 border-gray-300'
                        }`}>
                          {user.subscriptionTier}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Skills: {user.profile?.skills?.join(', ') || 'Not specified'} • Experience: {user.profile?.experience || 'Not specified'}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No students found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="userType">User Type</Label>
              <Select value={formData.userType} onValueChange={(value: 'student' | 'employer' | 'administrator') => handleInputChange('userType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="employer">Shop Owner</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subscriptionTier">Subscription Tier</Label>
              <Select value={formData.subscriptionTier} onValueChange={(value) => handleInputChange('subscriptionTier', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This user will be able to login with their email and the default password "respective123".
              </p>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Create User
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
