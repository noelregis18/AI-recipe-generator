
import { Recipe } from '@/types/recipe';
import { supabase } from '@/integrations/supabase/client';

// Function to analyze the image and get recipes using Supabase Edge Function
export const analyzeImageAndGetRecipes = async (image: File): Promise<Recipe[]> => {
  try {
    // Convert image to base64
    const reader = new FileReader();
    const imageBase64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
    });
    reader.readAsDataURL(image);
    const imageBase64 = await imageBase64Promise;
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-image', {
      body: { imageBase64 }
    });
    
    if (error) {
      console.error('Error calling analyze-image function:', error);
      throw new Error('Failed to analyze image');
    }
    
    // Map the API response to our Recipe type
    if (data && data.recipes && Array.isArray(data.recipes)) {
      return data.recipes.map((recipe: any, index: number) => ({
        id: recipe.id || `recipe-${index + 1}`,
        title: recipe.title,
        description: recipe.description || '',
        cookTime: recipe.cookTime || recipe.cook_time || '30 minutes',
        difficulty: recipe.difficulty || 'Medium',
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        imageUrl: recipe.imageUrl || recipe.image_url || getFallbackImageUrl(index)
      }));
    }
    
    // Fallback in case of unexpected API response format
    return getFallbackRecipes();
  } catch (error) {
    console.error('Error in analyzeImageAndGetRecipes:', error);
    // Return fallback recipes in case of error
    return getFallbackRecipes();
  }
};

// Helper function to get a fallback image URL
const getFallbackImageUrl = (index: number): string => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71'
  ];
  return fallbackImages[index % fallbackImages.length];
};

// Fallback recipes in case API call fails
const getFallbackRecipes = (): Recipe[] => {
  return [
    {
      id: 'recipe-fallback-1',
      title: 'Failed to Generate Recipe',
      description: 'We encountered an issue analyzing your image. Please try again with a clearer image of ingredients.',
      cookTime: 'N/A',
      difficulty: 'N/A',
      ingredients: [
        'Please try again with a different image',
        'Make sure your image clearly shows food ingredients'
      ],
      instructions: [
        'Try taking the photo in better lighting',
        'Ensure ingredients are clearly visible',
        'You can also try uploading a different image'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
    }
  ];
};
