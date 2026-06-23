import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const BOOKING_DEPOSIT_AMOUNT_CENTS = 100;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return res.status(500).json({
      error: 'Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel project settings.',
    });
  }

  if (!/^sk_(test|live)_/.test(secretKey)) {
    return res.status(500).json({
      error:
        'STRIPE_SECRET_KEY is invalid. It must be your Stripe secret key starting with sk_test_ or sk_live_, not the variable name or publishable key.',
    });
  }

  const stripe = new Stripe(secretKey);

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const { email, serviceType } = body;

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
      return res.status(500).json({ error: 'Failed to initialize payment.' });
    }

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Stripe PaymentIntent error:', error);
    return res.status(500).json({ error: 'Failed to create payment intent. Please try again.' });
  }
}
