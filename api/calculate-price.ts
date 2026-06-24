import type { VercelRequest, VercelResponse } from '@vercel/node';

const rawUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const supabaseUrl = rawUrl && rawUrl !== 'your_supabase_url_here' ? rawUrl : '';

const rawKey =
  process.env.SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey =
  rawKey && rawKey !== 'your_supabase_anon_key_here' ? rawKey : '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      error:
        'Supabase is not configured on the server. Set SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) in your environment.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});

    const upstream = await fetch(`${supabaseUrl}/functions/v1/calculate-price`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader('Content-Type', 'application/json');
    return res.send(text);
  } catch (error) {
    console.error('calculate-price proxy error:', error);
    const message = error instanceof Error ? error.message : 'Failed to calculate price';
    return res.status(500).json({ error: message });
  }
}
