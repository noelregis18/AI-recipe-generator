
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  className?: string;
}

const RecipeCard = ({ recipe, onSelect, className }: RecipeCardProps) => {
  return (
    <Card 
      className={cn("recipe-card h-full flex flex-col", className)}
      onClick={() => onSelect(recipe)}
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        {recipe.imageUrl ? (
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-culinary-yellow flex items-center justify-center">
            <Utensils className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
      </div>
      
      <CardContent className="flex-grow flex flex-col p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {recipe.description}
        </p>
        
        <div className="flex items-center mt-auto text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{recipe.cookTime}</span>
          <span className="mx-2">•</span>
          <span>{recipe.difficulty}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 px-4 pb-4">
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(recipe);
          }}
        >
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
