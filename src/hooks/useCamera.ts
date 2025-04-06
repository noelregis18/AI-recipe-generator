
import { useState } from 'react';
import { toast } from 'sonner';

export const useCamera = (onImageCaptured: (file: File) => void) => {
  const [isCapturing, setIsCapturing] = useState(false);
  
  const takePicture = async () => {
    if (isCapturing) return;
    
    try {
      setIsCapturing(true);
      
      // Check if the browser supports mediaDevices API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Your browser does not support camera access');
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer rear camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Create video element
      const video = document.createElement('video');
      video.srcObject = stream;
      
      // Wait for video to be loaded
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve(null);
        };
      });
      
      // Show toast to indicate we're taking the photo
      toast.loading('Taking photo...');
      
      // Wait a small delay to allow camera to adjust
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create canvas and draw the video frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a File object from the Blob
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            
            // Pass the file to the parent component
            onImageCaptured(file);
            
            // Show success toast
            toast.success('Photo captured successfully!');
          } else {
            toast.error('Failed to capture photo');
          }
          
          // Stop all video streams
          stream.getTracks().forEach(track => track.stop());
          setIsCapturing(false);
        }, 'image/jpeg', 0.95); // High quality JPEG
      } else {
        toast.error('Failed to capture photo');
        setIsCapturing(false);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
      setIsCapturing(false);
    }
  };
  
  return { takePicture, isCapturing };
};
