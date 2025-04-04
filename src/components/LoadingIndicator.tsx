
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator = ({ message = 'Loading...' }: LoadingIndicatorProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground animate-pulse-slow">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
