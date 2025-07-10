import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Plus, Edit, Trash2, Star, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DataManager } from '@/data/dummyData';

const AdminSubscriptionPlans = () => {
  const [plans, setPlans] = useState(DataManager.getAdminPlans());
  const [defaultPlans, setDefaultPlans] = useState([
    {
      id: 1,
      name: 'Free Plan',
      price: 0,
      duration: 'monthly',
      description: 'Perfect for getting started',
      features: ['Basic job notifications', 'View job details', 'General vacancy info'],
      maxUsers: 1,
      storage: '1GB',
      support: 'Email',
      status: 'active',
      isPopular: false,
      color: 'blue'
    },
    {
      id: 2,
      name: 'Premium Plan',
      price: 299,
      duration: 'monthly',
      description: 'Most popular choice for job seekers',
      features: ['Personalized job feed', 'Advanced notifications', 'Location & category wise vacancy'],
      maxUsers: 1,
      storage: '10GB',
      support: 'Email & Chat',
      status: 'active',
      isPopular: true,
      color: 'green'
    },
    {
      id: 3,
      name: 'Pro Plan',
      price: 599,
      duration: 'monthly',
      description: 'Complete exam preparation suite',
      features: ['All Premium features', 'Full mock test suite', 'Performance analytics'],
      maxUsers: 1,
      storage: '50GB',
      support: '24/7 Phone & Chat',
      status: 'active',
      isPopular: false,
      color: 'purple'
    }
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 'monthly',
    description: '',
    features: '',
    maxUsers: '1',
    storage: '',
    support: '',
    color: 'blue',
    isPopular: false
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPlan = {
      name: formData.name,
      price: parseInt(formData.price),
      duration: formData.duration,
      description: formData.description,
      features: formData.features.split('\n').filter(f => f.trim()),
      maxUsers: parseInt(formData.maxUsers),
      storage: formData.storage,
      support: formData.support,
      color: formData.color,
      isPopular: formData.isPopular,
      status: 'active',
      iconColor: 'text-gray-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    };

    const createdPlan = DataManager.addAdminPlan(newPlan);
    setPlans(prev => [createdPlan, ...prev]);
    setIsCreateOpen(false);
    resetForm();
    
    toast({
      title: "Plan Created",
      description: `${formData.name} has been created successfully and is now available for students.`,
    });
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration,
      description: plan.description,
      features: plan.features.join('\n'),
      maxUsers: plan.maxUsers.toString(),
      storage: plan.storage,
      support: plan.support,
      color: plan.color,
      isPopular: plan.isPopular
    });
    setIsEditOpen(true);
  };

  const handleUpdatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = {
      name: formData.name,
      price: parseInt(formData.price),
      duration: formData.duration,
      description: formData.description,
      features: formData.features.split('\n').filter(f => f.trim()),
      maxUsers: parseInt(formData.maxUsers),
      storage: formData.storage,
      support: formData.support,
      color: formData.color,
      isPopular: formData.isPopular
    };

    DataManager.updateAdminPlan(selectedPlan?.id, updatedData);
    setPlans(DataManager.getAdminPlans());
    
    setIsEditOpen(false);
    setSelectedPlan(null);
    resetForm();
    
    toast({
      title: "Plan Updated",
      description: `${formData.name} has been updated successfully and changes are reflected in student panel.`,
    });
  };

  const handleDeletePlan = (planId: string) => {
    const planToDelete = plans.find(plan => plan.id === planId);
    DataManager.deleteAdminPlan(planId);
    setPlans(DataManager.getAdminPlans());
    
    toast({
      title: "Plan Deleted",
      description: `${planToDelete?.name} has been removed successfully.`,
      variant: "destructive",
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      duration: 'monthly',
      description: '',
      features: '',
      maxUsers: '1',
      storage: '',
      support: '',
      color: 'blue',
      isPopular: false
    });
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-300 bg-blue-50',
      green: 'border-green-300 bg-green-50',
      purple: 'border-purple-300 bg-purple-50',
      orange: 'border-orange-300 bg-orange-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
          <p className="text-gray-600">Create and manage subscription plans for your users</p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold text-blue-600">{plans.length}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-green-600">{plans.filter(p => p.status === 'active').length}</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Popular Plans</p>
                <p className="text-2xl font-bold text-purple-600">{plans.filter(p => p.isPopular).length}</p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Free Plans</p>
                <p className="text-2xl font-bold text-orange-600">{plans.filter(p => p.price === 0).length}</p>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...defaultPlans, ...plans].map((plan) => (
          <Card key={plan.id} className={`relative border-2 ${getColorClasses(plan.color)} ${plan.isPopular ? 'ring-2 ring-yellow-400' : ''}`}>
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-400 text-yellow-900 px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-gray-900">
                ₹{plan.price}
                <span className="text-sm font-normal text-gray-600">/{plan.duration}</span>
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
                <div><strong>Max Users:</strong> {plan.maxUsers}</div>
                <div><strong>Storage:</strong> {plan.storage}</div>
                <div><strong>Support:</strong> {plan.support}</div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEditPlan(plan)}
                  className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDeletePlan(plan.id.toString())}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Plan Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Subscription Plan</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Premium Plan"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="299"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Color Theme</Label>
                <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the plan"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                placeholder="Personalized job feed&#10;Advanced notifications&#10;Location & category wise vacancy"
                value={formData.features}
                onChange={(e) => handleInputChange('features', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maxUsers">Max Users</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={formData.maxUsers}
                  onChange={(e) => handleInputChange('maxUsers', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="storage">Storage</Label>
                <Input
                  id="storage"
                  placeholder="10GB"
                  value={formData.storage}
                  onChange={(e) => handleInputChange('storage', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="support">Support Type</Label>
                <Input
                  id="support"
                  placeholder="Email & Chat"
                  value={formData.support}
                  onChange={(e) => handleInputChange('support', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPopular"
                checked={formData.isPopular}
                onChange={(e) => handleInputChange('isPopular', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="isPopular">Mark as Popular Plan</Label>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Create Plan
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subscription Plan</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdatePlan} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Plan Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Premium Plan"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  placeholder="299"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-duration">Duration</Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-color">Color Theme</Label>
                <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Brief description of the plan"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-features">Features (one per line)</Label>
              <Textarea
                id="edit-features"
                placeholder="Personalized job feed&#10;Advanced notifications&#10;Location & category wise vacancy"
                value={formData.features}
                onChange={(e) => handleInputChange('features', e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-maxUsers">Max Users</Label>
                <Input
                  id="edit-maxUsers"
                  type="number"
                  value={formData.maxUsers}
                  onChange={(e) => handleInputChange('maxUsers', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-storage">Storage</Label>
                <Input
                  id="edit-storage"
                  placeholder="10GB"
                  value={formData.storage}
                  onChange={(e) => handleInputChange('storage', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-support">Support Type</Label>
                <Input
                  id="edit-support"
                  placeholder="Email & Chat"
                  value={formData.support}
                  onChange={(e) => handleInputChange('support', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-isPopular"
                checked={formData.isPopular}
                onChange={(e) => handleInputChange('isPopular', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="edit-isPopular">Mark as Popular Plan</Label>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Update Plan
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSubscriptionPlans;
