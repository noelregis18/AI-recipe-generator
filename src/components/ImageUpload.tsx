
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useFileUpload } from '@/hooks/useFileUpload';
import { useCamera } from '@/hooks/useCamera';
import DropZone from '@/components/DropZone';
import ImagePreview from '@/components/ImagePreview';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

const ImageUpload = ({ onImageSelected, isLoading }: ImageUploadProps) => {
  const {
    previewUrl,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    handleImageCaptured
  } = useFileUpload(onImageSelected);
  
  const { takePicture } = useCamera(handleImageCaptured);
  
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
        <DropZone onClick={triggerFileInput} />
      ) : (
        <ImagePreview 
          previewUrl={previewUrl} 
          onChangeImage={triggerFileInput} 
        />
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
