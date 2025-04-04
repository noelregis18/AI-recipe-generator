
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

const ImageUpload = ({ onImageSelected, isLoading }: ImageUploadProps) => {
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
    onImageSelected(file);
    
    // Show success toast
    toast.success('Image uploaded successfully!');
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const takePicture = async () => {
    try {
      // Check if the browser supports mediaDevices API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Your browser does not support camera access');
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Create video and canvas elements
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame on the canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              // Create a File object from the Blob
              const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
              
              // Create a preview URL
              const objectUrl = URL.createObjectURL(blob);
              setPreviewUrl(objectUrl);
              
              // Pass the file to the parent component
              onImageSelected(file);
              
              // Show success toast
              toast.success('Photo captured successfully!');
            }
          }, 'image/jpeg');
        }
        
        // Stop all video streams
        stream.getTracks().forEach(track => track.stop());
      }, 300);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {!previewUrl ? (
        <div 
          className="file-input-label"
          onClick={triggerFileInput}
        >
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
          <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
            <span className="file-input-text">
              Drag and drop an image, or click to select
            </span>
          </div>
        </div>
      ) : (
        <div className="relative mt-2 rounded-lg overflow-hidden">
          <img 
            src={previewUrl} 
            alt="Uploaded food items" 
            className="w-full h-64 object-cover rounded-lg"
          />
          <Button 
            variant="outline" 
            size="sm"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
            onClick={triggerFileInput}
          >
            Change
          </Button>
        </div>
      )}
      
      <div className="flex justify-center gap-4 mt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={takePicture}
          disabled={isLoading}
        >
          <Camera className="mr-2 h-4 w-4" />
          Take Photo
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={triggerFileInput}
          disabled={isLoading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
