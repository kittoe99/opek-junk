import { DetectedItem, PriceEstimate } from '../types';
import { isSupabaseConfigured } from '../lib/supabaseConfig';
import { getSupabase } from '../lib/supabase';
import { calculateMovingLaborLocally, calculatePriceLocally } from './localPricing';
import type { DumpsterRentalOptions } from './localPricing';
import { calculateJunkRemovalPrice } from './junkRemovalPriceService';

export type { DumpsterRentalOptions } from './localPricing';

function parsePriceResponse(text: string, status: number): PriceEstimate {
  let payload: PriceEstimate & { error?: string } | null = null;
  try {
    payload = JSON.parse(text);
  } catch {
    // leave payload null
  }

  if (!status || status < 200 || status >= 300) {
    throw new Error(payload?.error || 'Failed to calculate price on the backend');
  }

  if (!payload || typeof payload.price !== 'number') {
    throw new Error('Invalid price response from server');
  }

  return payload;
}

async function fetchApiRoute(body: Record<string, unknown>): Promise<PriceEstimate> {
  const response = await fetch('/api/calculate-price', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  return parsePriceResponse(text, response.status);
}

async function invokeSupabaseFunction(body: Record<string, unknown>): Promise<PriceEstimate> {
  const { data, error } = await getSupabase().functions.invoke('calculate-price', { body });

  if (error) {
    throw new Error(error.message || 'Supabase price function failed');
  }

  if (!data || typeof data.price !== 'number') {
    if (data?.error) {
      throw new Error(String(data.error));
    }
    throw new Error('Invalid price response from Supabase function');
  }

  return data as PriceEstimate;
}

async function postCalculatePrice(body: Record<string, unknown>): Promise<PriceEstimate> {
  const errors: string[] = [];

  try {
    return await fetchApiRoute(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'API route failed';
    errors.push(message);
    console.warn('calculate-price API route failed:', message);
  }

  if (isSupabaseConfigured) {
    try {
      return await invokeSupabaseFunction(body);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Supabase function failed';
      errors.push(message);
      console.warn('calculate-price Supabase invoke failed:', message);
    }
  }

  try {
    console.warn('Using local pricing fallback for quote calculation');
    return calculatePriceLocally(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Local pricing failed';
    errors.push(message);
    throw new Error(errors[errors.length - 1] || message);
  }
}

export async function calculateStaticPrice(items: DetectedItem[]): Promise<PriceEstimate> {
  return calculateJunkRemovalPrice(items);
}

export async function calculateDumpsterRentalPrice(options: DumpsterRentalOptions): Promise<PriceEstimate> {
  return postCalculatePrice({
    type: 'dumpster_rental',
    size: options.size,
    duration: options.duration,
  });
}

export async function calculateMovingLaborPrice(helpers: number, hours: number, needsTruck = false): Promise<PriceEstimate> {
  return calculateMovingLaborLocally(helpers, hours, needsTruck);
}
