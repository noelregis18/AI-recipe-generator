
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
        setIsCapturing(false);
        return;
      }
      
      // Request access to the camera with high resolution
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer rear camera on mobile
          width: { ideal: 1920 },    // Higher resolution
          height: { ideal: 1080 },   // Higher resolution
          frameRate: { max: 30 }     // Good frame rate
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
      
      // Wait a bit longer to allow camera to adjust focus and exposure
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create canvas and draw the video frame at high quality
      const canvas = document.createElement('canvas');
      // Use actual video dimensions for better quality
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0);
        
        // Convert canvas to blob with high quality
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a File object from the Blob with high quality
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { 
              type: 'image/jpeg' 
            });
            
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
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      
      // More user-friendly error messages
      if (error.name === 'NotAllowedError') {
        toast.error('Camera access denied. Please check your permissions.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera detected on your device.');
      } else if (error.name === 'NotReadableError') {
        toast.error('Camera is already in use by another application.');
      } else {
        toast.error('Failed to access camera: ' + (error.message || 'Unknown error'));
      }
      
      setIsCapturing(false);
    }
  };
  
  return { takePicture, isCapturing };
};
