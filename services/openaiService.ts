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

// Legacy: combined function for backward compatibility
import { calculateStaticPrice } from './pricingService';
export async function getJunkQuoteFromPhoto(base64Image: string, mimeType: string): Promise<QuoteEstimate> {
  const items = await detectItemsFromPhoto(base64Image, mimeType);
  const price = calculateStaticPrice(items);
  return {
    itemsDetected: items.map(i => i.name),
    estimatedVolume: price.estimatedVolume,
    priceRange: price.priceRange,
    summary: price.summary
  };
}
