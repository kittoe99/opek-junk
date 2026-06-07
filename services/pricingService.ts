import { DetectedItem, PriceEstimate } from '../types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseUrl = (rawUrl && rawUrl !== 'your_supabase_url_here')
  ? rawUrl
  : 'https://mjgwoukwyqwoectxfwqv.supabase.co';

const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseAnonKey = (rawAnonKey && rawAnonKey !== 'your_supabase_anon_key_here')
  ? rawAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3dvdWt3eXF3b2VjdHhmd3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjAzNjcsImV4cCI6MjA3MDMzNjM2N30.3ee-rHN_BYQKaZmLOTiyoVxU4fYLDnNnfToI8veH5F8';

export async function calculateStaticPrice(items: DetectedItem[]): Promise<PriceEstimate> {
  const response = await fetch(`${supabaseUrl}/functions/v1/calculate-price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    },
    body: JSON.stringify({
      type: 'junk_removal',
      items: items.map(item => ({ name: item.name, quantity: item.quantity }))
    })
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
  const response = await fetch(`${supabaseUrl}/functions/v1/calculate-price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    },
    body: JSON.stringify({
      type: 'dumpster_rental',
      size: options.size,
      duration: options.duration
    })
  });

  if (!response.ok) {
    throw new Error('Failed to calculate dumpster rental price on the backend');
  }

  return response.json();
}
