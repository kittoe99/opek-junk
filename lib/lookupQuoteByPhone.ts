import { supabase } from './supabase';
import type { MovingLaborOptions, QuoteEstimate } from '../types';

export interface QuoteResumeCustomerInfo {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  sms_marketing_consent?: boolean | null;
  sms_marketing_consent_at?: string | null;
}

export interface QuoteResumeBookingDetails {
  service_type?: string | null;
  zip_code?: string | null;
  estimated_items?: unknown;
  estimated_volume?: string | null;
  price?: number | string | null;
  estimate_summary?: string | null;
  subtotal?: number | null;
  online_booking_discount?: number | null;
  photos?: unknown;
  photo_url?: string | null;
  moving_options?: MovingLaborOptions | null;
  details?: string | null;
}

export interface QuoteResumePayload {
  id: string;
  created_at: string;
  customer_info: QuoteResumeCustomerInfo;
  booking_details: QuoteResumeBookingDetails;
}

type InvokeResult<T> = {
  ok: boolean;
  reason?: string;
  error?: string;
  retry_after_seconds?: number;
  prebooking?: T;
};

function asErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'error' in data && data.error) {
    return String((data as { error: unknown }).error);
  }
  return fallback;
}

export async function requestQuoteLookupOtp(
  phone: string
): Promise<{ ok: boolean; reason?: string; error?: string; retryAfterSeconds?: number }> {
  const { data, error } = await supabase.functions.invoke('lookup-quote-otp', {
    body: { action: 'request_otp', phone },
  });

  if (error) {
    // FunctionsHttpError may still carry a JSON body on data
    const reason =
      data && typeof data === 'object' && 'reason' in data
        ? String((data as { reason?: string }).reason || '')
        : undefined;
    return {
      ok: false,
      reason,
      error: asErrorMessage(data, error.message),
      retryAfterSeconds:
        data && typeof data === 'object' && 'retry_after_seconds' in data
          ? Number((data as { retry_after_seconds?: number }).retry_after_seconds)
          : undefined,
    };
  }

  const result = (data || {}) as InvokeResult<never>;
  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason,
      error: result.error || (result.reason === 'no_quote' ? 'No open quote found for that number.' : 'Could not send code.'),
      retryAfterSeconds: result.retry_after_seconds,
    };
  }

  return { ok: true };
}

export async function verifyQuoteLookupOtp(
  phone: string,
  code: string
): Promise<{ ok: boolean; reason?: string; error?: string; prebooking?: QuoteResumePayload }> {
  const { data, error } = await supabase.functions.invoke('lookup-quote-otp', {
    body: { action: 'verify_otp', phone, code },
  });

  if (error) {
    return {
      ok: false,
      reason:
        data && typeof data === 'object' && 'reason' in data
          ? String((data as { reason?: string }).reason || '')
          : undefined,
      error: asErrorMessage(data, error.message),
    };
  }

  const result = (data || {}) as InvokeResult<QuoteResumePayload>;
  if (!result.ok || !result.prebooking) {
    return {
      ok: false,
      reason: result.reason,
      error: result.error || (result.reason === 'no_quote' ? 'No open quote found for that number.' : 'Verification failed.'),
    };
  }

  return { ok: true, prebooking: result.prebooking };
}

function normalizeServiceType(raw: string | null | undefined): string {
  if (!raw) return 'Junk Removal';
  const lower = raw.toLowerCase();
  if (lower.includes('donation')) return 'Donation Pick Up';
  if (lower.includes('moving')) return 'Moving Labor';
  if (lower.includes('dumpster')) return 'Dumpster Rental';
  if (lower.includes('mattress')) return 'Junk Removal';
  return 'Junk Removal';
}

function asItemList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((x) => String(x)).filter(Boolean);
}

function asPrice(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value);
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? Math.round(n) : 0;
  }
  return 0;
}

function firstPhotoUrl(bd: QuoteResumeBookingDetails): string {
  if (typeof bd.photo_url === 'string' && bd.photo_url) return bd.photo_url;
  const photos = bd.photos;
  if (Array.isArray(photos) && photos.length) {
    const first = photos[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && 'url' in first) {
      return String((first as { url?: string }).url || '');
    }
  }
  return '';
}

export interface HydratedQuoteResume {
  estimate: QuoteEstimate;
  image: string | null;
  serviceType: string;
  prefilledName: string;
  prefilledPhone: string;
  partialBookingId: string;
  zipCode: string;
  movingOptions: MovingLaborOptions | null;
  smsMarketingConsentAt: string | null;
  details: string;
}

/** Map verified Prebooking payload into BookingPage handoff shape. */
export function hydrateFromQuoteResume(payload: QuoteResumePayload): HydratedQuoteResume {
  const ci = payload.customer_info || {};
  const bd = payload.booking_details || {};
  const items = asItemList(bd.estimated_items);
  const volume = String(bd.estimated_volume || '').trim() || (items.length ? `${items.length} item(s)` : '');
  const price = asPrice(bd.price);
  const summary = String(bd.estimate_summary || '').trim() || `Estimate for ${normalizeServiceType(bd.service_type || undefined)}`;
  const image = firstPhotoUrl(bd) || null;
  const name = String(ci.name || '').trim();
  const phone = String(ci.phone || '').trim();
  const zipCode = String(bd.zip_code || '').trim();
  const details =
    String(bd.details || '').trim() ||
    `Items: ${items.join(', ')}\nEstimated Items: ${volume}\nEstimated Price: $${price}`;

  return {
    estimate: {
      itemsDetected: items,
      estimatedVolume: volume,
      price,
      summary,
      subtotal: typeof bd.subtotal === 'number' ? bd.subtotal : undefined,
      onlineBookingDiscount:
        typeof bd.online_booking_discount === 'number' ? bd.online_booking_discount : undefined,
    },
    image,
    serviceType: normalizeServiceType(bd.service_type || undefined),
    prefilledName: name,
    prefilledPhone: phone,
    partialBookingId: payload.id,
    zipCode,
    movingOptions: (bd.moving_options as MovingLaborOptions | null) || null,
    smsMarketingConsentAt:
      typeof ci.sms_marketing_consent_at === 'string' ? ci.sms_marketing_consent_at : null,
    details,
  };
}
