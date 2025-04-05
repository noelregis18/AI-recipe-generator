
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
      throw new Error('OpenAI API key not found');
    }

    // Get the request data
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      throw new Error('No image data provided');
    }

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

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data));

    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    let recipes;
    try {
      // Try to parse the response as JSON
      const content = data.choices[0].message.content;
      recipes = JSON.parse(content);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      // Fall back to a more robust parsing approach or default recipes
      recipes = [{
        id: '1',
        title: 'Error in Recipe Generation',
        description: 'We had trouble generating recipes based on your image. Please try again with a clearer image of your ingredients.',
        ingredients: ['N/A'],
        instructions: ['N/A'],
        difficulty: 'N/A',
        cookTime: 'N/A',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
      }];
    }

    // Add default image URLs if not provided
    const foodImages = [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71'
    ];

    recipes = recipes.map((recipe, index) => ({
      ...recipe,
      imageUrl: recipe.imageUrl || foodImages[index % foodImages.length]
    }));

    return new Response(JSON.stringify({ recipes }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred during the analysis' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
