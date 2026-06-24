type EnvMap = Record<string, string | undefined>;

function resolveSupabaseConfig(env: EnvMap = process.env as EnvMap) {
  const rawUrl = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL;
  const supabaseUrl = rawUrl && rawUrl !== 'your_supabase_url_here' ? rawUrl : '';

  const rawKey =
    env.SUPABASE_ANON_KEY ??
    env.VITE_SUPABASE_ANON_KEY ??
    env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseKey =
    rawKey && rawKey !== 'your_supabase_anon_key_here' ? rawKey : '';

  return { supabaseUrl, supabaseKey };
}

export function isCalculatePriceProxyConfigured(env?: EnvMap): boolean {
  const { supabaseUrl, supabaseKey } = resolveSupabaseConfig(env);
  return Boolean(supabaseUrl && supabaseKey);
}

export async function proxyCalculatePrice(
  body: unknown,
  env?: EnvMap
): Promise<{ status: number; text: string }> {
  const { supabaseUrl, supabaseKey } = resolveSupabaseConfig(env);

  if (!supabaseUrl || !supabaseKey) {
    return {
      status: 500,
      text: JSON.stringify({
        error:
          'Supabase is not configured. Set SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local, then restart the dev server.',
      }),
    };
  }

  const upstream = await fetch(`${supabaseUrl}/functions/v1/calculate-price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify(body),
  });

  return { status: upstream.status, text: await upstream.text() };
}
