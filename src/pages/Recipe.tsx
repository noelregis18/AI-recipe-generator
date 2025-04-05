
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecipeDetail from '@/components/RecipeDetail';
import LoadingIndicator from '@/components/LoadingIndicator';
import RecipeImageUpload from '@/components/RecipeImageUpload';
import RecipeList from '@/components/RecipeList';
import RecipeError from '@/components/RecipeError';
import { useRecipeManagement } from '@/hooks/useRecipeManagement';

const Recipe = () => {
  const {
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
  } = useRecipeManagement();
  
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
              <RecipeImageUpload
                selectedImage={selectedImage}
                isGenerating={isGenerating}
                onImageSelected={handleImageSelected}
                onGenerateRecipes={handleGenerateRecipes}
              />
            )}
            
            {isGenerating && (
              <div className="mt-10">
                <LoadingIndicator message="Analyzing ingredients and generating recipe ideas..." />
              </div>
            )}

            {error && !isGenerating && (
              <RecipeError 
                errorMessage={error} 
                onReset={resetError}
              />
            )}
            
            {!isGenerating && recipes.length > 0 && !selectedRecipe && (
              <RecipeList
                recipes={recipes}
                savedRecipes={savedRecipes}
                onSelectRecipe={handleSelectRecipe}
                onToggleSave={handleSaveRecipe}
              />
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipe;
