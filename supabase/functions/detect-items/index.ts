import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import OpenAI from "https://esm.sh/openai@4.28.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured on Supabase' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const payload = await req.json()
    const { base64Image, mimeType } = payload

    if (!base64Image || !mimeType) {
      return new Response(
        JSON.stringify({ error: 'Missing base64Image or mimeType in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openai = new OpenAI({ apiKey })

    const prompt = `You are a professional junk removal estimator. Analyze this photo and list every individual item you can see that would need to be removed.

Rules:
- List each distinct item separately (e.g. "Sofa", "Office Chair", "Cardboard Boxes")
- Be specific: say "Queen Mattress" not just "Mattress", say "Mini Fridge" not just "Appliance"
- For groups of similar small items, list them as one entry (e.g. "Assorted Clothing Bags", "Cardboard Boxes")
- Do NOT include pricing or volume estimates
- Return between 1 and 20 items

Respond in this exact JSON format:
{
  "items": ["Item 1", "Item 2", "Item 3"]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Image}` } }
        ]
      }],
      max_completion_tokens: 400,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const result = JSON.parse(content)
    if (!result.items || !Array.isArray(result.items)) {
      throw new Error('Invalid response format from OpenAI')
    }

    return new Response(
      JSON.stringify({ items: result.items }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in detect-items function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
