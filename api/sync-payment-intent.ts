import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { syncSucceededPaymentIntent } from '../server/syncPaymentIntent.js';

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
        'Stripe is not configured. Add a valid STRIPE_SECRET_KEY (sk_test_ or sk_live_) in project settings.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const paymentIntentId =
      typeof body.paymentIntentId === 'string' ? body.paymentIntentId.trim() : '';

    if (!paymentIntentId.startsWith('pi_')) {
      return res.status(400).json({ error: 'A valid paymentIntentId is required.' });
    }

    const stripe = new Stripe(secretKey);
    const result = await syncSucceededPaymentIntent(stripe, paymentIntentId);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Stripe payment sync error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to sync payment method to customer.';
    return res.status(500).json({ error: message });
  }
}
