import Stripe from 'stripe';

export const BOOKING_DEPOSIT_AMOUNT_CENTS = 100;

export interface CreatePaymentIntentOptions {
  email?: string;
  name?: string;
  phone?: string;
  serviceType?: string;
}

function normalizePhoneForStripe(phone?: string): string | undefined {
  if (typeof phone !== 'string') {
    return undefined;
  }

  const trimmed = phone.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith('+')) {
    const digits = trimmed.slice(1).replace(/\D/g, '');
    return digits.length >= 10 ? `+${digits}` : undefined;
  }

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  return undefined;
}

async function findOrCreateStripeCustomer(
  stripe: Stripe,
  options: Pick<CreatePaymentIntentOptions, 'email' | 'name' | 'phone'>
) {
  const email = typeof options.email === 'string' && options.email.includes('@')
    ? options.email.trim()
    : undefined;
  const name = typeof options.name === 'string' ? options.name.trim() : undefined;
  const phone = normalizePhoneForStripe(options.phone);
  const rawPhone = typeof options.phone === 'string' ? options.phone.trim() : undefined;

  if (!email && !name && !phone && !rawPhone) {
    return null;
  }

  if (email) {
    const existing = await stripe.customers.list({ email, limit: 1 });
    if (existing.data[0]) {
      return existing.data[0];
    }
  }

  return stripe.customers.create({
    email,
    name,
    phone,
    metadata: { source: 'opekjunkremoval.com' },
  });
}

export async function createBookingPaymentIntent(
  secretKey: string,
  options: CreatePaymentIntentOptions = {}
) {
  const stripe = new Stripe(secretKey);
  const { email, name, phone, serviceType } = options;

  const stripeCustomer = await findOrCreateStripeCustomer(stripe, { email, name, phone });

  const normalizedEmail =
    typeof email === 'string' && email.includes('@') ? email.trim() : undefined;
  const normalizedName = typeof name === 'string' ? name.trim() : undefined;
  const normalizedPhone = typeof phone === 'string' ? phone.trim() : undefined;
  const stripePhone = normalizePhoneForStripe(phone);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: BOOKING_DEPOSIT_AMOUNT_CENTS,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    ...(stripeCustomer ? { customer: stripeCustomer.id } : {}),
    metadata: {
      type: 'booking_deposit',
      service_type: typeof serviceType === 'string' ? serviceType : 'booking',
      ...(normalizedEmail ? { customer_email: normalizedEmail } : {}),
      ...(normalizedName ? { customer_name: normalizedName } : {}),
      ...(normalizedPhone ? { customer_phone: normalizedPhone } : {}),
    },
    ...(normalizedEmail ? { receipt_email: normalizedEmail } : {}),
  });

  if (!paymentIntent.client_secret) {
    throw new Error('Failed to initialize payment.');
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    paymentIntent,
    stripeCustomerId: stripeCustomer?.id ?? null,
    customerEmail: normalizedEmail ?? null,
    customerName: normalizedName ?? null,
    customerPhone: normalizedPhone ?? null,
  };
}
