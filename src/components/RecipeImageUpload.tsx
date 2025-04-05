
import React from 'react';
import ImageUpload from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RecipeImageUploadProps {
  selectedImage: File | null;
  isGenerating: boolean;
  onImageSelected: (file: File) => void;
  onGenerateRecipes: () => void;
}

const RecipeImageUpload = ({
  selectedImage,
  isGenerating,
  onImageSelected,
  onGenerateRecipes
}: RecipeImageUploadProps) => {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <ImageUpload 
        onImageSelected={onImageSelected} 
        isLoading={isGenerating}
      />
      
      {selectedImage && (
        <div className="mt-6 text-center">
          <Button 
            onClick={onGenerateRecipes} 
            disabled={isGenerating}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-500 transition-all shadow-md"
          >
            Generate Recipes
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecipeImageUpload;
