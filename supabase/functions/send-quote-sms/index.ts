import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuoteSmsPayload {
  name?: string;
  phone?: string;
  price?: number | string;
  serviceType?: string;
  summary?: string;
  volume?: string;
  priceLabel?: string;
}

function firstName(name: string): string {
  const part = name.trim().split(/\s+/)[0];
  return part || 'there';
}

function formatPrice(price: number | string): string {
  const n = typeof price === 'number' ? price : Number(String(price).replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(n)) return String(price);
  return `$${Math.round(n)}`;
}

function buildQuoteMessage(payload: QuoteSmsPayload): string {
  const name = firstName(String(payload.name || ''));
  const service = String(payload.serviceType || 'junk removal').trim() || 'junk removal';
  const priceLabel = String(payload.priceLabel || '').trim() || formatPrice(payload.price ?? 0);
  const volume = payload.volume ? String(payload.volume).trim() : '';
  const summary = payload.summary ? String(payload.summary).trim() : '';
  const isHourly = /\/\s*hour/i.test(priceLabel) || /moving/i.test(service);

  const lines = [
    isHourly
      ? `Hi ${name} — your ${service} rate from Opek is ready: ${priceLabel}.`
      : `Hi ${name} — your ${service} estimate from Opek is ready: ${priceLabel}.`,
  ];

  if (volume) {
    lines.push(`Based on: ${volume}.`);
  } else if (summary && summary.length <= 120) {
    lines.push(summary);
  }

  lines.push(
    'Book online at https://opekjunkremoval.com/booking or call (831) 318-7139.',
    'Msg & data rates may apply. Reply STOP to opt out, HELP for help.'
  );

  return lines.join('\n\n');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const smsUrl = (Deno.env.get('OPEK_SMS_URL') || 'https://opek-sms-zllz4.ondigitalocean.app').replace(
    /\/$/,
    ''
  );
  const apiKey = Deno.env.get('OPEK_SMS_API_KEY');

  if (!apiKey) {
    console.error('[send-quote-sms] OPEK_SMS_API_KEY is not set');
    return new Response(JSON.stringify({ error: 'SMS not configured' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let payload: QuoteSmsPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const phone = String(payload.phone || '').trim();
  if (!phone) {
    return new Response(JSON.stringify({ error: 'phone is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (payload.price === undefined || payload.price === null || payload.price === '') {
    return new Response(JSON.stringify({ error: 'price is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = buildQuoteMessage(payload);

  try {
    const upstream = await fetch(`${smsUrl}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        phone,
        body,
        name: payload.name || null,
        categoryId: 'quote-requests',
      }),
    });

    const text = await upstream.text();
    let data: Record<string, unknown> = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text };
    }

    if (!upstream.ok) {
      console.error('[send-quote-sms] upstream error', upstream.status, data);
      return new Response(
        JSON.stringify({
          error: (data.error as string) || 'Failed to send SMS',
          detail: data.detail || null,
        }),
        {
          status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ ok: true, message: data.message || null, to: data.to || null }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[send-quote-sms] fetch failed', err);
    return new Response(
      JSON.stringify({
        error: 'Failed to reach SMS server',
        detail: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
