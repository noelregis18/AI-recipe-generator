
import React from 'react';
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  previewUrl: string;
  onChangeImage: () => void;
}

const ImagePreview = ({ previewUrl, onChangeImage }: ImagePreviewProps) => {
  return (
    <div className="relative mt-2 rounded-lg overflow-hidden">
      <img 
        src={previewUrl} 
        alt="Uploaded image" 
        className="w-full h-64 object-cover rounded-lg"
      />
      <Button 
        variant="outline" 
        size="sm"
        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
        onClick={onChangeImage}
      >
        Change
      </Button>
    </div>
  );
};

export default ImagePreview;
