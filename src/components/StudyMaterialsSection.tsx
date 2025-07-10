import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Download, Search, BookOpen, Video, FileImage, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const StudyMaterialsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();

  const isPremium = user?.subscriptionTier && user.subscriptionTier !== 'Basic';

  const categories = ['All', 'PDFs', 'Notes', 'Videos', 'Practice Papers'];

  const materials = [
    {
      id: 1,
      title: 'General Aptitude Study Guide',
      description: 'Comprehensive guide covering arithmetic, reasoning, and logical thinking',
      type: 'PDF',
      category: 'PDFs',
      size: '2.5 MB',
      pages: 45,
      downloadCount: 1250,
      isPremium: false,
      icon: FileText,
      color: 'text-red-600 bg-red-50'
    },
    {
      id: 2,
      title: 'English Grammar Notes',
      description: 'Complete grammar rules with examples and exercises',
      type: 'Notes',
      category: 'Notes',
      size: '1.8 MB',
      pages: 32,
      downloadCount: 890,
      isPremium: false,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 3,
      title: 'Computer Awareness Video Series',
      description: 'Video tutorials on basic computer concepts and digital literacy',
      type: 'Video',
      category: 'Videos',
      size: '250 MB',
      duration: '3h 20m',
      downloadCount: 567,
      isPremium: true,
      icon: Video,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 4,
      title: 'Current Affairs Monthly Digest',
      description: 'Latest current affairs and general knowledge updates',
      type: 'PDF',
      category: 'PDFs',
      size: '3.2 MB',
      pages: 68,
      downloadCount: 2100,
      isPremium: true,
      icon: FileText,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 5,
      title: 'Reasoning Practice Papers',
      description: 'Solved practice papers with detailed explanations',
      type: 'Practice',
      category: 'Practice Papers',
      size: '4.1 MB',
      pages: 120,
      downloadCount: 1680,
      isPremium: true,
      icon: FileImage,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      id: 6,
      title: 'Basic Mathematics Formulas',
      description: 'Quick reference guide for mathematical formulas and concepts',
      type: 'Notes',
      category: 'Notes',
      size: '900 KB',
      pages: 15,
      downloadCount: 950,
      isPremium: false,
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50'
    }
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (material: any) => {
    if (material.isPremium && !isPremium) {
      return;
    }
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${material.title}.${material.type.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Materials</h2>
          <p className="text-gray-600">Download PDFs, notes, and study resources</p>
          {!isPremium && (
            <p className="text-sm text-orange-600 mt-1">
              🔒 Upgrade to Premium to access all study materials
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Available: {filteredMaterials.filter(m => !m.isPremium || isPremium).length} / {materials.length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search study materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-2"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.toLowerCase())}
              className={`border-2 ${
                selectedCategory === category.toLowerCase() 
                  ? "bg-gray-800 text-white border-gray-600" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMaterials.map((material) => {
          const IconComponent = material.icon;
          const canAccess = !material.isPremium || isPremium;
          
          return (
            <Card 
              key={material.id} 
              className={`hover:shadow-lg transition-all duration-300 border-2 ${canAccess ? 'hover:border-blue-300' : 'opacity-75'}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className={`w-12 h-12 ${material.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className="bg-gray-100 text-gray-700 border border-gray-300">
                      {material.type}
                    </Badge>
                    {material.isPremium && (
                      <Badge className="bg-orange-100 text-orange-700 border border-orange-300 text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg">{material.title}</CardTitle>
                <p className="text-sm text-gray-600">{material.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Size:</span> {material.size}
                  </div>
                  <div>
                    <span className="font-medium">
                      {material.type === 'Video' ? 'Duration:' : 'Pages:'}
                    </span> {material.duration || material.pages}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Downloads:</span> {material.downloadCount.toLocaleString()}
                  </div>
                </div>

                {canAccess ? (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 border-2 border-blue-500"
                    onClick={() => handleDownload(material)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {material.type}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-400" disabled>
                      <Lock className="w-4 h-4 mr-2" />
                      Premium Required
                    </Button>
                    <p className="text-xs text-orange-600 text-center">
                      Upgrade to access this material
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Access Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Study Tips & Guidelines
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                Access our comprehensive study guide and exam preparation strategies
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <BookOpen className="w-4 h-4 mr-2" />
                View Study Guide
              </Button>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyMaterialsSection;