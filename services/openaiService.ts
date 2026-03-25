import OpenAI from 'openai';
import { QuoteEstimate, DetectedItem, PriceEstimate } from '../types';

function getClient(): OpenAI {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key not configured');
  return new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
}

// Step 1: Detect items from photo (no pricing)
export async function detectItemsFromPhoto(base64Image: string, mimeType: string): Promise<DetectedItem[]> {
  const openai = getClient();

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

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  const result = JSON.parse(content);
  if (!result.items || !Array.isArray(result.items)) throw new Error('Invalid response format');

  return result.items.map((name: string, i: number) => ({
    id: `item-${Date.now()}-${i}`,
    name,
    quantity: 1
  }));
}

// Step 2: Get price estimate based on confirmed item list
export async function getPriceForItems(items: DetectedItem[]): Promise<PriceEstimate> {
  const openai = getClient();

  const itemList = items.map(i => `${i.quantity}x ${i.name}`).join('\n');

  const prompt = `You are a professional junk removal estimator. A customer has confirmed the following items for removal:

${itemList}

Use this pricing guide:

VOLUME-BASED (for mixed loads):
- Minimum Load (up to 2 yd³): $85–$150
- 1/4 Truck (3–4 yd³): $175–$275
- 1/2 Truck (6–8 yd³): $325–$475
- 3/4 Truck (9–11 yd³): $475–$625
- Full Truck (12–15 yd³): $650–$850

ITEM-SPECIFIC (for individual bulky items):
- Mattress/Box Spring: $80–$150 per set
- Sofa/Couch: $100–$225 (Sectionals: $250+)
- Refrigerator/Freezer: $90–$180
- Washing Machine/Dryer: $80–$140 per unit
- Hot Tub: $350–$650
- Tires: $15–$30 each
- Television (CRT/Old): $60–$110
- Desk/Table: $75–$150
- Office Chair: $40–$80

Instructions:
1. Estimate the total volume of all items combined
2. Choose the appropriate pricing method (volume-based for mixed loads, item-specific for 1-3 large items)
3. Calculate a realistic price range with EXACTLY $80 difference between min and max
4. Write a brief 1-sentence summary

Respond in this exact JSON format:
{
  "estimatedVolume": "Load size description (e.g. '1/4 Truck (3-4 yd³)')",
  "priceRange": { "min": 175, "max": 255 },
  "summary": "Brief explanation of pricing method used"
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_completion_tokens: 300,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  const result = JSON.parse(content);
  if (!result.estimatedVolume || !result.priceRange) throw new Error('Invalid response format');

  const priceDiff = result.priceRange.max - result.priceRange.min;
  if (priceDiff !== 80) {
    result.priceRange.max = result.priceRange.min + 80;
  }

  return {
    estimatedVolume: result.estimatedVolume,
    priceRange: { min: result.priceRange.min, max: result.priceRange.max },
    summary: result.summary || 'Estimate based on confirmed items'
  };
}

// Legacy: combined function for backward compatibility
export async function getJunkQuoteFromPhoto(base64Image: string, mimeType: string): Promise<QuoteEstimate> {
  const items = await detectItemsFromPhoto(base64Image, mimeType);
  const price = await getPriceForItems(items);
  return {
    itemsDetected: items.map(i => i.name),
    estimatedVolume: price.estimatedVolume,
    priceRange: price.priceRange,
    summary: price.summary
  };
}
