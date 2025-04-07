
import { corsHeaders } from "./cors.ts";
import { mockRecipes } from "./mockRecipes.ts";
import { 
  callOpenAIAPI, 
  callDeepSeekAPI, 
  processRecipes, 
  getFallbackRecipes 
} from "./aiServices.ts";

export async function handleImageAnalysis(req: Request) {
  try {
    // Get the OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    // Get the DeepSeek API key - using a new API key
    const deepseekApiKey = "sk-ZXbsIIHlyIGLbP3Ryfxhb2k4QnZZKGHsLG3aHkTf8QyH1pMZ";
    
    if (!openaiApiKey && !deepseekApiKey) {
      console.error('No API keys found');
      throw new Error('No API keys available');
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

    // Try APIs in sequence
    let result = null;
    let apiError = null;
    let openaiAttempted = false;
    let deepseekAttempted = false;
    
    // Try OpenAI if key is available
    if (openaiApiKey) {
      try {
        openaiAttempted = true;
        console.log("Attempting to call OpenAI API...");
        result = await callOpenAIAPI(imageBase64, openaiApiKey);
        console.log("OpenAI API call successful!");
      } catch (openaiError) {
        console.error('Error with OpenAI API:', openaiError);
        apiError = openaiError;
        // We'll try DeepSeek next
      }
    } else {
      console.log("No OpenAI API key available, skipping OpenAI");
    }
    
    // If OpenAI failed or is not available, try DeepSeek
    if (!result && deepseekApiKey) {
      try {
        deepseekAttempted = true;
        console.log("Attempting to call DeepSeek API...");
        result = await callDeepSeekAPI(imageBase64, deepseekApiKey);
        console.log("DeepSeek API call successful!");
      } catch (deepseekError) {
        console.error('Error with DeepSeek API:', deepseekError);
        // If both APIs failed, we'll use mockRecipes
        // If OpenAI failed first, use that error for better context
        apiError = apiError || deepseekError;
      }
    } else if (!result) {
      console.log("No DeepSeek API key available or already have result, skipping DeepSeek");
    }
    
    // Log attempts status
    console.log(`API attempts: OpenAI: ${openaiAttempted ? 'Yes' : 'No'}, DeepSeek: ${deepseekAttempted ? 'Yes' : 'No'}`);
    
    // If both APIs failed or no keys available, fall back to mock recipes
    if (!result) {
      console.log("All API attempts failed or were skipped, using fallback recipes");
      result = getFallbackRecipes();
      
      // Include error information in the response
      return new Response(JSON.stringify({ 
        recipes: result.recipes,
        apiUsed: result.apiUsed,
        error: apiError ? apiError.message : 'No successful API response',
        notice: "Using demo recipes - API unavailable"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process the recipes
    const processedRecipes = processRecipes(result.recipes, result.apiUsed);
    
    console.log('Returning recipes:', processedRecipes.length, 'using API:', result.apiUsed);

    return new Response(JSON.stringify({ 
      recipes: processedRecipes,
      apiUsed: result.apiUsed,
      notice: result.apiUsed === "Demo" ? "Using demo recipes - API unavailable" : null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    throw error; // Let the main handler catch this
  }
}
