// Public form identifiers. The CRM owns consent, enrollment and SMS delivery.
export const QUOTE_FORM_URL = 'https://wxamwhfmelxqahkdtcci.supabase.co/functions/v1/web-form/cf1eb32e-db50-4a3f-b1fa-74147701bdc3?connection=de1dc646-aa05-4210-b122-6dd4f577ef92';
export const QUOTE_SMS_CONSENT = 'I agree to receive an SMS acknowledgment and quote follow-ups from Opek Junk Removal at the number provided: daily for three days, then twice weekly through day 31. Consent is optional. Message and data rates may apply. Reply STOP to opt out.';

export interface QuoteSubmission {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  zipCode: string;
  items: string[];
  price: number;
  summary: string;
  volume: string;
  smsOptIn: boolean;
  website?: string;
}

function quotePayload(input: QuoteSubmission) {
  const digits = input.phone.replace(/\D/g, '');
  const phone = input.phone.trim().startsWith('+') ? `+${digits}`
    : digits.length === 10 ? `+1${digits}`
    : digits.length === 11 && digits.startsWith('1') ? `+${digits}` : '';
  const name = input.name.trim();
  const email = input.email.trim();
  const serviceType = input.serviceType === 'Moving Labor' ? 'Local Moving' : input.serviceType;
  if (!name || name.length > 200) throw new Error('Please enter your name (up to 200 characters).');
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error('Please enter a valid phone number.');
  if (email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
  if (!['Junk Removal', 'Local Moving', 'Dumpster Rental', 'Donation Pick Up'].includes(serviceType)) throw new Error('Please select a service.');
  if (!/^\d{5}$/.test(input.zipCode.trim())) throw new Error('Please enter a valid ZIP code.');
  if (!Number.isFinite(input.price) || input.price < 0) throw new Error('Please recalculate your estimate.');
  const items = input.items.join(', ').trim();
  const summary = [input.volume, input.summary].filter(Boolean).join('\n').trim();
  if (!items || items.length > 2000 || summary.length > 2000) throw new Error('Please keep your quote details within 2,000 characters.');
  return { name, phone, email, smsOptIn: input.smsOptIn === true, emailOptIn: false,
    details: { items_to_remove: items, pickup_location: input.zipCode.trim(), service_type: serviceType,
      estimated_price: `$${input.price.toFixed(2)}`, estimate_summary: summary }, website: input.website || '' };
}

/** Keep one instance per intake. An uncertain response can be retried without duplicate enrollment. */
export function createQuoteSubmitter(fetcher: typeof fetch = fetch, timeoutMs = 20_000) {
  let previousPayload = '';
  let submissionId = '';
  let pending: Promise<void> | null = null;
  return (input: QuoteSubmission): Promise<void> => {
    if (pending) return pending;
    const payload = quotePayload(input);
    const fingerprint = JSON.stringify(payload);
    if (fingerprint !== previousPayload) {
      submissionId = crypto.randomUUID();
      previousPayload = fingerprint;
    }
    const request = async () => {
      let response: Response;
      let result: { ok?: boolean; submissionId?: string };
      try {
        response = await fetcher(QUOTE_FORM_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, submissionId }), signal: AbortSignal.timeout(timeoutMs),
        });
        result = await response.json();
      } catch {
        throw new Error('We couldn’t confirm your quote request. Please retry with the same details; your request won’t be submitted twice.');
      }
      if (response.status === 429) throw new Error('Too many submissions. Please wait 10 minutes before trying again.');
      if (!response.ok || !result || result.ok !== true || result.submissionId !== submissionId) {
        throw new Error('We couldn’t confirm your quote request. Please try again with the same details, or call us.');
      }
    };
    pending = request().finally(() => { pending = null; });
    return pending;
  };
}
