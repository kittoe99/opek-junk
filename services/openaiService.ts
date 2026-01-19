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

  const prompt = `You are a professional junk removal estimator. Follow this DECISION TREE to provide accurate quotes:

STEP 1: IDENTIFY THE TYPE
Analyze the photo and classify as ONE of these types:
1. HOUSEHOLD JUNK: Mixed household items (furniture, boxes, general clutter, appliances, etc.)
2. HEAVY DEBRIS: Construction materials, concrete, dirt, rocks, heavy building materials
3. INDIVIDUAL BULKY ITEMS: 1-3 specific large items (sofa, mattress, appliance, etc.)

STEP 2: APPLY APPROPRIATE PRICING METHOD

If HOUSEHOLD JUNK → Use VOLUME-BASED PRICING:
- Minimum Load (up to 2 yd³): $85 – $150
- 1/4 Truck (3 – 4 yd³): $175 – $275
- 1/2 Truck (6 – 8 yd³): $325 – $475
- 3/4 Truck (9 – 11 yd³): $475 – $625
- Full Truck (12 – 15 yd³): $650 – $850

If HEAVY DEBRIS → Use BED LOAD PRICING:
(Note: Bed load pricing not yet provided - use volume-based as fallback)

If INDIVIDUAL BULKY ITEMS → Use ITEM-SPECIFIC PRICING:
- Mattress/Box Spring: $80 – $150 per set
- Sofa/Couch: $100 – $225 (Sectionals: $250+)
- Refrigerator/Freezer: $90 – $180 (includes Freon disposal)
- Washing Machine/Dryer: $80 – $140 per unit
- Hot Tub: $350 – $650
- Tires: $15 – $30 each (with rims: $40+)
- Television (CRT/Old): $60 – $110

STEP 3: CALCULATE FINAL QUOTE
- List all visible items
- Apply the appropriate pricing method based on type
- Ensure price range has EXACTLY $50 difference between min and max
- For multiple items, sum their ranges appropriately

Respond in this exact JSON format:
{
  "items": ["item 1", "item 2", "item 3"],
  "estimatedVolume": "Load size or item description (e.g., '1/4 Truck (3-4 yd³)', 'Sofa + Mattress', 'Minimum Load (up to 2 yd³)')",
  "priceRange": {
    "min": 175,
    "max": 225
  },
  "summary": "Brief explanation mentioning the type identified and pricing method used"
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
