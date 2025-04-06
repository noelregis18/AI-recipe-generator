
import React from 'react';
import { ImageIcon } from "lucide-react";

interface DropZoneProps {
  onClick: () => void;
}

const DropZone = ({ onClick }: DropZoneProps) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-primary');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    // The onClick handler will be triggered by the parent component
    // This just makes sure the visual effect is correct
  };
  
  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ImageIcon className="h-10 w-10 text-muted-foreground" />
      <div className="mt-4 flex flex-col text-sm leading-6 text-muted-foreground">
        <span className="font-medium mb-1">
          Drag and drop an image, or click to select
        </span>
        <span className="text-xs text-muted-foreground/80 mb-2">
          Take a clear photo of your food ingredients for best results
        </span>
        <ul className="text-xs text-left list-disc pl-5 mt-2 text-muted-foreground/70">
          <li>Use good lighting</li>
          <li>Place ingredients on a clean surface</li>
          <li>Separate ingredients so they're visible</li>
          <li>Use high resolution photos</li>
        </ul>
      </div>
    </div>
  );
};

export default DropZone;
