
import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { analyzeImageAndGetRecipes } from '@/services/openaiService';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define a type for the data structure we expect from the saved_recipes table
interface SavedRecipeRow {
  recipe_data: Recipe;
  recipe_id: string;
  id: string;
  user_id: string;
  created_at: string;
}

export const useRecipeManagement = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchSavedRecipes();
  }, [user]);
  
  const fetchSavedRecipes = async () => {
    if (!user) return;
    
    try {
      // Use explicit type casting to handle the fact that saved_recipes isn't in the type definition
      const { data, error } = await supabase
        .from('saved_recipes' as any)
        .select('recipe_id')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Type assertion to tell TypeScript that data is an array with recipe_id
      const typedData = data as unknown as Pick<SavedRecipeRow, 'recipe_id'>[];
      const savedIds = typedData.map(item => item.recipe_id);
      setSavedRecipes(savedIds);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
    }
  };
  
  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setRecipes([]);
    setSelectedRecipe(null);
    setError(null);
  };
  
  const handleGenerateRecipes = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    try {
      setIsGenerating(true);
      setError(null);
      const generatedRecipes = await analyzeImageAndGetRecipes(selectedImage);
      
      if (generatedRecipes.length === 0) {
        setError('No recipes could be generated. Please try with a different image.');
        toast.error('Failed to generate recipes');
      } else {
        setRecipes(generatedRecipes);
        if (generatedRecipes[0].title.includes('Error') || generatedRecipes[0].title.includes('Failed')) {
          toast.warning('We had some trouble analyzing your image. Try taking a clearer photo.');
        } else {
          toast.success('Recipes generated successfully!');
        }
      }
    } catch (error) {
      console.error('Error generating recipes:', error);
      setError('An error occurred while generating recipes. Please try again.');
      toast.error('Failed to generate recipes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBackToRecipes = () => {
    setSelectedRecipe(null);
  };
  
  const handleSaveRecipe = async (recipeId: string) => {
    if (!user) {
      toast.error('Please sign in to save recipes');
      return;
    }
    
    try {
      // Check if recipe is already saved
      const isSaved = savedRecipes.includes(recipeId);
      
      if (isSaved) {
        // Unsave recipe - use type assertion to handle the missing types
        const { error } = await supabase
          .from('saved_recipes' as any)
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
          
        if (error) throw error;
        
        setSavedRecipes(savedRecipes.filter(id => id !== recipeId));
        toast.success('Recipe removed from saved items');
      } else {
        // Save recipe - use type assertion for the table name
        const recipeToSave = recipes.find(r => r.id === recipeId);
        if (!recipeToSave) return;
        
        const { error } = await supabase
          .from('saved_recipes' as any)
          .insert({ 
            user_id: user.id, 
            recipe_id: recipeId, 
            recipe_data: recipeToSave 
          } as any);
          
        if (error) throw error;
        
        setSavedRecipes([...savedRecipes, recipeId]);
        toast.success('Recipe saved successfully');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Failed to save recipe');
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    selectedImage,
    isGenerating,
    recipes,
    selectedRecipe,
    savedRecipes,
    error,
    handleImageSelected,
    handleGenerateRecipes,
    handleSelectRecipe,
    handleBackToRecipes,
    handleSaveRecipe,
    resetError
  };
};
