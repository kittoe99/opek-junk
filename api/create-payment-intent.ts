import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createBookingPaymentIntent } from '../server/createPaymentIntent.js';

function getStripeSecretKey(): string | undefined {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey || !/^sk_(test|live)_/.test(secretKey)) {
    return undefined;
  }
  return secretKey;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = getStripeSecretKey();
  if (!secretKey) {
    return res.status(500).json({
      error:
        'Stripe is not configured. Add a valid STRIPE_SECRET_KEY (sk_test_ or sk_live_) in Vercel project settings.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const { email, name, phone, serviceType, stripeCustomerId } = body;

    const result = await createBookingPaymentIntent(secretKey, {
      email: typeof email === 'string' ? email : undefined,
      name: typeof name === 'string' ? name : undefined,
      phone: typeof phone === 'string' ? phone : undefined,
      serviceType: typeof serviceType === 'string' ? serviceType : undefined,
      stripeCustomerId: typeof stripeCustomerId === 'string' ? stripeCustomerId : undefined,
    });

    return res.status(200).json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
      stripeCustomerId: result.stripeCustomerId,
    });
  } catch (error) {
    console.error('Stripe PaymentIntent error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to create payment intent. Please try again.';
    return res.status(500).json({ error: message });
  }
}
