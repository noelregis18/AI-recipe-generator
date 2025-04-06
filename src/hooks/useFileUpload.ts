
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
    checkImageDimensions(file).then(result => {
      const { isValid, width, height } = result;
      
      if (!isValid) {
        toast.warning(`For best results, use a clear, high-resolution photo (current: ${width}x${height}px)`);
      }
      
      // Process image if possible (reduce size if too large)
      processImage(file).then(processedFile => {
        // Create a preview URL
        const objectUrl = URL.createObjectURL(processedFile);
        setPreviewUrl(objectUrl);
        
        // Pass the file to the parent component
        onFileSelected(processedFile);
        
        // Show success toast
        toast.success('Image uploaded successfully!');
      }).catch(error => {
        console.error('Error processing image:', error);
        
        // Fallback to original file
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        onFileSelected(file);
        
        toast.success('Image uploaded successfully!');
      });
    });
  };
  
  // Helper function to check image dimensions
  const checkImageDimensions = (file: File): Promise<{ isValid: boolean, width: number, height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const minDimension = 400; // Minimum width and height for good analysis
        const isValid = img.width >= minDimension && img.height >= minDimension;
        const result = {
          isValid,
          width: img.width,
          height: img.height
        };
        URL.revokeObjectURL(img.src); // Clean up
        resolve(result);
      };
      img.onerror = () => resolve({ isValid: false, width: 0, height: 0 });
      img.src = URL.createObjectURL(file);
    });
  };

  // Process the image to ensure it's not too large but still good quality
  const processImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Only process if image is very large
        if (img.width <= 2048 && img.height <= 2048) {
          URL.revokeObjectURL(img.src);
          resolve(file); // Return original if it's not too large
          return;
        }

        // Scale down very large images to max 2048px (maintains aspect ratio)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(img.src);
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate new dimensions
        let newWidth = img.width;
        let newHeight = img.height;
        const maxDimension = 2048;

        if (newWidth > maxDimension || newHeight > maxDimension) {
          if (newWidth > newHeight) {
            newHeight = Math.round((newHeight * maxDimension) / newWidth);
            newWidth = maxDimension;
          } else {
            newWidth = Math.round((newWidth * maxDimension) / newHeight);
            newHeight = maxDimension;
          }
        }

        // Set canvas dimensions and draw image
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to blob with good quality
        canvas.toBlob((blob) => {
          if (!blob) {
            URL.revokeObjectURL(img.src);
            reject(new Error('Failed to create blob from canvas'));
            return;
          }
          
          // Create a new file from the blob
          const processedFile = new File([blob], file.name, { 
            type: 'image/jpeg', 
            lastModified: Date.now() 
          });
          
          URL.revokeObjectURL(img.src);
          resolve(processedFile);
        }, 'image/jpeg', 0.9); // High quality JPEG
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image for processing'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageCaptured = (file: File) => {
    // Check image dimensions
    checkImageDimensions(file).then(result => {
      const { isValid } = result;
      
      if (!isValid) {
        toast.warning('For best results, use a clear, well-lit photo of your ingredients');
      }

      // Process the image if needed
      processImage(file).then(processedFile => {
        // Create a preview URL
        const objectUrl = URL.createObjectURL(processedFile);
        setPreviewUrl(objectUrl);
        
        // Pass the file to the parent component
        onFileSelected(processedFile);
      }).catch(error => {
        console.error('Error processing captured image:', error);
        
        // Fallback to original
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        onFileSelected(file);
      });
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
