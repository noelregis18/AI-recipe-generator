
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

    // Check image dimensions (this happens asynchronously)
    checkImageDimensions(file).then(isValid => {
      if (!isValid) {
        toast.warning('For best results, use a clear, well-lit photo of your ingredients');
      }
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Pass the file to the parent component
      onFileSelected(file);
      
      // Show success toast
      toast.success('Image uploaded successfully!');
    });
  };
  
  // Helper function to check image dimensions
  const checkImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const minDimension = 400; // Minimum width and height for good analysis
        const isValid = img.width >= minDimension && img.height >= minDimension;
        URL.revokeObjectURL(img.src); // Clean up
        resolve(isValid);
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageCaptured = (file: File) => {
    // Check image dimensions
    checkImageDimensions(file).then(isValid => {
      if (!isValid) {
        toast.warning('For best results, use a clear, well-lit photo of your ingredients');
      }
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Pass the file to the parent component
      onFileSelected(file);
    });
  };
  
  return {
    previewUrl,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    handleImageCaptured
  };
};
