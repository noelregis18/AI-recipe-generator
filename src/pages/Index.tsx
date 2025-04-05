
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUpload from '@/components/ImageUpload';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetail from '@/components/RecipeDetail';
import ContactForm from '@/components/ContactForm';
import LoadingIndicator from '@/components/LoadingIndicator';
import { Button } from '@/components/ui/button';
import { analyzeImageAndGetRecipes } from '@/services/openaiService';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Recipe } from '@/types/recipe';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    // Reset any existing recipes when a new image is selected
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
  
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    // Scroll to the top when a recipe is selected
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBackToRecipes = () => {
    setSelectedRecipe(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container px-4 py-8">
        <section className="mb-16">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              AI Recipe Generator
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload a photo of your refrigerator ingredients, and let AI suggest delicious recipes you can make with them.
            </p>
          </div>
          
          {selectedRecipe ? (
            <RecipeDetail 
              recipe={selectedRecipe} 
              onBack={handleBackToRecipes} 
            />
          ) : (
            <div className="max-w-md mx-auto">
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
                    className="w-full"
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
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Recipe Suggestions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSelect={handleSelectRecipe}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
        
        <Separator className="my-16" />
        
        <section id="contact" className="py-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Get in Touch
          </h2>
          <ContactForm />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
