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
    let imageList: { base64Image: string, mimeType: string }[] = []

    if (payload.images && Array.isArray(payload.images)) {
      imageList = payload.images
    } else if (payload.base64Image && payload.mimeType) {
      imageList = [{ base64Image: payload.base64Image, mimeType: payload.mimeType }]
    }

    if (imageList.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No images provided in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openai = new OpenAI({ apiKey })

    const prompt = `You are a professional junk removal estimator. Analyze the provided photo(s) and list every individual item you can see that needs to be removed.

CRITICAL INSTRUCTIONS FOR MULTIPLE PHOTOS:
- If multiple photos are provided, they may show the same items from different angles, distances, or positions.
- You MUST identify and deduplicate matching items across all photos to prevent double-counting. Each unique item should only be listed once, regardless of how many photos it appears in.

FOCUS & FILTERING RULES:
- Ignore any distant items, items in the background, neighboring lawns/properties, or items clearly not meant for removal (like permanent fixtures, structures, walls, or built-in elements).
- Focus ONLY on clear, close-enough, individual items that are the main subject of the photos.

LISTING RULES:
- List each distinct item separately (e.g. "Sofa", "Office Chair", "Cardboard Box")
- Be specific: say "Queen Mattress" not just "Mattress", say "Mini Fridge" not just "Appliance"
- For groups of similar small items, list them as one entry (e.g. "Assorted Clothing Bags", "Cardboard Boxes")
- Do NOT include pricing, weight, or volume estimates
- Return between 1 and 20 items

Respond in this exact JSON format:
{
  "items": ["Item 1", "Item 2", "Item 3"]
}`;

    const contentParts = [
      { type: 'text', text: prompt }
    ]

    for (const img of imageList) {
      if (img.base64Image && img.mimeType) {
        contentParts.push({
          type: 'image_url',
          image_url: { url: `data:${img.mimeType};base64,${img.base64Image}` }
        })
      }
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-5.4-mini',
      messages: [{
        role: 'user',
        content: contentParts as any
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
