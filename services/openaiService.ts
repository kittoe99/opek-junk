import { supabase } from '../lib/supabase';
import { QuoteEstimate, DetectedItem } from '../types';

// Step 1: Detect items from photos (via Supabase Edge Function)
export async function detectItemsFromPhotos(images: { base64Image: string; mimeType: string }[]): Promise<DetectedItem[]> {
  const { data, error } = await supabase.functions.invoke('detect-items', {
    body: { images }
  });

  if (error) {
    throw new Error(`AI item detection failed: ${error.message}`);
  }

  if (!data || !data.items || !Array.isArray(data.items)) {
    throw new Error('Invalid response from AI detection service');
  }

  return data.items.map((item: any, i: number) => {
    if (typeof item === 'string') {
      return {
        id: `item-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
        name: item,
        quantity: 1
      };
    }
    return {
      id: `item-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
      name: item.name || 'Unknown Item',
      quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1
    };
  });
}

export async function detectItemsFromPhoto(base64Image: string, mimeType: string): Promise<DetectedItem[]> {
  return detectItemsFromPhotos([{ base64Image, mimeType }]);
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

