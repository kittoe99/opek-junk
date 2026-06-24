import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  isSupabaseConfigured,
  supabaseAnonKey,
  supabaseConfigError,
  supabaseUrl,
} from './supabaseConfig';

let client: SupabaseClient | undefined;

export { isSupabaseConfigured };

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(supabaseConfigError);
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const value = (getSupabase() as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(getSupabase())
      : value;
  },
});

export async function sendConfirmationEmail(type: 'booking' | 'contact' | 'provider_signup', record: any) {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured; skipping confirmation email.');
    return { success: false, error: new Error(supabaseConfigError) };
  }

  try {
    const { data, error } = await getSupabase().functions.invoke('send-email', {
      body: { type, record },
    });
    if (error) {
      console.warn('Failed to send confirmation email:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.warn('Error invoking send-email function:', err);
    return { success: false, error: err };
  }
}

export async function uploadBookingPhoto(base64Image: string, fileName: string): Promise<string | null> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured; skipping photo upload.');
    return null;
  }

  try {
    if (!base64Image || !base64Image.startsWith('data:')) {
      return base64Image || null;
    }

    const response = await fetch(base64Image);
    const blob = await response.blob();

    const { error } = await getSupabase().storage
      .from('booking-photos')
      .upload(fileName, blob, {
        contentType: blob.type || 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.warn('Error uploading photo to Supabase storage:', error);
      return null;
    }

    const { data: { publicUrl } } = getSupabase().storage
      .from('booking-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.warn('Failed to upload booking photo, falling back to base64 database storage:', err);
    return null;
  }
}
