import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Mail, Phone, MapPin, Calendar, ExternalLink, MessageCircle, IndianRupee, Briefcase, Check, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useApplications } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthContext';

interface EmployerStudentApplicationsProps {
  appliedJobs?: any[];
}

const EmployerStudentApplications = ({ appliedJobs = [] }: EmployerStudentApplicationsProps) => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const { updateApplicationStatus, applications, getShopkeeperApplications, shopkeepers } = useApplications();
  const { user } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Find current shopkeeper based on logged in user
  const currentShopkeeper = shopkeepers.find(s => 
    s.name === user?.name || s.email === user?.email
  );
  
  // Get applications for the current shopkeeper
  const shopkeeperName = currentShopkeeper?.name || currentShopkeeper?.shopName || user?.name || 'Main Shop Owner';
  const shopkeeperApplications = getShopkeeperApplications(shopkeeperName);
  
  // Use applications from context if available, otherwise use appliedJobs prop
  const displayApplications = shopkeeperApplications.length > 0 ? shopkeeperApplications : appliedJobs;

  const handleStatusChange = (applicationId: number, newStatus: 'accepted' | 'rejected') => {
    // Update application status in context
    updateApplicationStatus(applicationId, newStatus);
    
    const application = displayApplications.find(app => app.id === applicationId);
    if (application) {
      addNotification({
        type: 'info',
        title: 'Application Status Updated',
        message: `Application for ${application.jobTitle} has been ${newStatus}.`,
        panel: 'employer'
      });
    }
  };

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setIsDetailModalOpen(true);
  };

  const handleApplyNow = (govtLink: string) => {
    window.open(govtLink, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-700 border border-green-300">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Group applications by job
  const jobApplications = displayApplications.reduce((acc, app) => {
    const jobKey = `${app.jobTitle}-${app.department}-${app.location}`;
    if (!acc[jobKey]) {
      acc[jobKey] = {
        jobTitle: app.jobTitle,
        department: app.department,
        location: app.location,
        salary: app.salary,
        govtLink: app.govtLink,
        applications: []
      };
    }
    acc[jobKey].applications.push(app);
    return acc;
  }, {} as Record<string, any>);

  const jobKeys = Object.keys(jobApplications);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Student Applications</h2>
          <p className="text-sm text-gray-600">
            Applications received through {currentShopkeeper?.shopName || shopkeeperName}
          </p>
          {currentShopkeeper && (
            <div className="mt-1">
              <Badge className="bg-green-100 text-green-700 border border-green-300 text-xs">
                Registered Shopkeeper
              </Badge>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          Jobs: {jobKeys.length} | Applications: {displayApplications.length}
        </div>
      </div>

      {jobKeys.length === 0 ? (
        <Card className="text-center py-8 lg:py-12">
          <CardContent>
            <Briefcase className="w-12 lg:w-16 h-12 lg:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-sm text-gray-600">
              Applications from students will appear here when they apply through your registered shop.
            </p>
            {!currentShopkeeper && (
              <p className="text-sm text-orange-600 mt-2">
                Note: You may need to be registered as a shopkeeper in the admin panel to receive applications.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 lg:space-y-6">
          {jobKeys.map((jobKey) => {
            const job = jobApplications[jobKey];
            return (
              <Card key={jobKey} className="border-2 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3 lg:pb-4">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg lg:text-xl text-blue-900 mb-2">{job.jobTitle}</CardTitle>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs lg:text-sm text-gray-600">
                        <div className="flex items-center">
                          <Briefcase className="w-3 lg:w-4 h-3 lg:h-4 mr-1" />
                          {job.department}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 lg:w-4 h-3 lg:h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <IndianRupee className="w-3 lg:w-4 h-3 lg:h-4 mr-1" />
                          {job.salary}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Badge className="bg-blue-100 text-blue-700 border border-blue-300 text-xs">
                        {job.applications.length} Applications
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApplyNow(job.govtLink)}
                        className="text-gray-600 border-gray-300 hover:bg-gray-50 text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Govt Site
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 lg:space-y-4">
                    {job.applications.map((application: any) => (
                      <div key={application.id} className="border rounded-lg p-3 lg:p-4 bg-gray-50">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                          <div className="flex items-start space-x-3 flex-1">
                            <Avatar className="w-8 lg:w-10 h-8 lg:h-10">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs lg:text-sm">
                                {application.studentName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm lg:text-base">{application.studentName}</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 lg:gap-2 mt-2 text-xs lg:text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  <span className="truncate">{application.email}</span>
                                </div>
                                <div className="flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {application.phone}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Applied: {application.appliedDate}
                                </div>
                                <div className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  Via: {application.shopkeeper}
                                </div>
                              </div>
                              {application.hasDocument && (
                                <div className="mt-2">
                                  <Badge className="bg-green-100 text-green-700 border border-green-300 text-xs">
                                    {application.documentName || 'Document Attached'}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-start lg:items-end gap-2">
                            {getStatusBadge(application.status)}
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(application)}
                                className="text-blue-600 border-blue-300 hover:bg-blue-50 text-xs"
                              >
                                <User className="w-3 h-3 mr-1" />
                                Details
                              </Button>
                              
                              {application.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusChange(application.id, 'accepted')}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                  >
                                    <Check className="w-3 h-3 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleStatusChange(application.id, 'rejected')}
                                    className="text-xs"
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-1 text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                              <MessageCircle className="w-3 h-3" />
                              <span>Chat</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Application Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg lg:text-xl">Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4 lg:space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 lg:w-16 h-12 lg:h-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-lg lg:text-xl">
                    {selectedApplication.studentName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg lg:text-xl font-semibold">{selectedApplication.studentName}</h3>
                  <p className="text-sm lg:text-base text-gray-600">Applied for: {selectedApplication.jobTitle}</p>
                </div>
              </div>
              
              <div className="p-3 lg:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm lg:text-base">Job Details</h4>
                <div className="space-y-1 text-xs lg:text-sm">
                  <div><strong>Position:</strong> {selectedApplication.jobTitle}</div>
                  <div><strong>Department:</strong> {selectedApplication.department}</div>
                  <div><strong>Location:</strong> {selectedApplication.location}</div>
                  <div><strong>Salary:</strong> {selectedApplication.salary}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm lg:text-base">Contact Information</h4>
                  <div className="space-y-2 text-xs lg:text-sm">
                    <div className="flex items-center">
                      <Mail className="w-3 lg:w-4 h-3 lg:h-4 mr-2" />
                      <span className="truncate">{selectedApplication.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3 lg:w-4 h-3 lg:h-4 mr-2" />
                      {selectedApplication.phone}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3 lg:w-4 h-3 lg:h-4 mr-2" />
                      Via: {selectedApplication.shopkeeper}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 text-sm lg:text-base">Application Details</h4>
                  <div className="space-y-2 text-xs lg:text-sm">
                    <div>Applied Date: {selectedApplication.appliedDate}</div>
                    <div className="flex items-center">Status: {getStatusBadge(selectedApplication.status)}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-sm lg:text-base">Qualifications</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.qualifications?.map((qual: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {qual}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-sm lg:text-base">Experience</h4>
                <p className="text-xs lg:text-sm text-gray-600">{selectedApplication.experience}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-sm lg:text-base">Cover Letter</h4>
                <p className="text-xs lg:text-sm text-gray-600 p-3 bg-gray-50 rounded border">
                  {selectedApplication.coverLetter}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerStudentApplications;
