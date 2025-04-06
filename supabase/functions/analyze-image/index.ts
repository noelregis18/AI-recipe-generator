
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not found');
    }

    // Get the request data
    const requestData = await req.json();
    const { imageBase64 } = requestData;
    if (!imageBase64) {
      console.error('No image data provided');
      throw new Error('No image data provided');
    }

    // Check if the image is properly formatted
    if (!imageBase64.startsWith('data:image/')) {
      console.error('Invalid image format');
      throw new Error('Invalid image format');
    }

    // Return mock data if we detect the API key is having quota issues
    // This way the app continues to function even when API limits are reached
    const mockRecipes = [
      {
        id: "sample-1",
        title: "Demo Recipe: Pasta Primavera",
        description: "A light pasta dish with fresh vegetables.",
        ingredients: [
          "8 oz pasta (any shape)",
          "1 cup cherry tomatoes, halved",
          "1 zucchini, diced",
          "1 bell pepper, sliced",
          "2 cloves garlic, minced",
          "1/4 cup olive oil",
          "1/4 cup grated Parmesan cheese",
          "Salt and pepper to taste"
        ],
        instructions: [
          "Boil pasta according to package directions.",
          "Heat olive oil in a large pan and add garlic, cook until fragrant.",
          "Add vegetables and sauté for 5 minutes until tender.",
          "Drain pasta and add to the pan with vegetables.",
          "Toss with Parmesan cheese, salt, and pepper."
        ],
        difficulty: "Easy",
        cookTime: "20 mins",
        imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8"
      },
      {
        id: "sample-2",
        title: "Demo Recipe: Simple Stir-Fry",
        description: "A quick and nutritious stir-fry that works with any vegetables you have on hand.",
        ingredients: [
          "2 cups mixed vegetables (bell peppers, carrots, broccoli)",
          "1 cup protein of choice (tofu, chicken, beef)",
          "2 tbsp vegetable oil",
          "3 tbsp soy sauce",
          "1 tbsp honey or maple syrup",
          "1 clove garlic, minced",
          "1 tsp ginger, grated",
          "2 cups cooked rice for serving"
        ],
        instructions: [
          "Heat oil in a wok or large pan over high heat.",
          "Add protein and cook until nearly done.",
          "Add vegetables and stir-fry for 3-5 minutes.",
          "Mix soy sauce, honey, garlic, and ginger in a small bowl.",
          "Pour sauce over the stir-fry and cook for another minute.",
          "Serve over rice."
        ],
        difficulty: "Easy",
        cookTime: "15 mins",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
      },
      {
        id: "sample-3",
        title: "Demo Recipe: Quick Quesadilla",
        description: "A simple quesadilla that can be made with ingredients you likely already have.",
        ingredients: [
          "2 large flour tortillas",
          "1 cup shredded cheese",
          "1/2 cup beans (black or pinto)",
          "1/4 cup salsa",
          "1/4 cup diced onion",
          "Optional toppings: avocado, sour cream, cilantro"
        ],
        instructions: [
          "Heat a large pan over medium heat.",
          "Place one tortilla in the pan and sprinkle half with cheese.",
          "Add beans and onions on top of the cheese.",
          "Fold the tortilla in half and cook until golden brown, about 2 minutes.",
          "Flip and cook the other side until crisp and cheese is melted.",
          "Serve with salsa and optional toppings."
        ],
        difficulty: "Easy",
        cookTime: "10 mins",
        imageUrl: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71"
      }
    ];

    // Prepare the prompt for OpenAI
    const prompt = `
      Analyze this image of food ingredients and suggest 3 recipes that can be made with them.
      For each recipe, include:
      - Title
      - Brief description
      - List of ingredients with measurements
      - Step-by-step instructions
      - Difficulty (Easy, Medium, Hard)
      - Estimated cooking time in minutes
      
      Format your response as a JSON array with these properties:
      [
        {
          "id": "1",
          "title": "Recipe Title",
          "description": "Brief description",
          "ingredients": ["Ingredient 1", "Ingredient 2", ...],
          "instructions": ["Step 1", "Step 2", ...],
          "difficulty": "Easy/Medium/Hard",
          "cookTime": "X mins"
        },
        ...
      ]
      
      Use ONLY the ingredients visible in the image. If some standard kitchen ingredients might be assumed to be available (salt, pepper, oil), you can include those.
    `;

    console.log("Calling OpenAI API...");
    
    try {
      // Call OpenAI API with the image
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { 
                  type: 'image_url', 
                  image_url: {
                    url: imageBase64,
                  }
                }
              ]
            }
          ],
          max_tokens: 2000,
        })
      });

      // Check for specific API limit errors
      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API error:', errorData);
        
        // Check if it's a rate limit error
        if (response.status === 429 || errorData.includes('rate_limit') || errorData.includes('insufficient_quota')) {
          console.log('Using mock recipes due to API rate limits');
          // Return mock recipes with an explicit message about the API limit
          return new Response(
            JSON.stringify({ 
              recipes: mockRecipes,
              notice: "Using demo recipes - API rate limit reached"
            }),
            { 
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } else {
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('OpenAI response received');

      if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid response from OpenAI');
      }

      let recipes;
      try {
        // Try to parse the response as JSON
        const content = data.choices[0].message.content;
        console.log('Raw OpenAI content:', content);
        
        // Handle potential JSON parsing issues
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          recipes = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract JSON from response');
        }
      } catch (error) {
        console.error('Error parsing OpenAI response:', error);
        // Fall back to mock recipes
        console.log('Falling back to mock recipes due to parsing error');
        recipes = mockRecipes;
      }

      // Add default image URLs if not provided
      const foodImages = [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71'
      ];

      recipes = recipes.map((recipe, index) => ({
        ...recipe,
        id: recipe.id || `recipe-${index + 1}`,
        imageUrl: recipe.imageUrl || foodImages[index % foodImages.length]
      }));

      console.log('Returning recipes:', recipes.length);

      return new Response(JSON.stringify({ recipes }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (apiError) {
      console.error('Error with OpenAI API call:', apiError);
      console.log('Falling back to mock recipes due to API error');
      
      // Return mock recipes when OpenAI API fails
      return new Response(
        JSON.stringify({ 
          recipes: mockRecipes,
          notice: "Using demo recipes - API unavailable"
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error in analyze-image function:', error);
    // Return a helpful error message but with fallback recipes
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during the analysis',
        recipes: [
          {
            id: 'error-1',
            title: 'Could Not Process Image',
            description: 'We encountered an issue analyzing your image. Please try again with a clearer photo of ingredients.',
            cookTime: 'N/A',
            difficulty: 'N/A',
            ingredients: ['Please try again with a different image'],
            instructions: ['Try taking the photo in better lighting', 'Ensure ingredients are clearly visible'],
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
          }
        ]
      }),
      { 
        status: 200, // Return 200 even on error, but include error message
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
