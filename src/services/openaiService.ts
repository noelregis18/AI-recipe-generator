
import { Recipe } from '@/types/recipe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to analyze the image and get recipes using Supabase Edge Function
export const analyzeImageAndGetRecipes = async (image: File): Promise<Recipe[]> => {
  try {
    // Show loading toast
    const loadingToast = toast.loading('Analyzing your ingredients...');
    
    // Convert image to base64
    const reader = new FileReader();
    const imageBase64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(new Error('Failed to read image file'));
      };
    });
    reader.readAsDataURL(image);
    const imageBase64 = await imageBase64Promise;
    
    // Call the Supabase Edge Function with additional logging
    console.log('Calling analyze-image function...');
    const { data, error } = await supabase.functions.invoke('analyze-image', {
      body: { imageBase64 }
    });
    
    // Dismiss loading toast
    toast.dismiss(loadingToast);
    
    if (error) {
      console.error('Error calling analyze-image function:', error);
      toast.error('Failed to analyze image: ' + (error.message || 'Unknown error'));
      return getFallbackRecipes('Service Error: ' + error.message);
    }
    
    console.log('AI Response Data:', data);
    
    // Check which API was used and show appropriate toast
    if (data.apiUsed === "Demo") {
      toast.warning('Using demo recipes - API unavailable. These are example recipes, not based on your image.');
    } else if (data.apiUsed === "DeepSeek") {
      toast.success(`Analysis completed using DeepSeek AI!`);
    } else if (data.apiUsed === "OpenAI") {
      toast.success(`Analysis completed using OpenAI!`);
    }
    
    // Check if there's a notice about demo recipes being used due to API limits
    if (data.notice) {
      console.warn('API Notice:', data.notice);
      toast.warning(data.notice);
    }
    
    // Check if there's an error message in the response
    if (data.error) {
      console.error('Error from analyze-image function:', data.error);
      
      if (data.error.includes('API rate limit') || data.error.includes('quota exceeded') || data.error.includes('authentication error')) {
        toast.warning('API limit reached or authentication error. Using alternative AI service or demo recipes.');
      } else {
        toast.error(data.error || 'Error analyzing image');
      }
      
      if (data.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
        return mapRecipes(data.recipes);
      }
      
      return getFallbackRecipes('Processing Error: ' + data.error);
    }
    
    // Map the API response to our Recipe type
    if (data && data.recipes && Array.isArray(data.recipes)) {
      if (data.recipes.length === 0) {
        toast.error('No recipes found. Try a clearer image of your ingredients.');
        return getFallbackRecipes('No Recipes Found');
      }
      
      // Check if first recipe is an error recipe
      if (data.recipes[0].title?.includes('Error') || data.recipes[0].title?.includes('Could Not Process')) {
        toast.warning('We had trouble identifying ingredients. Try a clearer photo.');
      } else if (data.notice) {
        // If we're using demo recipes, show a different message
        toast.success(`Showing ${data.recipes.length} demo recipes (API limit reached)`);
      } else {
        const apiName = data.apiUsed || "AI";
        toast.success(`Found ${data.recipes.length} recipes for your ingredients using ${apiName}!`);
      }
      
      return mapRecipes(data.recipes);
    }
    
    // Fallback in case of unexpected API response format
    toast.error('Unexpected response format. Please try again.');
    return getFallbackRecipes('Invalid Format');
  } catch (error) {
    console.error('Error in analyzeImageAndGetRecipes:', error);
    toast.error('Something went wrong: ' + (error.message || 'Please try again later.'));
    // Return fallback recipes in case of error
    return getFallbackRecipes('Exception: ' + error.message);
  }
};

// Helper function to map API recipes to our Recipe type
const mapRecipes = (apiRecipes: any[]): Recipe[] => {
  return apiRecipes.map((recipe: any, index: number) => ({
    id: recipe.id || `recipe-${index + 1}`,
    title: recipe.title,
    description: recipe.description || '',
    cookTime: recipe.cookTime || recipe.cook_time || '30 minutes',
    difficulty: recipe.difficulty || 'Medium',
    ingredients: recipe.ingredients || [],
    instructions: recipe.instructions || [],
    imageUrl: recipe.imageUrl || recipe.image_url || getFallbackImageUrl(index)
  }));
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
const getFallbackRecipes = (errorType: string): Recipe[] => {
  return [
    {
      id: `recipe-fallback-${errorType}`,
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
