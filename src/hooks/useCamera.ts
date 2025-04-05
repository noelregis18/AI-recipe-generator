
import { useState } from 'react';
import { toast } from 'sonner';

export const useCamera = (onImageCaptured: (file: File) => void) => {
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
              
              // Pass the file to the parent component
              onImageCaptured(file);
              
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
  
  return { takePicture };
};
