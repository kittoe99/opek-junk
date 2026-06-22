import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { BOOKING_DEPOSIT_AMOUNT_CENTS } from '../lib/deposit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.' });
  }

  const stripe = new Stripe(secretKey);

  try {
    const { email, serviceType } = req.body ?? {};

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
    const message = error instanceof Error ? error.message : 'Failed to create payment intent';
    return res.status(500).json({ error: message });
  }
}
