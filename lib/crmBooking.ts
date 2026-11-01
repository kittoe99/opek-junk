// Public identifiers only. CRM owns intake, consent and message scheduling.
export const BOOKING_FORM_ID = '3c69393f-38e0-45ae-bfc6-eededfab8efa';
export const BOOKING_FORM_URL = `https://wxamwhfmelxqahkdtcci.supabase.co/functions/v1/web-form/${BOOKING_FORM_ID}?connection=699d41fd-a0d9-4a76-a367-0952d581cfe3`;
export const BOOKING_TIME_ZONE = 'America/Denver';
export const BOOKING_SMS_CONSENT = 'I agree to receive SMS updates and follow-ups from Opek Junk Removal at the number provided. Consent is optional. Message frequency varies. Message and data rates may apply. Reply STOP to opt out.';
export const BOOKING_TERMS = 'I agree to the Terms of Service and understand availability and price must be confirmed.';

export const BOOKING_WINDOWS = {
  morning: { hour: '08', label: 'Morning (8am – 12pm)' },
  midday: { hour: '12', label: 'Mid-day (12pm – 4pm)' },
  evening: { hour: '16', label: 'Evening (4pm – 7pm)' },
} as const;

export interface BookingSubmission {
  name: string; phone: string; email: string; serviceType: string;
  address: string; unitNumber?: string; city: string; state: string; zipCode: string;
  date: string; timeSlot: keyof typeof BOOKING_WINDOWS | '';
  items: string[]; price: number; summary?: string; volume?: string;
  dropoffAddress?: string; movingDetails?: string; notes?: string;
  smsOptIn: boolean; termsAccepted: boolean;
}

export function bookingLocalNow(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: BOOKING_TIME_ZONE,
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const part = (type: string) => parts.find(p => p.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`;
}

export function bookingPayload(input: BookingSubmission, now = new Date()) {
  const text = (value: string | undefined, label: string, max = 300, required = false) => {
    const result = (value ?? '').trim();
    if ((required && !result) || result.length > max) throw new Error(`Please check ${label} (up to ${max} characters).`);
    return result;
  };
  const name = text(input.name, 'your name', 200, true);
  const email = text(input.email, 'your email', 320, true);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
  const digits = input.phone.replace(/\D/g, '');
  const phone = input.phone.trim().startsWith('+') ? `+${digits}` : digits.length === 10 ? `+1${digits}`
    : digits.length === 11 && digits.startsWith('1') ? `+${digits}` : '';
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error('Please enter a valid phone number.');
  const service = input.serviceType === 'Moving Labor' ? 'Local Moving' : input.serviceType;
  if (!['Junk Removal', 'Mattress Disposal', 'Local Moving', 'Dumpster Rental', 'Donation Pick Up', 'Property Cleanout'].includes(service)) throw new Error('Please select a service.');
  const slot = BOOKING_WINDOWS[input.timeSlot];
  const parsedDate = new Date(`${input.date}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !Number.isFinite(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== input.date || !slot) throw new Error('Please select a valid date and arrival window.');
  // The public API interprets this wall-clock value in the CRM business timezone.
  // Never convert it using the visitor's browser timezone or a fixed UTC offset.
  const appointmentAt = `${input.date}T${slot.hour}:00`;
  if (appointmentAt <= bookingLocalNow(now)) throw new Error('Please select a future arrival window (Mountain Time).');
  if (!/^\d{5}$/.test(input.zipCode.trim())) throw new Error('Please enter a valid ZIP code.');
  if (!Number.isFinite(input.price) || input.price < 0) throw new Error('Please recalculate your estimate.');
  if (input.termsAccepted !== true) throw new Error('Please accept the Terms of Service.');
  const payload = { name, phone, email, appointmentAt, smsOptIn: input.smsOptIn === true, emailOptIn: false,
    details: { service_type: service, service_address: text(input.address, 'your address', 300, true),
      unit_number: text(input.unitNumber, 'your unit'), city: text(input.city, 'your city', 300, true),
      state: text(input.state, 'your state', 300, true), zip_code: input.zipCode.trim(), preferred_date: input.date,
      arrival_window: slot.label, items: text(input.items.join(', '), 'your items or work requested', 2000, true),
      estimated_price: `$${input.price.toFixed(2)}`, estimate_summary: text([input.volume, input.summary].filter(Boolean).join('\n'), 'your estimate summary', 2000),
      dropoff_address: text(input.dropoffAddress, 'your drop-off address'), moving_details: text(input.movingDetails, 'your moving details', 2000),
      notes: text(input.notes, 'your notes', 2000), terms_accepted: true }, website: '' };
  if (new TextEncoder().encode(JSON.stringify({ ...payload, submissionId: '00000000-0000-4000-8000-000000000000' })).length > 16384) throw new Error('Please shorten your booking details.');
  return payload;
}

/** One instance per mounted form: uncertain retries reuse the UUID and never fake acceptance. */
export function createBookingSubmitter(fetcher: typeof fetch = fetch, timeoutMs = 20_000) {
  let fingerprint = '', submissionId = '';
  let pending: Promise<string> | null = null;
  return (input: BookingSubmission): Promise<string> => {
    if (pending) return pending;
    const payload = bookingPayload(input);
    const next = JSON.stringify(payload);
    if (next !== fingerprint) { fingerprint = next; submissionId = crypto.randomUUID(); }
    const request = async () => {
      let response: Response, result: { ok?: boolean; submissionId?: string };
      try {
        response = await fetcher(BOOKING_FORM_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, submissionId }), signal: AbortSignal.timeout(timeoutMs) });
        result = await response.json();
      } catch {
        throw new Error('We couldn’t confirm your booking request. Retry with the same details to avoid a duplicate.');
      }
      if (response.status === 429) throw new Error('Too many submissions. Please wait 10 minutes before trying again.');
      if (!response.ok || !result || result.ok !== true || result.submissionId !== submissionId) throw new Error('We couldn’t confirm your booking request. Please retry with the same details or call us.');
      return submissionId;
    };
    pending = request().finally(() => { pending = null; });
    return pending;
  };
}
