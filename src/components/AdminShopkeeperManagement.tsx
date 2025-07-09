import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, UserPlus, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApplications } from '@/contexts/ApplicationContext';

const AdminShopkeeperManagement = () => {
  const { shopkeepers, addShopkeeper, updateShopkeeper, deleteShopkeeper } = useApplications();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedShopkeeper, setSelectedShopkeeper] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shopName: '',
    location: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateShopkeeper = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newShopkeeper = {
      id: Date.now(),
      ...formData,
      status: 'active' as const,
      joinedDate: new Date().toISOString().split('T')[0],
      totalApplications: 0
    };

    addShopkeeper(newShopkeeper);
    setIsCreateOpen(false);
    setFormData({ name: '', email: '', shopName: '', location: '' });
    
    toast({
      title: "Shopkeeper Created",
      description: `${formData.name} has been registered successfully and is now available for job applications.`,
    });
  };

  const handleEditShopkeeper = (shopkeeper: any) => {
    setSelectedShopkeeper(shopkeeper);
    setFormData({
      name: shopkeeper.name,
      email: shopkeeper.email,
      shopName: shopkeeper.shopName,
      location: shopkeeper.location
    });
    setIsEditOpen(true);
  };

  const handleUpdateShopkeeper = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedShopkeeper) {
      updateShopkeeper(selectedShopkeeper.id, formData);
    }
    
    setIsEditOpen(false);
    setSelectedShopkeeper(null);
    setFormData({ name: '', email: '', shopName: '', location: '' });
    
    toast({
      title: "Shopkeeper Updated",
      description: `${formData.name} has been updated successfully.`,
    });
  };

  const handleDeleteShopkeeper = (shopkeeperId: number) => {
    const shopkeeperToDelete = shopkeepers.find(s => s.id === shopkeeperId);
    deleteShopkeeper(shopkeeperId);
    
    toast({
      title: "Shopkeeper Deleted",
      description: `${shopkeeperToDelete?.name} has been removed successfully.`,
      variant: "destructive",
    });
  };

  const filteredShopkeepers = shopkeepers.filter(shopkeeper =>
    shopkeeper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shopkeeper.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (shopkeeper.shopName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-700 border border-green-300">Active</Badge>
      : <Badge className="bg-red-100 text-red-700 border border-red-300">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shopkeeper Management</h2>
          <p className="text-gray-600">Manage registered shop owners for job applications</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Register New Shopkeeper
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search shopkeepers by name, email, or shop name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Registered</p>
                <p className="text-2xl font-bold text-green-600">{shopkeepers.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Shops</p>
                <p className="text-2xl font-bold text-blue-600">{shopkeepers.filter(s => s.status === 'active').length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-purple-600">
                  {shopkeepers.reduce((sum, s) => sum + s.totalApplications, 0)}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shopkeepers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Shopkeepers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredShopkeepers.map((shopkeeper) => (
              <div key={shopkeeper.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{shopkeeper.name}</h3>
                      <p className="text-sm text-gray-600">{shopkeeper.email}</p>
                      <p className="text-sm text-green-600 font-medium">{shopkeeper.shopName || shopkeeper.name}</p>
                    </div>
                    <div className="flex space-x-2">
                      {getStatusBadge(shopkeeper.status)}
                      <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                        {shopkeeper.totalApplications} Applications
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Location: {shopkeeper.location} • Joined: {shopkeeper.joinedDate}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditShopkeeper(shopkeeper)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteShopkeeper(shopkeeper.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Shopkeeper Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register New Shopkeeper</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateShopkeeper} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter shopkeeper's full name"
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
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                placeholder="Enter shop name"
                value={formData.shopName}
                onChange={(e) => handleInputChange('shopName', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Note:</strong> Once registered, this shopkeeper will be available for students to select during job applications.
              </p>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Register Shopkeeper
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Shopkeeper Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Shopkeeper</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdateShopkeeper} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-shopName">Shop Name</Label>
              <Input
                id="edit-shopName"
                placeholder="Enter shop name"
                value={formData.shopName}
                onChange={(e) => handleInputChange('shopName', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Update Shopkeeper
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShopkeeperManagement;
