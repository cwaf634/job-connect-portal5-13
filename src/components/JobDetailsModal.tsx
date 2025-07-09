
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Calendar, Users, Building2, X } from 'lucide-react';

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onApplyClick?: (job: any) => void;
  isApplied?: boolean;
}

const JobDetailsModal = ({ isOpen, onClose, job, onApplyClick, isApplied }: JobDetailsModalProps) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">{job.title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <Badge className="bg-green-100 text-green-700 border border-green-300">{job.status}</Badge>
            <span className="text-gray-600 font-medium">{job.department}</span>
          </div>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Job Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-gray-600">{job.location}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-700">
                <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                <div>
                  <p className="font-medium">Salary</p>
                  <p className="text-sm text-gray-600">{job.salary}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-red-600" />
                <div>
                  <p className="font-medium">Last Date to Apply</p>
                  <p className="text-sm text-gray-600">{job.lastDate}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Users className="w-5 h-5 mr-3 text-purple-600" />
                <div>
                  <p className="font-medium">Applications</p>
                  <p className="text-sm text-gray-600">{job.applications} applications received</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Job Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          {/* Qualifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Qualifications</h3>
            <div className="flex flex-wrap gap-2">
              {job.qualifications?.map((qual, index) => (
                <Badge key={index} variant="outline" className="text-sm border-blue-300 text-blue-700 bg-blue-50">
                  {qual}
                </Badge>
              ))}
            </div>
          </div>

          {/* Department Info */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Department Information</h3>
            <p className="text-blue-800"><strong>Department:</strong> {job.department}</p>
            <p className="text-blue-800 mt-1"><strong>Job Type:</strong> Government Job</p>
            <p className="text-blue-800 mt-1"><strong>Employment Type:</strong> Full-time, Permanent</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            {isApplied ? (
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" disabled>
                ✓ Applied Successfully
              </Button>
            ) : onApplyClick ? (
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => onApplyClick(job)}
              >
                Apply Now
              </Button>
            ) : null}
            
            <Button 
              variant="outline" 
              className="px-8 border-gray-300"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
