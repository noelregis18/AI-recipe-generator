
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Heart, Utensils } from "lucide-react";
import type { Recipe } from '@/types/recipe';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

const RecipeDetail = ({ recipe, onBack, isSaved = false, onToggleSave }: RecipeDetailProps) => {
  return (
    <Card className="w-full mx-auto overflow-hidden shadow-lg border-gray-100">
      <CardHeader className="pb-0 relative">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-2 -ml-2" 
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to recipes
        </Button>
        
        <div className="relative h-48 sm:h-64 md:h-80 -mx-6 overflow-hidden">
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
          
          {onToggleSave && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleSave}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-md transition-all flex items-center gap-2"
            >
              {isSaved ? (
                <>
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4" />
                  <span>Save Recipe</span>
                </>
              )}
            </Button>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-culinary-yellow/30">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {recipe.cookTime}
          </Badge>
          <Badge variant="outline" className="bg-culinary-green/30">
            {recipe.difficulty}
          </Badge>
        </div>
        
        <CardTitle className="mt-3 text-xl md:text-2xl">{recipe.title}</CardTitle>
        <p className="text-muted-foreground mt-2">{recipe.description}</p>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-culinary-peach/10 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
            <Separator className="mb-4" />
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-culinary-green/10 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Instructions</h3>
            <Separator className="mb-4" />
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex">
                  <span className="font-medium text-primary mr-2">{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeDetail;
