
import React from 'react';
import { ImageIcon } from "lucide-react";

interface DropZoneProps {
  onClick: () => void;
}

const DropZone = ({ onClick }: DropZoneProps) => {
  return (
    <div 
      className="file-input-label"
      onClick={onClick}
    >
      <ImageIcon className="h-10 w-10 text-muted-foreground" />
      <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
        <span className="file-input-text">
          Drag and drop an image, or click to select
        </span>
      </div>
    </div>
  );
};

export default DropZone;
