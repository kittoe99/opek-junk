import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createBookingPaymentIntent } from '../lib/createPaymentIntent';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({
      error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const { email, serviceType } = body;

    const result = await createBookingPaymentIntent(secretKey, { email, serviceType });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Stripe PaymentIntent error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create payment intent';
    return res.status(500).json({ error: message });
  }
}
