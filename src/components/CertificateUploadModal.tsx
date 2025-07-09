
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface CertificateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CertificateUploadModal = ({ isOpen, onClose }: CertificateUploadModalProps) => {
  const [certificateName, setCertificateName] = useState('');
  const [certificateType, setCertificateType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateName || !certificateType || !selectedFile) {
      toast({
        title: "Error",
        description: "Please fill all fields and select a file",
        variant: "destructive"
      });
      return;
    }

    // Simulate upload
    toast({
      title: "Certificate Uploaded",
      description: `${certificateName} has been uploaded successfully and is pending verification.`,
    });

    // Reset form
    setCertificateName('');
    setCertificateType('');
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Upload Certificate</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="certificate-name">Certificate Name</Label>
            <Input
              id="certificate-name"
              placeholder="e.g., 12th Grade Certificate"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="certificate-type">Certificate Type</Label>
            <Select value={certificateType} onValueChange={setCertificateType}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select certificate type" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="skill">Skill Certificate</SelectItem>
                <SelectItem value="experience">Experience Certificate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="certificate-file">Upload File</Label>
            <Input
              id="certificate-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
            />
            {selectedFile && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload Certificate
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateUploadModal;
