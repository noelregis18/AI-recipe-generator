
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetail from '@/components/RecipeDetail';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import type { Recipe as RecipeType } from '@/types/recipe';
import { Separator } from '@/components/ui/separator';
import LoadingIndicator from '@/components/LoadingIndicator';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState<RecipeType[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('saved_recipes')
          .select('recipe_data')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setSavedRecipes(data.map(item => item.recipe_data as RecipeType));
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
        toast.error('Failed to fetch saved recipes');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedRecipes();
  }, [user]);
  
  const handleSelectRecipe = (recipe: RecipeType) => {
    setSelectedRecipe(recipe);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBackToRecipes = () => {
    setSelectedRecipe(null);
  };
  
  const handleUnsaveRecipe = async (recipeId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);
        
      if (error) throw error;
      
      setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== recipeId));
      
      if (selectedRecipe && selectedRecipe.id === recipeId) {
        setSelectedRecipe(null);
      }
      
      toast.success('Recipe removed from saved items');
    } catch (error) {
      console.error('Error removing recipe:', error);
      toast.error('Failed to remove recipe');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-culinary-yellow/30 to-white">
      <Header />
      
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 fill-red-500 text-red-500" /> 
              Saved Recipes
            </h1>
            <Separator className="max-w-md mx-auto my-4" />
            <p className="text-lg text-muted-foreground">
              Your collection of favorite recipes
            </p>
          </div>
          
          {isLoading ? (
            <LoadingIndicator message="Loading your saved recipes..." />
          ) : selectedRecipe ? (
            <RecipeDetail 
              recipe={selectedRecipe} 
              onBack={handleBackToRecipes} 
              isSaved={true}
              onToggleSave={() => handleUnsaveRecipe(selectedRecipe.id)}
            />
          ) : savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={handleSelectRecipe}
                  isSaved={true}
                  onToggleSave={() => handleUnsaveRecipe(recipe.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No saved recipes yet</h3>
                <p className="text-muted-foreground">
                  When you find recipes you love, save them by clicking the heart icon
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SavedRecipes;
