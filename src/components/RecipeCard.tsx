
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Heart, HeartOff, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  className?: string;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

const RecipeCard = ({ recipe, onSelect, className, isSaved = false, onToggleSave }: RecipeCardProps) => {
  return (
    <Card 
      className={cn("recipe-card h-full flex flex-col group transition-all duration-300 hover:-translate-y-2", className)}
    >
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        {recipe.imageUrl ? (
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-culinary-yellow flex items-center justify-center">
            <Utensils className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        
        {onToggleSave && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full w-8 h-8 shadow-md transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
          >
            {isSaved ? (
              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            ) : (
              <Heart className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
      
      <CardContent 
        className="flex-grow flex flex-col p-4 cursor-pointer" 
        onClick={() => onSelect(recipe)}
      >
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
          className="w-full transition-colors hover:bg-primary/10"
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
