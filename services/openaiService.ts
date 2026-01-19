import OpenAI from 'openai';
import { QuoteEstimate } from '../types';

export async function getJunkQuoteFromPhoto(base64Image: string, mimeType: string): Promise<QuoteEstimate> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Only for development, use server-side in production
  });

  const prompt = `You are a professional junk removal estimator. Analyze this photo and provide:

1. A detailed list of all visible items that need to be removed
2. An estimated volume in cubic yards (e.g., "1/4 truck load", "1/2 truck load", "Full truck load")
3. A price range estimate with exactly $50 difference between min and max (e.g., "$120-$170", "$200-$250")

Consider:
- Item size, weight, and disposal difficulty
- Labor required for removal
- Typical junk removal pricing ($100-$800 range)
- The price range MUST have exactly $50 between min and max

Respond in this exact JSON format:
{
  "items": ["item 1", "item 2", "item 3"],
  "estimatedVolume": "description of volume",
  "priceRange": {
    "min": 120,
    "max": 170
  },
  "summary": "Brief explanation of the estimate"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5.2',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_completion_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content);
    
    // Validate the response has the required fields
    if (!result.items || !result.estimatedVolume || !result.priceRange) {
      throw new Error('Invalid response format from AI');
    }

    // Ensure price range is exactly $50 apart
    const priceDiff = result.priceRange.max - result.priceRange.min;
    if (priceDiff !== 50) {
      // Adjust to ensure $50 difference
      result.priceRange.max = result.priceRange.min + 50;
    }

    return {
      itemsDetected: result.items,
      estimatedVolume: result.estimatedVolume,
      priceRange: {
        min: result.priceRange.min,
        max: result.priceRange.max
      },
      summary: result.summary || 'Estimate based on photo analysis'
    };
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw new Error(error.message || 'Failed to analyze photo');
  }
}
