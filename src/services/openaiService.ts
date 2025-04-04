
import { Recipe } from '@/components/RecipeCard';

// Check if we have a valid OpenAI key
const hasOpenAIKey = true; // For now let's assume we have a key
const OPENAI_API_KEY = 'dummy-key'; // This would be replaced with a real key

// Function to analyze an image and get recipe suggestions
export const analyzeImageAndGetRecipes = async (imageFile: File): Promise<Recipe[]> => {
  try {
    if (!hasOpenAIKey) {
      console.error('No OpenAI API key provided');
      return getMockRecipes();
    }
    
    // For now, let's return mock data since we need an actual API key to call OpenAI
    // In a real app, here's where we'd make the API call to OpenAI
    /*
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('prompt', 'Analyze this image and suggest recipes that can be made with these ingredients');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData
    });
    
    const data = await response.json();
    return parseOpenAIResponse(data);
    */
    
    // For the demo, return mock recipes after a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockRecipes();
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

// Function to get recipe details
export const getRecipeDetails = async (recipeId: string): Promise<Recipe | null> => {
  try {
    if (!hasOpenAIKey) {
      console.error('No OpenAI API key provided');
      return null;
    }
    
    // For now, let's return a mock recipe
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
