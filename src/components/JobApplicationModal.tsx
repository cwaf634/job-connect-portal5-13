import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X, Send, Upload, FileText, Store } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/contexts/ApplicationContext';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  onApplicationSuccess: (jobId: number, applicationData: any) => void;
}

const JobApplicationModal = ({ isOpen, onClose, job, onApplicationSuccess }: JobApplicationModalProps) => {
  const { user } = useAuth();
  const { getActiveShopkeepers, addApplication } = useApplications();
  const [selectedShopkeeper, setSelectedShopkeeper] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const { toast } = useToast();

  // Get active shopkeepers from the admin panel
  const activeShopkeepers = getActiveShopkeepers();

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedDocument(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedShopkeeper || !coverLetter || !user) {
      toast({
        title: "Error",
        description: "Please select a shopkeeper and provide a cover letter",
        variant: "destructive"
      });
      return;
    }

    // Find selected shopkeeper details
    const shopkeeperDetails = activeShopkeepers.find(s => 
      s.name === selectedShopkeeper || s.shopName === selectedShopkeeper
    );

    // Create application data
    const applicationData = {
      id: Date.now(),
      studentName: user.name,
      email: user.email,
      phone: user.profile?.phone || '+91 9876543210',
      jobTitle: job.title,
      department: job.department,
      location: job.location,
      salary: job.salary,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      govtLink: job.govtLink || 'https://example.gov.in',
      qualifications: job.qualifications || ['Graduate'],
      experience: experience || 'Fresh Graduate',
      hasDocument: !!selectedDocument,
      shopkeeper: shopkeeperDetails?.shopName || shopkeeperDetails?.name || selectedShopkeeper,
      coverLetter: coverLetter,
      documentName: selectedDocument?.name
    };

    // Add application to context
    addApplication(applicationData);

    // Show success message
    toast({
      title: "Application Submitted!",
      description: `Your application for ${job?.title} has been successfully submitted to ${shopkeeperDetails?.shopName || selectedShopkeeper}${selectedDocument ? ' with attached document' : ''}.`,
    });

    // Reset form
    setSelectedShopkeeper('');
    setCoverLetter('');
    setExperience('');
    setSelectedDocument(null);
    
    // Call success callback with application data
    if (job) {
      onApplicationSuccess(job.id, applicationData);
    }
    
    onClose();
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Apply for {job.title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900">{job.title}</h3>
          <p className="text-sm text-blue-700">{job.department}</p>
          <p className="text-sm text-blue-600">{job.location} • {job.salary}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="shopkeeper">Select Registered Shopkeeper</Label>
            <Select value={selectedShopkeeper} onValueChange={setSelectedShopkeeper}>
              <SelectTrigger className="bg-white border-2">
                <SelectValue placeholder="Choose a registered shopkeeper to apply through" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {activeShopkeepers.length > 0 ? (
                  activeShopkeepers.map((shopkeeper) => (
                    <SelectItem key={shopkeeper.id} value={shopkeeper.shopName || shopkeeper.name}>
                      <div className="flex items-center space-x-2">
                        <Store className="w-4 h-4 text-green-600" />
                        <div className="flex flex-col">
                          <span className="font-medium">{shopkeeper.shopName || shopkeeper.name}</span>
                          <span className="text-sm text-gray-500">
                            {shopkeeper.location} • {shopkeeper.totalApplications} applications processed
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-shopkeepers" disabled>
                    <span className="text-gray-500">No registered shopkeepers available</span>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {activeShopkeepers.length === 0 && (
              <p className="text-sm text-red-600 mt-2">
                No active shopkeepers are currently registered. Please contact the admin.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="experience">Relevant Experience</Label>
            <Input
              id="experience"
              placeholder="e.g., 2 years in retail, Fresh graduate, etc."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="document">Upload Supporting Document (Optional)</Label>
            <Input
              id="document"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleDocumentChange}
              className="cursor-pointer"
            />
            {selectedDocument && (
              <div className="flex items-center mt-2 p-2 bg-green-50 rounded border border-green-200">
                <FileText className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm text-green-700">{selectedDocument.name}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Write why you're interested in this position and why you're a good fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Note:</strong> Your application will be sent directly to the selected registered shopkeeper who will forward it to the hiring department. Only active shopkeepers from the admin panel are shown.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 border-2 border-blue-400"
            disabled={activeShopkeepers.length === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Application
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;
