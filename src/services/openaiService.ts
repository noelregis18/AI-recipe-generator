
import { Recipe } from '@/types/recipe';

// Function to simulate AI analysis and recipe generation
export const analyzeImageAndGetRecipes = async (image: File): Promise<Recipe[]> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, we're returning mock recipes
  return [
    {
      id: 'recipe-1',
      title: 'Pasta Primavera',
      description: 'A light and fresh pasta dish with seasonal vegetables.',
      cookTime: '25 minutes',
      difficulty: 'Easy',
      ingredients: [
        '8 oz pasta',
        '2 cups mixed vegetables (bell peppers, zucchini, broccoli)',
        '3 cloves garlic, minced',
        '2 tbsp olive oil',
        '1/4 cup grated parmesan cheese',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Cook pasta according to package instructions.',
        'In a large skillet, heat olive oil over medium heat.',
        'Add garlic and sauté until fragrant, about 30 seconds.',
        'Add vegetables and cook until tender-crisp, about 5 minutes.',
        'Drain pasta and add to the skillet with vegetables.',
        'Toss with parmesan cheese, salt, and pepper.',
        'Serve immediately.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGFzdGElMjBwcmltYXZlcmF8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'recipe-2',
      title: 'Roasted Vegetable Quinoa Bowl',
      description: 'A nutritious and colorful quinoa bowl with roasted vegetables.',
      cookTime: '35 minutes',
      difficulty: 'Medium',
      ingredients: [
        '1 cup quinoa, rinsed',
        '2 cups vegetable broth',
        '1 sweet potato, diced',
        '1 red bell pepper, chopped',
        '1 zucchini, chopped',
        '1 red onion, chopped',
        '2 tbsp olive oil',
        '1 tsp cumin',
        '1 tsp paprika',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Preheat oven to 425°F (220°C).',
        'In a bowl, toss vegetables with olive oil, cumin, paprika, salt, and pepper.',
        'Spread vegetables on a baking sheet and roast for 25 minutes.',
        'Meanwhile, cook quinoa in vegetable broth according to package instructions.',
        'Combine roasted vegetables with cooked quinoa.',
        'Serve warm.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cXVpbm9hJTIwYm93bHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'recipe-3',
      title: 'Simple Garden Salad',
      description: 'A refreshing salad with fresh garden vegetables.',
      cookTime: '10 minutes',
      difficulty: 'Easy',
      ingredients: [
        '4 cups mixed greens',
        '1 cucumber, sliced',
        '1 cup cherry tomatoes, halved',
        '1/4 red onion, thinly sliced',
        '1/4 cup olive oil',
        '2 tbsp balsamic vinegar',
        '1 tsp honey',
        'Salt and pepper to taste'
      ],
      instructions: [
        'In a large bowl, combine mixed greens, cucumber, cherry tomatoes, and red onion.',
        'In a small bowl, whisk together olive oil, balsamic vinegar, honey, salt, and pepper.',
        'Drizzle dressing over salad and toss to coat.',
        'Serve immediately.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Z2FyZGVuJTIwc2FsYWR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
    }
  ];
};
