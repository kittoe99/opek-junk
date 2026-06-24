import { DetectedItem, PriceEstimate } from '../types';
import {
  isSupabaseConfigured,
  supabaseAnonKey,
  supabaseConfigError,
  supabaseUrl,
} from '../lib/supabaseConfig';

function requireSupabaseConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(supabaseConfigError);
  }
}

export async function calculateStaticPrice(items: DetectedItem[]): Promise<PriceEstimate> {
  requireSupabaseConfig();

  const response = await fetch(`${supabaseUrl}/functions/v1/calculate-price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      type: 'junk_removal',
      items: items.map((item) => ({ name: item.name, quantity: item.quantity })),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate price on the backend');
  }

  return response.json();
}

export interface DumpsterRentalOptions {
  size: '10-yard' | '15-yard' | '20-yard' | '30-yard';
  duration: number;
}

export async function calculateDumpsterRentalPrice(options: DumpsterRentalOptions): Promise<PriceEstimate> {
  requireSupabaseConfig();

  const response = await fetch(`${supabaseUrl}/functions/v1/calculate-price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      type: 'dumpster_rental',
      size: options.size,
      duration: options.duration,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate dumpster rental price on the backend');
  }

  return response.json();
}

export async function calculateMovingLaborPrice(helpers: number, hours: number): Promise<PriceEstimate> {
  requireSupabaseConfig();

  const response = await fetch(`${supabaseUrl}/functions/v1/calculate-price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      type: 'moving_labor',
      helpers,
      hours,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to calculate moving labor price on the backend');
  }

  return response.json();
}
