
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Building2, Clock, ExternalLink, FileText, User, Mail, Phone, Briefcase, GraduationCap, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApplications } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthContext';

interface StudentApplicationsSectionProps {
  appliedJobs?: any[];
}

const StudentApplicationsSection = ({ appliedJobs = [] }: StudentApplicationsSectionProps) => {
  const { t } = useLanguage();
  const { applications } = useApplications();
  const { user, registeredUsers } = useAuth();
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  // Only show applications from registered students
  const studentApplications = applications.filter(app => {
    const isCurrentUser = app.email === user?.email || app.studentName === user?.name;
    const isRegisteredUser = registeredUsers.some(u => 
      u.userType === 'student' && (u.email === app.email || u.name === app.studentName)
    );
    return isCurrentUser && isRegisteredUser;
  });

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300 text-xs">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-700 border border-green-300 text-xs">
          <Award className="w-3 h-3 mr-1" />
          Accepted
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border border-red-300 text-xs">
          <ExternalLink className="w-3 h-3 mr-1" />
          Rejected
        </Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  const handleGovtSiteRedirect = (govtLink: string) => {
    window.open(govtLink, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
          <p className="text-sm text-gray-600">Track your job applications</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-blue-900 font-medium text-sm">{studentApplications.length}</span>
        </div>
      </div>

      <div className="grid gap-3">
        {studentApplications.length > 0 ? (
          studentApplications.map((application) => {
            const isExpanded = expandedCards.has(application.id);
            return (
              <Card key={application.id} className="hover:shadow-md transition-all duration-200 border">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold text-gray-900 mb-1">
                        {application.jobTitle}
                      </CardTitle>
                      <div className="flex items-center space-x-3 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          {application.department}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {application.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {application.appliedDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(application.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(application.id)}
                        className="h-6 w-6 p-0"
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    {/* Compact Personal Info */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1 text-gray-500" />
                          <span>{application.studentName}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1 text-gray-500" />
                          <span className="truncate">{application.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-gray-500" />
                          <span>{application.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-3 h-3 mr-1 text-gray-500" />
                          <span>{application.experience}</span>
                        </div>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2 text-sm flex items-center">
                        <Briefcase className="w-3 h-3 mr-1" />
                        Job Details
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                        <div><span className="font-medium">Position:</span> {application.jobTitle}</div>
                        <div><span className="font-medium">Salary:</span> {application.salary}</div>
                        <div><span className="font-medium">Applied via:</span> {application.shopkeeper}</div>
                        <div><span className="font-medium">Status:</span> {application.status}</div>
                      </div>
                    </div>

                    {/* Qualifications */}
                    {application.qualifications && application.qualifications.length > 0 && (
                      <div className="text-xs">
                        <div className="flex items-center mb-1">
                          <GraduationCap className="w-3 h-3 mr-1 text-purple-600" />
                          <span className="font-medium">Qualifications:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {application.qualifications.map((qual, index) => (
                            <Badge key={index} variant="outline" className="text-xs py-0 px-1">
                              {qual}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Message */}
                    <div className={`p-3 rounded-lg text-xs ${
                      application.status === 'pending' ? 'bg-yellow-50 text-yellow-800' :
                      application.status === 'accepted' ? 'bg-green-50 text-green-800' :
                      'bg-red-50 text-red-800'
                    }`}>
                      {application.status === 'pending' && 'Your application is under review.'}
                      {application.status === 'accepted' && 'Congratulations! Your application has been accepted.'}
                      {application.status === 'rejected' && 'Unfortunately, your application was not selected.'}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGovtSiteRedirect(application.govtLink || '#')}
                        className="flex items-center space-x-1 text-xs h-7"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Official Site</span>
                      </Button>
                      
                      {application.status === 'accepted' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs h-7"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          <span>Offer Letter</span>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        <span>View Details</span>
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        ) : (
          <Card className="p-6 text-center">
            <div className="text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
              <p className="text-sm mb-4">Start your career journey by applying to government jobs!</p>
              <Button 
                onClick={() => window.location.href = '#jobs'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Jobs
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentApplicationsSection;
