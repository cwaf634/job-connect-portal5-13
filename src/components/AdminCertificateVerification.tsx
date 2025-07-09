import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, CheckCircle, XCircle, Clock, Eye, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApplications } from '@/contexts/ApplicationContext';

interface AdminCertificateVerificationProps {
  uploadedDocuments?: any[];
}

const AdminCertificateVerification = ({ uploadedDocuments = [] }: AdminCertificateVerificationProps) => {
  const { getActiveShopkeepers } = useApplications();
  const activeShopkeepers = getActiveShopkeepers();
  
  // Convert uploaded documents to certificate format for admin verification
  const [certificates, setCertificates] = useState(() => {
    const studentCertificates = uploadedDocuments.map(doc => ({
      id: doc.id,
      studentName: 'Rahul Kumar', // Current student user
      certificateName: doc.certificateName || doc.name,
      issuer: 'Various Institutions',
      dateIssued: doc.uploadDate,
      type: 'educational',
      status: doc.status || 'pending',
      uploadDate: doc.uploadDate,
      verifiedDate: doc.verifiedDate,
      fileUrl: doc.fileUrl,
      shopkeeper: 'Main Shop Owner'
    }));

    // Add default certificate if no documents uploaded but there are active shopkeepers
    if (studentCertificates.length === 0 && activeShopkeepers.length > 0) {
      return [
        {
          id: 1,
          studentName: 'Rahul Kumar',
          certificateName: 'B.Tech Computer Science Certificate',
          issuer: 'Mumbai University',
          dateIssued: '2023-06-15',
          type: 'educational',
          status: 'pending',
          uploadDate: new Date().toISOString().split('T')[0],
          verifiedDate: undefined,
          fileUrl: '/placeholder',
          shopkeeper: 'Main Shop Owner'
        }
      ];
    }

    return studentCertificates;
  });

  // Only show certificates for active shopkeepers
  const filteredCertificatesByShopkeeper = certificates.filter(cert => 
    activeShopkeepers.some(shopkeeper => shopkeeper.name === cert.shopkeeper)
  );

  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleVerify = (certificateId: number) => {
    setCertificates(prev => prev.map(cert => 
      cert.id === certificateId 
        ? { ...cert, status: 'verified', verifiedDate: new Date().toISOString().split('T')[0] }
        : cert
    ));
    
    const certificate = filteredCertificatesByShopkeeper.find(cert => cert.id === certificateId);
    toast({
      title: "Certificate Verified",
      description: `${certificate?.certificateName} has been verified successfully.`,
    });
  };

  const handleReject = (certificateId: number) => {
    setCertificates(prev => prev.map(cert => 
      cert.id === certificateId 
        ? { ...cert, status: 'rejected', verifiedDate: new Date().toISOString().split('T')[0] }
        : cert
    ));
    
    const certificate = filteredCertificatesByShopkeeper.find(cert => cert.id === certificateId);
    toast({
      title: "Certificate Rejected",
      description: `${certificate?.certificateName} has been rejected.`,
      variant: "destructive",
    });
  };

  const handleView = (certificate: any) => {
    setSelectedCertificate(certificate);
    setIsViewOpen(true);
  };

  const searchFilteredCertificates = filteredCertificatesByShopkeeper.filter(cert =>
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getTypeBadge = (type: string) => {
    const colors = {
      educational: 'bg-blue-100 text-blue-700 border-blue-300',
      skill: 'bg-purple-100 text-purple-700 border-purple-300',
      experience: 'bg-orange-100 text-orange-700 border-orange-300',
      other: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return <Badge className={`border ${colors[type as keyof typeof colors] || colors.other}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>;
  };

  // Show message if no active shopkeepers
  if (activeShopkeepers.length === 0) {
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Applications</h3>
            <p className="text-gray-600">Certificates will appear here when students apply for jobs through shopkeepers.</p>
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
          <p className="text-gray-600">Review and verify student certificates from active shopkeepers</p>
        </div>
      </div>

      {/* Active Shopkeepers Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Active Shopkeepers with Applications</h3>
          <div className="flex flex-wrap gap-2">
            {activeShopkeepers.map(shopkeeper => (
              <Badge key={shopkeeper.id} className="bg-blue-100 text-blue-700 border-blue-300">
                {shopkeeper.name} ({shopkeeper.location})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search certificates by student name, certificate name, or issuer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                <p className="text-2xl font-bold text-purple-600">{filteredCertificatesByShopkeeper.length}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                <p className="text-2xl font-bold text-yellow-600">{filteredCertificatesByShopkeeper.filter(c => c.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">{filteredCertificatesByShopkeeper.filter(c => c.status === 'verified').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{filteredCertificatesByShopkeeper.filter(c => c.status === 'rejected').length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Uploaded Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {searchFilteredCertificates.map((certificate) => (
              <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{certificate.certificateName}</h3>
                      <p className="text-sm text-gray-600">Student: {certificate.studentName}</p>
                      <p className="text-sm text-gray-600">Issuer: {certificate.issuer}</p>
                      <p className="text-sm text-gray-600">Via Shopkeeper: {certificate.shopkeeper}</p>
                    </div>
                    <div className="flex space-x-2">
                      {getTypeBadge(certificate.type)}
                      {getStatusBadge(certificate.status)}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Date Issued: {certificate.dateIssued} • Uploaded: {certificate.uploadDate}
                    {certificate.verifiedDate && ` • Verified: ${certificate.verifiedDate}`}
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
            ))}
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
                    <p><strong>Student:</strong> {selectedCertificate.studentName}</p>
                    <p><strong>Issuer:</strong> {selectedCertificate.issuer}</p>
                    <p><strong>Date Issued:</strong> {selectedCertificate.dateIssued}</p>
                    <p><strong>Type:</strong> {selectedCertificate.type}</p>
                    <p><strong>Via Shopkeeper:</strong> {selectedCertificate.shopkeeper}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedCertificate.status)}</p>
                  </div>
                </div>
                <div className="bg-gray-100 h-64 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Certificate preview would appear here</p>
                    <p className="text-sm text-gray-500 mt-1">File: {selectedCertificate.fileUrl}</p>
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
