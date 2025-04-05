
import React from 'react';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/types/recipe';

interface RecipeListProps {
  recipes: Recipe[];
  savedRecipes: string[];
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleSave: (recipeId: string) => void;
}

const RecipeList = ({ 
  recipes, 
  savedRecipes, 
  onSelectRecipe, 
  onToggleSave 
}: RecipeListProps) => {
  if (!recipes.length) return null;
  
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-8 text-center">
        Recipe Suggestions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onSelect={onSelectRecipe}
            isSaved={savedRecipes.includes(recipe.id)}
            onToggleSave={() => onToggleSave(recipe.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
