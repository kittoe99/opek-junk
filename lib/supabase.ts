import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseUrl = (rawUrl && rawUrl !== 'your_supabase_url_here')
  ? rawUrl
  : 'https://mjgwoukwyqwoectxfwqv.supabase.co';

const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseAnonKey = (rawAnonKey && rawAnonKey !== 'your_supabase_anon_key_here')
  ? rawAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3dvdWt3eXF3b2VjdHhmd3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjAzNjcsImV4cCI6MjA3MDMzNjM2N30.3ee-rHN_BYQKaZmLOTiyoVxU4fYLDnNnfToI8veH5F8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function sendConfirmationEmail(type: 'booking' | 'contact' | 'provider_signup', record: any) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
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

