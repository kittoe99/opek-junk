import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { ensureStripeCustomer } from './utils/stripeCustomer';

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

  const stripe = new Stripe(secretKey);

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const { email, name, phone } = body;

    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        error: 'A valid email is required to save your payment method for future charges.',
      });
    }

    const result = await ensureStripeCustomer(stripe, {
      email,
      name: typeof name === 'string' ? name : undefined,
      phone: typeof phone === 'string' ? phone : undefined,
    });

    return res.status(200).json({
      stripeCustomerId: result.stripeCustomerId,
      supabaseCustomerId: result.supabaseCustomerId,
    });
  } catch (error) {
    console.error('Stripe customer creation error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to create Stripe customer.';
    return res.status(500).json({ error: message });
  }
}
