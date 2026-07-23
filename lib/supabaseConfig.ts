const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseUrl =
  rawUrl && rawUrl !== 'your_supabase_url_here' ? rawUrl : '';

export const supabaseAnonKey =
  rawAnonKey && rawAnonKey !== 'your_supabase_anon_key_here' ? rawAnonKey : '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabaseConfigError =
  'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.';
