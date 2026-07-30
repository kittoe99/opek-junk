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

/**
 * Confirmation emails are delivered by the `send_notification_on_insert`
 * database trigger → send-form-notification edge function (service_role JWT).
 * The public client no longer calls send-email directly (abuse vector).
 */
export async function sendConfirmationEmail(
  type: 'booking' | 'contact' | 'provider_signup',
  _record: unknown,
) {
  console.warn(
    `[sendConfirmationEmail:${type}] client-side email invoke removed; DB trigger handles delivery.`,
  );
  return { success: true, data: { handledBy: 'db_trigger' } };
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
      console.warn('Error uploading photo to Supabase storage, storing inline in booking record:', error);
      return base64Image;
    }

    const { data: { publicUrl } } = getSupabase().storage
      .from('booking-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.warn('Failed to upload booking photo, falling back to base64 database storage:', err);
    return base64Image;
  }
}
