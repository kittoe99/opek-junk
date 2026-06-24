import { DetectedItem, PriceEstimate } from '../types';
import { isSupabaseConfigured, supabaseConfigError } from '../lib/supabaseConfig';

async function postCalculatePrice(body: Record<string, unknown>): Promise<PriceEstimate> {
  const response = await fetch('/api/calculate-price', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let payload: PriceEstimate & { error?: string } | null = null;
  try {
    payload = JSON.parse(text);
  } catch {
    // leave payload null
  }

  if (!response.ok) {
    const message =
      payload?.error ||
      (isSupabaseConfigured ? undefined : supabaseConfigError) ||
      'Failed to calculate price on the backend';
    throw new Error(message);
  }

  if (!payload || typeof payload.price !== 'number') {
    throw new Error('Invalid price response from server');
  }

  return payload;
}

export async function calculateStaticPrice(items: DetectedItem[]): Promise<PriceEstimate> {
  return postCalculatePrice({
    type: 'junk_removal',
    items: items.map((item) => ({ name: item.name, quantity: item.quantity })),
  });
}

export interface DumpsterRentalOptions {
  size: '10-yard' | '15-yard' | '20-yard' | '30-yard';
  duration: number;
}

export async function calculateDumpsterRentalPrice(options: DumpsterRentalOptions): Promise<PriceEstimate> {
  return postCalculatePrice({
    type: 'dumpster_rental',
    size: options.size,
    duration: options.duration,
  });
}

export async function calculateMovingLaborPrice(helpers: number, hours: number): Promise<PriceEstimate> {
  return postCalculatePrice({
    type: 'moving_labor',
    helpers,
    hours,
  });
}
