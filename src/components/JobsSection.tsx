
import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Calendar, Users, CheckCircle, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import JobApplicationModal from './JobApplicationModal';
import JobDetailsModal from './JobDetailsModal';

interface JobsSectionProps {
  onJobApplied?: (job: any) => void;
}

const JobsSection = ({ onJobApplied }: JobsSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Junior Clerk',
      department: 'State Administrative Department',
      location: 'New Delhi, Delhi',
      salary: '₹25,000 - ₹35,000',
      lastDate: '8/15/2025',
      applications: 145,
      status: 'active',
      qualifications: ['12th Pass', 'Computer Basic Knowledge'],
      description: 'Junior Clerk position for handling administrative work, data entry, and file management.',
      isActive: true
    },
    {
      id: 2,
      title: 'Police Constable',
      department: 'Delhi Police',
      location: 'Delhi, Delhi',
      salary: '₹35,000 - ₹45,000',
      lastDate: '8/20/2025',
      applications: 890,
      status: 'active',
      qualifications: ['12th Pass', 'Physical Fitness Certificate'],
      description: 'Police Constable recruitment for maintaining law and order in Delhi.',
      isActive: true
    },
    {
      id: 3,
      title: 'Teacher (Primary)',
      department: 'Education Department',
      location: 'Mumbai, Maharashtra',
      salary: '₹30,000 - ₹50,000',
      lastDate: '8/25/2025',
      applications: 234,
      status: 'active',
      qualifications: ['B.Ed', 'Graduation', '+1 more'],
      description: 'Primary school teacher position for classes 1-5 in government schools.',
      isActive: true
    },
    {
      id: 4,
      title: 'Staff Nurse',
      department: 'Health Department',
      location: 'Bangalore, Karnataka',
      salary: '₹28,000 - ₹42,000',
      lastDate: '8/30/2025',
      applications: 156,
      status: 'active',
      qualifications: ['GNM/BSc Nursing', 'Registration Certificate'],
      description: 'Staff Nurse position in government hospitals and healthcare centers.',
      isActive: true
    },
    {
      id: 5,
      title: 'Data Entry Operator',
      department: 'IT Department',
      location: 'Pune, Maharashtra',
      salary: '₹20,000 - ₹30,000',
      lastDate: '9/5/2025',
      applications: 67,
      status: 'active',
      qualifications: ['12th Pass', 'Computer Knowledge', 'Typing Speed 30 WPM'],
      description: 'Data entry and database management in government IT projects.',
      isActive: true
    },
    {
      id: 6,
      title: 'Forest Guard',
      department: 'Forest Department',
      location: 'Bhubaneswar, Odisha',
      salary: '₹22,000 - ₹32,000',
      lastDate: '9/10/2025',
      applications: 298,
      status: 'active',
      qualifications: ['10th Pass', 'Physical Fitness', 'Local Language'],
      description: 'Forest protection and wildlife conservation duties.',
      isActive: true
    },
    {
      id: 7,
      title: 'Junior Engineer',
      department: 'Public Works Department',
      location: 'Chennai, Tamil Nadu',
      salary: '₹40,000 - ₹60,000',
      lastDate: '9/15/2025',
      applications: 423,
      status: 'active',
      qualifications: ['B.Tech/Diploma', 'Civil Engineering', '2+ Years Experience'],
      description: 'Infrastructure development and maintenance projects.',
      isActive: true
    },
    {
      id: 8,
      title: 'Pharmacist',
      department: 'Health Department',
      location: 'Jaipur, Rajasthan',
      salary: '₹25,000 - ₹40,000',
      lastDate: '9/20/2025',
      applications: 189,
      status: 'active',
      qualifications: ['B.Pharm/D.Pharm', 'Registration Certificate'],
      description: 'Medicine dispensing and pharmaceutical services in government hospitals.',
      isActive: true
    },
    {
      id: 9,
      title: 'Office Assistant',
      department: 'Municipal Corporation',
      location: 'Ahmedabad, Gujarat',
      salary: '₹18,000 - ₹28,000',
      lastDate: '9/25/2025',
      applications: 312,
      status: 'active',
      qualifications: ['10th Pass', 'Basic Computer Knowledge'],
      description: 'Administrative support and office management duties.',
      isActive: true
    },
    {
      id: 10,
      title: 'Lab Technician',
      department: 'Health Department',
      location: 'Kolkata, West Bengal',
      salary: '₹22,000 - ₹35,000',
      lastDate: '9/30/2025',
      applications: 156,
      status: 'active',
      qualifications: ['Diploma/BSc', 'Lab Experience'],
      description: 'Medical laboratory testing and equipment maintenance.',
      isActive: true
    }
  ]);

  const states = [
    'All States', 'Delhi', 'Maharashtra', 'Karnataka', 'Uttar Pradesh', 
    'West Bengal', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Punjab', 'Odisha'
  ];

  // Filter jobs to show only active jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'all' || 
                        job.location.toLowerCase().includes(selectedState.toLowerCase());
    return matchesSearch && matchesState && job.isActive;
  });

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsApplicationModalOpen(true);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleApplicationSuccess = (jobId, applicationData) => {
    // Mark job as applied and deactivate it
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, isActive: false }
        : job
    ));
    
    setAppliedJobs(new Set([...appliedJobs, jobId]));
    
    if (onJobApplied) {
      onJobApplied(applicationData);
    }
    setIsApplicationModalOpen(false);
  };

  const getAvailableJobsCount = () => {
    return jobs.filter(job => job.isActive).length;
  };

  return (
    <div className="space-y-6">
      {/* Header with Available Jobs Count */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
          <p className="text-gray-600">{getAvailableJobsCount()} jobs available for application</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <span className="text-blue-900 font-medium">{getAvailableJobsCount()} Available</span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-2"
          />
        </div>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-full sm:w-48 border-2 bg-white">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="all">All States</SelectItem>
            {states.slice(1).map((state) => (
              <SelectItem key={state} value={state.toLowerCase()}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card 
              key={job.id} 
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-blue-300 cursor-pointer"
              onClick={() => handleJobClick(job)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <Badge className="bg-green-100 text-green-700 border border-green-300">
                    {job.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 font-medium">{job.department}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Last Date: {job.lastDate}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {job.applications} applications
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Required Qualifications:</p>
                  <div className="flex flex-wrap gap-1">
                    {job.qualifications.map((qual, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-gray-300">
                        {qual}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                <Button 
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white border-2 border-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyClick(job);
                  }}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Available Jobs</h3>
            <p className="text-sm">All jobs have been applied for or no jobs match your search criteria.</p>
          </div>
        </Card>
      )}

      <JobApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        job={selectedJob}
        onApplicationSuccess={handleApplicationSuccess}
      />

      <JobDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        job={selectedJob}
        onApplyClick={handleApplyClick}
        isApplied={false}
      />
    </div>
  );
};

export default JobsSection;
