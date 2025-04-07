
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleImageAnalysis } from "./imageAnalysis.ts";
import { corsHeaders } from "./cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received analyze-image request");
    return await handleImageAnalysis(req);
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
