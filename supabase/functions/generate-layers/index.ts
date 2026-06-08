import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, referenceImage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating layers for prompt:', prompt);

    // Define the 4 progressive layer prompts
    const layerPrompts = [
      {
        name: 'Background',
        prompt: `Create only the background layer for: ${prompt}. Focus on: background elements, environmental setting, base colors, and atmosphere. Keep it simple with no main subjects yet.`
      },
      {
        name: 'Main Elements',
        prompt: `Build upon the background by adding the main subject/elements for: ${prompt}. Include: primary subjects, key objects, and main focal points. Maintain the background style.`
      },
      {
        name: 'Details',
        prompt: `Add fine details and secondary elements to: ${prompt}. Include: textures, smaller objects, additional characters or items, and refined lighting. Keep building on previous layers.`
      },
      {
        name: 'Final Polish',
        prompt: `Create the final polished version of: ${prompt}. Add: final effects, highlights, shadows, color grading, and overall refinement. This is the complete composition.`
      }
    ];

    const layers = [];

    // Generate each layer sequentially
    for (const layer of layerPrompts) {
      console.log(`Generating ${layer.name} layer...`);
      
      const messages: any[] = [
        {
          role: 'user',
          content: layer.prompt
        }
      ];

      // If reference image is provided, include it in the request
      if (referenceImage) {
        messages[0].content = [
          {
            type: 'text',
            text: `${layer.prompt}\n\nUse this reference image as inspiration for style and composition:`
          },
          {
            type: 'image_url',
            image_url: {
              url: referenceImage
            }
          }
        ];
      }

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages,
          modalities: ['image', 'text']
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error generating ${layer.name}:`, response.status, errorText);
        throw new Error(`Failed to generate ${layer.name}: ${errorText}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        console.error(`No image URL in response for ${layer.name}:`, data);
        throw new Error(`No image generated for ${layer.name}`);
      }

      layers.push({
        name: layer.name,
        imageUrl,
        description: layer.prompt
      });

      console.log(`✓ ${layer.name} layer generated`);
    }

    console.log('All layers generated successfully');

    return new Response(
      JSON.stringify({ layers }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in generate-layers function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
