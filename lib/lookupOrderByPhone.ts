import { supabase } from './supabase';

export interface TrackedOrderResult {
  id: string;
  order_number: string;
  customer_info: {
    name: string;
    phone: string;
    email: string;
  };
  location_info: {
    address: string;
    unit_number: string | null;
    city: string;
    state: string;
    zip_code: string;
  };
  booking_details: {
    service_type: string;
    preferred_date: string;
    preferred_time?: string | null;
    details: string;
    estimated_items: string[] | null;
    estimated_volume: string | null;
    price: number | null;
    estimate_summary: string | null;
    photo_url: string | null;
  };
  status: string;
  created_at: string;
}

type InvokeResult = {
  ok: boolean;
  reason?: string;
  error?: string;
  retry_after_seconds?: number;
  bookings?: TrackedOrderResult[];
};

function asErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'error' in data && data.error) {
    return String((data as { error: unknown }).error);
  }
  return fallback;
}

export async function requestOrderLookupOtp(
  phone: string
): Promise<{ ok: boolean; reason?: string; error?: string; retryAfterSeconds?: number }> {
  const { data, error } = await supabase.functions.invoke('lookup-quote-otp', {
    body: { action: 'request_otp', phone, purpose: 'track_order' },
  });

  if (error) {
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

  const result = (data || {}) as InvokeResult;
  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason,
      error:
        result.error ||
        (result.reason === 'no_order' ? 'No orders found for that number.' : 'Could not send code.'),
      retryAfterSeconds: result.retry_after_seconds,
    };
  }

  return { ok: true };
}

export async function verifyOrderLookupOtp(
  phone: string,
  code: string
): Promise<{ ok: boolean; reason?: string; error?: string; bookings?: TrackedOrderResult[] }> {
  const { data, error } = await supabase.functions.invoke('lookup-quote-otp', {
    body: { action: 'verify_otp', phone, code, purpose: 'track_order' },
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

  const result = (data || {}) as InvokeResult;
  if (!result.ok || !result.bookings) {
    return {
      ok: false,
      reason: result.reason,
      error:
        result.error ||
        (result.reason === 'no_order' ? 'No orders found for that number.' : 'Verification failed.'),
    };
  }

  return { ok: true, bookings: result.bookings };
}
