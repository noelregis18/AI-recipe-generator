
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Utensils } from "lucide-react";
import { Recipe } from './RecipeCard';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeDetail = ({ recipe, onBack }: RecipeDetailProps) => {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-2 -ml-2" 
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to recipes
        </Button>
        
        <div className="relative h-48 md:h-64 -mx-6 overflow-hidden">
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
          <div>
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
          
          <div>
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
