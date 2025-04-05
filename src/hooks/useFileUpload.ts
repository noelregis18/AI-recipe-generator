
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export const useFileUpload = (onFileSelected: (file: File) => void) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Pass the file to the parent component
    onFileSelected(file);
    
    // Show success toast
    toast.success('Image uploaded successfully!');
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageCaptured = (file: File) => {
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Pass the file to the parent component
    onFileSelected(file);
  };
  
  return {
    previewUrl,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    handleImageCaptured
  };
};
