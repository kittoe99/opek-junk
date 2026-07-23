import { createClient, SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

function getSupabaseUrl(): string {
  const rawUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  if (rawUrl && rawUrl !== 'your_supabase_url_here') {
    return rawUrl;
  }
  return 'https://mjgwoukwyqwoectxfwqv.supabase.co';
}

function getServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(getServiceRoleKey());
}

export function getSupabaseAdmin(): SupabaseClient {
  const serviceRoleKey = getServiceRoleKey();
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to Vercel project settings.'
    );
  }

  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return adminClient;
}
