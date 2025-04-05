
import React from 'react';
import { Button } from '@/components/ui/button';

interface RecipeErrorProps {
  errorMessage: string;
  onReset: () => void;
}

const RecipeError = ({ errorMessage, onReset }: RecipeErrorProps) => {
  return (
    <div className="mt-8 p-4 text-center bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600">{errorMessage}</p>
      <Button 
        variant="outline"
        className="mt-2"
        onClick={onReset}
      >
        Try Again
      </Button>
    </div>
  );
};

export default RecipeError;
