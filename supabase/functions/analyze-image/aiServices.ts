
import { corsHeaders } from "./cors.ts";
import { mockRecipes, foodImages } from "./mockRecipes.ts";

// Define the prompt used for both AI services
export const buildAIPrompt = () => `
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

// Try OpenAI API
export async function callOpenAIAPI(imageBase64: string, apiKey: string) {
  console.log("Attempting OpenAI API call...");
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: buildAIPrompt() },
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

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      
      if (response.status === 429 || errorData.includes('rate_limit') || errorData.includes('insufficient_quota')) {
        throw new Error('OpenAI API rate limit reached');
      } else {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('OpenAI response received');

    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    // Try to parse the response as JSON
    const content = data.choices[0].message.content;
    console.log('Raw OpenAI content:', content);
    
    // Handle potential JSON parsing issues
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return {
        recipes: JSON.parse(jsonMatch[0]),
        apiUsed: "OpenAI"
      };
    } else {
      throw new Error('Could not extract JSON from response');
    }
  } catch (error) {
    console.error('Error in callOpenAIAPI:', error);
    throw error;
  }
}

// Try DeepSeek API
export async function callDeepSeekAPI(imageBase64: string, apiKey: string) {
  console.log("Attempting DeepSeek API call...");
  
  try {
    // DeepSeek API format is different - it expects differently structured content
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-vision',  // Make sure to use a vision-capable model
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: buildAIPrompt() },
              { 
                type: 'image', 
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        max_tokens: 2000,
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('DeepSeek API error:', errorData);
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('DeepSeek response received');

    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from DeepSeek');
    }

    // Try to parse the response as JSON
    const content = data.choices[0].message.content;
    console.log('Raw DeepSeek content:', content);
    
    // Handle potential JSON parsing issues
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return {
        recipes: JSON.parse(jsonMatch[0]),
        apiUsed: "DeepSeek"
      };
    } else {
      throw new Error('Could not extract JSON from DeepSeek response');
    }
  } catch (error) {
    console.error('Error in callDeepSeekAPI:', error);
    throw error;
  }
}

// Process recipes and add default images if needed
export function processRecipes(recipes: any[], apiUsed: string) {
  return recipes.map((recipe, index) => ({
    ...recipe,
    id: recipe.id || `recipe-${index + 1}`,
    imageUrl: recipe.imageUrl || foodImages[index % foodImages.length]
  }));
}

// Get fallback recipes when both APIs fail
export function getFallbackRecipes() {
  console.log('All API attempts failed, using mock recipes');
  return {
    recipes: mockRecipes,
    apiUsed: "Demo"
  };
}
