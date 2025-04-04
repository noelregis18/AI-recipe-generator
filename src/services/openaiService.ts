import { Recipe } from '@/components/RecipeCard';
import { supabase } from '@/integrations/supabase/client';

// Function to analyze an image and get recipe suggestions
export const analyzeImageAndGetRecipes = async (imageFile: File): Promise<Recipe[]> => {
  try {
    // Convert the image file to a base64 string
    const base64Image = await fileToBase64(imageFile);
    
    // Call the Supabase Edge Function with the base64 image
    const { data, error } = await supabase.functions.invoke('analyze-image', {
      body: { imageBase64: base64Image },
    });
    
    if (error) {
      console.error('Error calling analyze-image function:', error);
      throw error;
    }
    
    // Extract the recipes from the response
    const { recipes } = data as { recipes: Recipe[] };
    return recipes;
  } catch (error) {
    console.error('Error analyzing image:', error);
    // If there's an error, return some mock recipes as a fallback
    return getMockRecipes();
  }
};

// Helper function to convert a file to a base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Function to get recipe details
export const getRecipeDetails = async (recipeId: string): Promise<Recipe | null> => {
  try {
    // For now, find the recipe in the list of generated recipes
    // In a real app, this might make another API call or fetch from a database
    const mockRecipes = getMockRecipes();
    const recipe = mockRecipes.find(r => r.id === recipeId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return recipe || null;
  } catch (error) {
    console.error('Error getting recipe details:', error);
    throw error;
  }
};

// Helper function to return mock recipes for development
const getMockRecipes = (): Recipe[] => {
  return [
    {
      id: '1',
      title: 'Vegetable Stir Fry with Rice',
      description: 'A quick and healthy stir fry made with assorted vegetables and served with steamed rice.',
      cookTime: '25 mins',
      difficulty: 'Easy',
      ingredients: [
        '2 cups mixed vegetables (bell peppers, carrots, broccoli, etc.)',
        '2 cloves garlic, minced',
        '1 tbsp ginger, grated',
        '2 tbsp soy sauce',
        '1 tbsp vegetable oil',
        '1 tsp sesame oil',
        '2 cups cooked rice',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Heat vegetable oil in a large wok or skillet over medium-high heat.',
        'Add minced garlic and grated ginger, sauté for 30 seconds until fragrant.',
        'Add vegetables and stir fry for 5-7 minutes until crisp-tender.',
        'Pour in soy sauce and season with salt and pepper.',
        'Drizzle with sesame oil and toss to combine.',
        'Serve hot over steamed rice.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
    },
    {
      id: '2',
      title: 'Simple Pasta Primavera',
      description: 'A light and flavorful pasta dish packed with fresh seasonal vegetables.',
      cookTime: '20 mins',
      difficulty: 'Easy',
      ingredients: [
        '8 oz pasta (any shape)',
        '2 cups mixed vegetables (zucchini, cherry tomatoes, spinach)',
        '2 tbsp olive oil',
        '2 cloves garlic, minced',
        '1/4 cup grated Parmesan cheese',
        'Fresh basil leaves',
        'Salt and pepper to taste',
        'Red pepper flakes (optional)'
      ],
      instructions: [
        'Cook pasta according to package instructions until al dente. Reserve 1/2 cup pasta water before draining.',
        'In a large skillet, heat olive oil over medium heat.',
        'Add minced garlic and sauté for 30 seconds.',
        'Add vegetables and cook for 3-5 minutes until tender but still crisp.',
        'Add drained pasta to the skillet along with a splash of pasta water.',
        'Toss with Parmesan cheese, salt, and pepper.',
        'Garnish with fresh basil leaves and red pepper flakes if desired.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8'
    },
    {
      id: '3',
      title: 'Quick Vegetable Omelette',
      description: 'A protein-packed breakfast or light dinner option using eggs and available vegetables.',
      cookTime: '15 mins',
      difficulty: 'Easy',
      ingredients: [
        '3 large eggs',
        '1/4 cup milk',
        '1/2 cup diced vegetables (bell peppers, onions, tomatoes)',
        '1/4 cup shredded cheese (cheddar or mozzarella)',
        '1 tbsp butter or oil',
        'Fresh herbs (chives, parsley)',
        'Salt and pepper to taste'
      ],
      instructions: [
        'In a bowl, whisk together eggs, milk, salt, and pepper until well combined.',
        'Heat butter or oil in a non-stick skillet over medium heat.',
        'Add diced vegetables and cook for 2-3 minutes until slightly softened.',
        'Pour the egg mixture over the vegetables and cook for 2 minutes without stirring.',
        'When the edges start to set, sprinkle shredded cheese on top.',
        'Cook for another 1-2 minutes until eggs are set but still moist on top.',
        'Fold the omelette in half, garnish with fresh herbs, and serve immediately.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71'
    }
  ];
};
