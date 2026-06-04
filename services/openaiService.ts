import { supabase } from '../lib/supabase';
import { QuoteEstimate, DetectedItem } from '../types';

// Step 1: Detect items from photo (via Supabase Edge Function)
export async function detectItemsFromPhoto(base64Image: string, mimeType: string): Promise<DetectedItem[]> {
  const { data, error } = await supabase.functions.invoke('detect-items', {
    body: { base64Image, mimeType }
  });

  if (error) {
    throw new Error(`AI item detection failed: ${error.message}`);
  }

  if (!data || !data.items || !Array.isArray(data.items)) {
    throw new Error('Invalid response from AI detection service');
  }

  return data.items.map((name: string, i: number) => ({
    id: `item-${Date.now()}-${i}`,
    name,
    quantity: 1
  }));
}

// Combined function for backward compatibility
import { calculateStaticPrice } from './pricingService';
export async function getJunkQuoteFromPhoto(base64Image: string, mimeType: string): Promise<QuoteEstimate> {
  const items = await detectItemsFromPhoto(base64Image, mimeType);
  const price = await calculateStaticPrice(items);
  return {
    itemsDetected: items.map(i => i.name),
    estimatedVolume: price.estimatedVolume,
    price: price.price,
    summary: price.summary
  };
}

