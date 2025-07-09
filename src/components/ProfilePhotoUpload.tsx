
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  userName: string;
  onPhotoChange: (photoUrl: string) => void;
  disabled?: boolean;
}

const ProfilePhotoUpload = ({ currentPhoto, userName, onPhotoChange, disabled }: ProfilePhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Create object URL for preview (in a real app, you'd upload to a server)
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setTimeout(() => {
        onPhotoChange(result);
        setIsUploading(false);
        toast({
          title: "Photo Updated",
          description: "Your profile photo has been updated successfully.",
        });
      }, 1000); // Simulate upload delay
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24 border-4 border-gray-200">
          <AvatarImage src={currentPhoto} alt={userName} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
            {userName?.charAt(0)?.toUpperCase() || <User className="w-8 h-8" />}
          </AvatarFallback>
        </Avatar>
        
        {!disabled && (
          <Button
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-600 hover:bg-blue-700"
            onClick={triggerFileSelect}
            disabled={isUploading}
          >
            <Camera className="w-4 h-4" />
          </Button>
        )}
      </div>

      {!disabled && (
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePhotoUpload;
