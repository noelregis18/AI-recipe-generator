
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Recipe as RecipeType } from '@/types/recipe';
import RecipeDetail from '@/components/RecipeDetail';
import ImageUpload from '@/components/ImageUpload';
import LoadingIndicator from '@/components/LoadingIndicator';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import RecipeCard from '@/components/RecipeCard';
import { analyzeImageAndGetRecipes } from '@/services/openaiService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

const Recipe = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeType | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('saved_recipes')
          .select('recipe_id')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        const savedIds = data.map(item => item.recipe_id);
        setSavedRecipes(savedIds);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      }
    };
    
    fetchSavedRecipes();
  }, [user]);
  
  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setRecipes([]);
    setSelectedRecipe(null);
  };
  
  const handleGenerateRecipes = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    try {
      setIsGenerating(true);
      const generatedRecipes = await analyzeImageAndGetRecipes(selectedImage);
      setRecipes(generatedRecipes);
    } catch (error) {
      console.error('Error generating recipes:', error);
      toast.error('Failed to generate recipes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSelectRecipe = (recipe: RecipeType) => {
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
        // Unsave recipe
        const { error } = await supabase
          .from('saved_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
          
        if (error) throw error;
        
        setSavedRecipes(savedRecipes.filter(id => id !== recipeId));
        toast.success('Recipe removed from saved items');
      } else {
        // Save recipe
        const recipeToSave = recipes.find(r => r.id === recipeId);
        if (!recipeToSave) return;
        
        const { error } = await supabase
          .from('saved_recipes')
          .insert({ 
            user_id: user.id, 
            recipe_id: recipeId, 
            recipe_data: recipeToSave 
          });
          
        if (error) throw error;
        
        setSavedRecipes([...savedRecipes, recipeId]);
        toast.success('Recipe saved successfully');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Failed to save recipe');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-culinary-peach/30 to-white">
      <Header />
      
      <main className="flex-grow container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <section className="mb-16">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
                AI Recipe Generator
              </h1>
              <p className="text-lg text-muted-foreground px-4">
                Upload a photo of your refrigerator ingredients, and let AI suggest delicious recipes you can make with them.
              </p>
            </div>
            
            {selectedRecipe ? (
              <RecipeDetail 
                recipe={selectedRecipe} 
                onBack={handleBackToRecipes} 
                isSaved={savedRecipes.includes(selectedRecipe.id)}
                onToggleSave={() => handleSaveRecipe(selectedRecipe.id)}
              />
            ) : (
              <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <ImageUpload 
                  onImageSelected={handleImageSelected} 
                  isLoading={isGenerating}
                />
                
                {selectedImage && (
                  <div className="mt-6 text-center">
                    <Button 
                      onClick={handleGenerateRecipes} 
                      disabled={isGenerating}
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-500 transition-all shadow-md"
                    >
                      Generate Recipes
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {isGenerating && (
              <div className="mt-10">
                <LoadingIndicator message="Analyzing ingredients and generating recipe ideas..." />
              </div>
            )}
            
            {!isGenerating && recipes.length > 0 && !selectedRecipe && (
              <div className="mt-16">
                <h2 className="text-2xl font-semibold mb-8 text-center">
                  Recipe Suggestions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onSelect={handleSelectRecipe}
                      isSaved={savedRecipes.includes(recipe.id)}
                      onToggleSave={() => handleSaveRecipe(recipe.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipe;
