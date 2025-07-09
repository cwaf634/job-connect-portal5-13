import React, { useState, useEffect } from 'react';
import { Upload, FileText, Eye, Download, Trash2, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { DataManager, Certificate } from '@/data/dataManager';
import { useAuth } from '@/contexts/AuthContext';

const CertificatesSection = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState({
    certificateName: '',
    description: '',
    file: null as File | null
  });
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Load user's certificates
  useEffect(() => {
    if (user) {
      const userCertificates = DataManager.getCertificatesByUser(user.id);
      setCertificates(userCertificates);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.certificateName || !formData.file || !user) {
      toast({
        title: "Error",
        description: "Please fill all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    const newCertificate = DataManager.addCertificate({
      userId: user.id,
      certificateName: formData.certificateName,
      description: formData.description || '',
      issueDate: new Date().toISOString().split('T')[0],
      certificateFile: formData.file.name,
      status: 'pending'
    });

    // Update local state
    setCertificates(prev => [newCertificate, ...prev]);
    setIsUploadOpen(false);
    
    // Reset form
    setFormData({
      certificateName: '',
      description: '',
      file: null
    });
    
    // Send notification
    addNotification({
      type: 'info',
      title: "Certificate Uploaded",
      message: `${formData.certificateName} has been uploaded successfully and sent to admin for verification.`,
      panel: 'student'
    });
    
    toast({
      title: "Certificate Uploaded",
      description: `${formData.certificateName} has been uploaded and sent to admin for verification.`,
    });
  };

  const handleView = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setIsViewOpen(true);
  };

  const handleDownload = (cert: Certificate) => {
    // Create a mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${cert.certificateName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `Downloading ${cert.certificateName}...`,
    });
  };

  const handleDelete = (certId: string) => {
    const certToDelete = certificates.find(cert => cert.id === certId);
    
    // Delete from data manager
    const deleted = DataManager.deleteCertificate(certId);
    
    if (deleted) {
      // Update local state
      setCertificates(prev => prev.filter(cert => cert.id !== certId));
      
      addNotification({
        type: 'info',
        title: "Certificate Deleted",
        message: `${certToDelete?.certificateName} has been removed from your profile.`,
        panel: 'student'
      });
      
      toast({
        title: "Certificate Deleted",
        description: "Certificate has been removed successfully.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'pending': return 'Pending Verification';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Certificates</h2>
          <p className="text-gray-600">Upload and manage your certificates for verification</p>
        </div>
        <Button 
          onClick={() => setIsUploadOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Certificate
        </Button>
      </div>

      {/* Status Summary */}
      {certificates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-green-50 border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {certificates.filter(cert => cert.status === 'verified').length}
            </div>
            <div className="text-sm text-green-700">Verified</div>
          </Card>
          <Card className="p-4 text-center bg-yellow-50 border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">
              {certificates.filter(cert => cert.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-700">Pending</div>
          </Card>
          <Card className="p-4 text-center bg-gray-50 border-gray-200">
            <div className="text-2xl font-bold text-gray-600">
              {certificates.length}
            </div>
            <div className="text-sm text-gray-700">Total</div>
          </Card>
        </div>
      )}

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="hover:shadow-lg transition-all duration-300 border-2">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <Badge className={`${getStatusColor(cert.status)} border`}>
                    {getStatusText(cert.status)}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {cert.certificateName}
                </CardTitle>
                <div className="space-y-1 text-sm text-gray-600">
                  <div><strong>Issue Date:</strong> {cert.issueDate}</div>
                  {cert.description && (
                    <div><strong>Description:</strong> {cert.description}</div>
                  )}
                  {cert.verifiedDate && (
                    <div><strong>Verified:</strong> {cert.verifiedDate}</div>
                  )}
                  {cert.verifiedBy && (
                    <div><strong>Verified By:</strong> {cert.verifiedBy}</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50"
                    onClick={() => handleView(cert)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-green-600 border-green-300 hover:bg-green-50"
                    onClick={() => handleDownload(cert)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
            <p className="text-gray-600 mb-6">Upload your certificates to get them verified by admin</p>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Your First Certificate
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">Upload Certificate</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsUploadOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="certificate-name">Certificate Name *</Label>
              <Input
                id="certificate-name"
                placeholder="e.g., 12th Grade Certificate, BCA Degree"
                value={formData.certificateName}
                onChange={(e) => handleInputChange('certificateName', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the certificate"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="certificate-file">Upload File *</Label>
              <Input
                id="certificate-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
                className="cursor-pointer"
              />
              {formData.file && (
                <div className="flex items-center mt-2 p-2 bg-green-50 rounded border border-green-200">
                  <FileText className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-700">{formData.file.name}</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your certificate will be sent to admin for verification. Ensure it's clear and readable. Supported formats: PDF, JPG, PNG
              </p>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Certificate
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Certificate Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Certificate Details</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold">{selectedCertificate.certificateName}</h3>
                <p className="text-gray-600">{selectedCertificate.description}</p>
                <Badge className={`mt-2 ${getStatusColor(selectedCertificate.status)} border`}>
                  {getStatusText(selectedCertificate.status)}
                </Badge>
              </div>
              <div className="bg-gray-100 h-96 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Certificate preview</p>
                  <p className="text-sm text-gray-500 mt-2">File: {selectedCertificate.certificateFile}</p>
                  <p className="text-sm text-gray-500">Status: {getStatusText(selectedCertificate.status)}</p>
                </div>
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() => handleDownload(selectedCertificate)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificatesSection;