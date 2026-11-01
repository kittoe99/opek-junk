import { DetectedItem, PriceEstimate } from '../types';
import { getSupabase } from '../lib/supabase';
import {
  buildItemMinPriceMapFromDbRows,
  calculateJunkRemovalEstimate,
  calculateJunkRemovalEstimateLocally,
  JUNK_REMOVAL_MIN_PRICE,
} from '../lib/junkRemovalPricing';

export async function calculateJunkRemovalPriceFromDatabase(
  items: DetectedItem[]
): Promise<PriceEstimate> {
  const supabase = getSupabase();

  const [{ data: dbItems, error: itemsError }, { data: configData, error: configError }] =
    await Promise.all([
      supabase.from('pricing_items').select('name, min_price'),
      supabase.from('pricing_config').select('value').eq('key', 'junk_removal_rules').single(),
    ]);

  if (itemsError) throw itemsError;
  if (configError) throw configError;

  const minOrderPrice = Number(configData?.value?.min_price) || JUNK_REMOVAL_MIN_PRICE;
  const priceMap = buildItemMinPriceMapFromDbRows(dbItems ?? []);

  return calculateJunkRemovalEstimate(
    items.map((item) => ({ name: item.name, quantity: item.quantity })),
    priceMap,
    minOrderPrice
  );
}

export async function calculateJunkRemovalPrice(items: DetectedItem[]): Promise<PriceEstimate> {
  try {
    return await calculateJunkRemovalPriceFromDatabase(items);
  } catch (err) {
    console.warn('pricing_items lookup failed, using local min-price fallback:', err);
    return calculateJunkRemovalEstimateLocally(items);
  }
}
