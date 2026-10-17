import { supabase } from './supabase';

export interface SendQuoteSmsParams {
  name: string;
  phone: string;
  price: number;
  serviceType: string;
  summary?: string;
  volume?: string;
  /** Overrides the formatted price in the SMS (e.g. "$119/hour"). */
  priceLabel?: string;
}

/**
 * Send the customer's quote estimate via the opek-sms server.
 * Failures are logged and returned — callers should not block the quote UI on SMS errors.
 */
export async function sendQuoteSms(
  params: SendQuoteSmsParams
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('send-quote-sms', {
      body: {
        name: params.name,
        phone: params.phone,
        price: params.price,
        serviceType: params.serviceType,
        summary: params.summary,
        volume: params.volume,
        priceLabel: params.priceLabel,
      },
    });

    if (error) {
      console.warn('[sendQuoteSms] invoke failed:', error.message);
      return { ok: false, error: error.message };
    }

    if (data?.error) {
      console.warn('[sendQuoteSms] edge error:', data.error, data.detail);
      return { ok: false, error: String(data.error) };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[sendQuoteSms] exception:', message);
    return { ok: false, error: message };
  }
}

/** Build moving-labor SMS price + detail lines from estimate options. */
export function movingQuoteSmsFields(opts: {
  helpers: number;
  hours: number;
  needsTruck?: boolean;
  totalPrice: number;
}): { serviceType: string; priceLabel: string; volume: string } {
  const helpers = opts.helpers === 1 ? 1 : 2;
  const hourlyRate = helpers === 1 ? 69 : 99;
  const truckNote = opts.needsTruck ? ' · +$99 truck' : '';
  return {
    serviceType: 'Local Moving',
    priceLabel: `$${hourlyRate}/hour`,
    volume: `${helpers} helper${helpers === 1 ? '' : 's'} · ~${opts.hours} hr${opts.hours === 1 ? '' : 's'} (est. $${Math.round(opts.totalPrice)})${truckNote}`,
  };
}
