import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, CheckCircle, XCircle, Clock, Eye, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DataManager, Certificate } from '@/data/dataManager';

const AdminCertificateVerification = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Load certificates from localStorage
  useEffect(() => {
    const loadCertificates = () => {
      const allCertificates = DataManager.getCertificates();
      setCertificates(allCertificates);
    };

    loadCertificates();

    // Set up polling to refresh data every 2 seconds for real-time updates
    const interval = setInterval(loadCertificates, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = (certificateId: string) => {
    const updatedCert = DataManager.updateCertificate(certificateId, {
      status: 'verified',
      verifiedDate: new Date().toISOString().split('T')[0],
      verifiedBy: 'Admin'
    });
    
    if (updatedCert) {
      setCertificates(prev => prev.map(cert => 
        cert.id === certificateId ? updatedCert : cert
      ));
      
      toast({
        title: "Certificate Verified",
        description: `${updatedCert.certificateName} has been verified successfully.`,
      });
    }
  };

  const handleReject = (certificateId: string) => {
    const updatedCert = DataManager.updateCertificate(certificateId, {
      status: 'rejected',
      verifiedDate: new Date().toISOString().split('T')[0],
      verifiedBy: 'Admin'
    });
    
    if (updatedCert) {
      setCertificates(prev => prev.map(cert => 
        cert.id === certificateId ? updatedCert : cert
      ));
      
      toast({
        title: "Certificate Rejected",
        description: `${updatedCert.certificateName} has been rejected.`,
        variant: "destructive",
      });
    }
  };

  const handleView = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsViewOpen(true);
  };

  // Get user info for display
  const getUserInfo = (userId: string) => {
    const users = DataManager.getUsers();
    return users.find(user => user.id === userId);
  };

  const searchFilteredCertificates = certificates.filter(cert => {
    const user = getUserInfo(cert.userId);
    const userName = user?.name || 'Unknown User';
    
    return userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           cert.certificateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           cert.status.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-700 border border-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border border-red-300">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300">
          <Clock className="w-3 h-3 mr-1" />
          Pending Verification
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Show empty state if no certificates
  if (certificates.length === 0) {
    return (
      <div className="space-y-6 overflow-hidden">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Certificate Verification</h2>
            <p className="text-gray-600">Review and verify student certificates</p>
          </div>
        </div>
        
        <Card className="text-center py-12">
          <CardContent>
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
            <p className="text-gray-600">Certificates will appear here when students upload them.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Certificate Verification</h2>
          <p className="text-gray-600">Review and verify student certificates uploaded for verification</p>
        </div>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Refresh Data
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search certificates by student name, certificate name, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-purple-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                <p className="text-2xl font-bold text-purple-600">{certificates.length}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-yellow-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-2xl font-bold text-yellow-600">{certificates.filter(c => c.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-green-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">{certificates.filter(c => c.status === 'verified').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-red-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{certificates.filter(c => c.status === 'rejected').length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Uploaded Certificates ({searchFilteredCertificates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {searchFilteredCertificates.length > 0 ? (
              searchFilteredCertificates.map((certificate) => {
                const user = getUserInfo(certificate.userId);
                return (
                  <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{certificate.certificateName}</h3>
                          <p className="text-sm text-gray-600">Student: {user?.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-600">Email: {user?.email || 'Unknown Email'}</p>
                          <p className="text-sm text-gray-600">Type: {user?.userType || 'Unknown'}</p>
                        </div>
                        <div className="flex space-x-2">
                          {getStatusBadge(certificate.status)}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Issue Date: {certificate.issueDate} • Uploaded: {certificate.uploadDate}
                        {certificate.verifiedDate && ` • Verified: ${certificate.verifiedDate}`}
                        {certificate.verifiedBy && ` • By: ${certificate.verifiedBy}`}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleView(certificate)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      {certificate.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleVerify(certificate.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verify
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReject(certificate.id)}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No certificates found</p>
                <p className="text-sm">Certificates will appear here when students upload them</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Certificate Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Certificate Details</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedCertificate.certificateName}</h3>
                  <div className="space-y-2 mt-2">
                    <p><strong>Student:</strong> {getUserInfo(selectedCertificate.userId)?.name || 'Unknown User'}</p>
                    <p><strong>Email:</strong> {getUserInfo(selectedCertificate.userId)?.email || 'Unknown Email'}</p>
                    <p><strong>Issue Date:</strong> {selectedCertificate.issueDate}</p>
                    <p><strong>Upload Date:</strong> {selectedCertificate.uploadDate}</p>
                    <p><strong>Description:</strong> {selectedCertificate.description || 'No description'}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedCertificate.status)}</p>
                    {selectedCertificate.verifiedDate && (
                      <p><strong>Verified Date:</strong> {selectedCertificate.verifiedDate}</p>
                    )}
                    {selectedCertificate.verifiedBy && (
                      <p><strong>Verified By:</strong> {selectedCertificate.verifiedBy}</p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-100 h-64 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Certificate preview would appear here</p>
                    <p className="text-sm text-gray-500 mt-1">File: {selectedCertificate.certificateFile}</p>
                  </div>
                </div>
              </div>
              
              {selectedCertificate.status === 'pending' && (
                <div className="flex space-x-2 pt-4 border-t">
                  <Button 
                    onClick={() => {
                      handleVerify(selectedCertificate.id);
                      setIsViewOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Certificate
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleReject(selectedCertificate.id);
                      setIsViewOpen(false);
                    }}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Certificate
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCertificateVerification;
