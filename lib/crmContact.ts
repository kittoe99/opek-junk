// Public CRM identifiers, not credentials. This endpoint owns consent and SMS enrollment.
export const CONTACT_FORM_URL = 'https://wxamwhfmelxqahkdtcci.supabase.co/functions/v1/web-form/8f11bfaf-60b5-4f40-af07-e6b0987c18d6?connection=25f8ed06-cc69-410d-bf72-b44219d4754d';
export const CONTACT_SMS_CONSENT = 'I agree to receive SMS updates and follow-ups from Opek Junk Removal at the number provided. Consent is optional. Message frequency varies. Message and data rates may apply. Reply STOP to opt out.';
export const CONTACT_SUBJECTS = ['General question', 'Quote / pricing', 'Existing order', 'Partnership', 'Something else'];

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  smsOptIn: boolean;
  website: string;
}

function contactPayload(input: ContactSubmission) {
  const digits = input.phone.replace(/\D/g, '');
  const phone = input.phone.trim().startsWith('+') ? `+${digits}`
    : digits.length === 10 ? `+1${digits}`
    : digits.length === 11 && digits.startsWith('1') ? `+${digits}` : '';
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error('Please enter a valid phone number, including the country code for numbers outside the US.');
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  if (!name || !message) throw new Error('Please enter your name and message.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.');
  if (!CONTACT_SUBJECTS.includes(input.subject)) throw new Error('Please select a topic.');
  if (name.length > 200 || email.length > 320 || message.length > 2000) throw new Error('Please shorten your message to 2,000 characters or fewer.');
  return { name, phone, email, smsOptIn: input.smsOptIn === true, emailOptIn: false,
    details: { subject: input.subject, message }, website: input.website };
}

/** Keep one instance per form. Same payload keeps its UUID after uncertain responses. */
export function createContactSubmitter(fetcher: typeof fetch = fetch, timeoutMs = 20_000) {
  let previousPayload = '';
  let submissionId = '';
  let pending: Promise<void> | null = null;
  return (input: ContactSubmission): Promise<void> => {
    if (pending) return pending;
    const payload = contactPayload(input);
    const fingerprint = JSON.stringify(payload);
    if (fingerprint !== previousPayload) {
      submissionId = crypto.randomUUID();
      previousPayload = fingerprint;
    }
    const request = async () => {
      let response: Response;
      let result: { ok?: boolean; submissionId?: string; error?: string };
      try {
        response = await fetcher(CONTACT_FORM_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, submissionId }),
          signal: AbortSignal.timeout(timeoutMs),
        });
        result = await response.json();
      } catch {
        throw new Error('We couldn’t confirm your submission. Please retry with the same details; your message won’t be submitted twice.');
      }
      if (response.status === 429) throw new Error('Too many submissions. Please wait 10 minutes before trying again.');
      if (!response.ok || !result || result.ok !== true || result.submissionId !== submissionId) {
        throw new Error('We couldn’t confirm your message. Please try again with the same details, or call us.');
      }
    };
    pending = request().finally(() => { pending = null; });
    return pending;
  };
}
