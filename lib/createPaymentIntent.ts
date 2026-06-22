import Stripe from 'stripe';

export const BOOKING_DEPOSIT_AMOUNT_CENTS = 100;

export async function createBookingPaymentIntent(
  secretKey: string,
  options: { email?: string; serviceType?: string } = {}
) {
  const stripe = new Stripe(secretKey);
  const { email, serviceType } = options;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: BOOKING_DEPOSIT_AMOUNT_CENTS,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: {
      type: 'booking_deposit',
      service_type: typeof serviceType === 'string' ? serviceType : 'booking',
    },
    ...(typeof email === 'string' && email.includes('@') ? { receipt_email: email } : {}),
  });

  if (!paymentIntent.client_secret) {
    throw new Error('Failed to initialize payment.');
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}
