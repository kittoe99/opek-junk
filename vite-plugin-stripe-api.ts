import type { Plugin } from 'vite';
import { createBookingPaymentIntent } from './lib/createPaymentIntent';
import { ensureStripeCustomer } from './lib/createStripeCustomer';
import { proxyCalculatePrice } from './lib/calculatePriceProxy';
import { syncSucceededPaymentIntent } from './server/syncPaymentIntent';
import Stripe from 'stripe';

function readJsonBody(req: import('http').IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

export function stripeApiDevPlugin(stripeSecretKey?: string, env: Record<string, string> = {}): Plugin {
  return {
    name: 'stripe-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0];

        if (pathname === '/api/calculate-price' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          try {
            const body = await readJsonBody(req);
            const { status, text } = await proxyCalculatePrice(body, env);
            res.statusCode = status;
            res.end(text);
          } catch (error) {
            console.error('Local calculate-price proxy error:', error);
            const message = error instanceof Error ? error.message : 'Failed to calculate price';
            res.statusCode = 500;
            res.end(JSON.stringify({ error: message }));
          }
          return;
        }

        const isStripePaymentRoute =
          (pathname === '/api/create-payment-intent' ||
            pathname === '/api/create-stripe-customer' ||
            pathname === '/api/sync-payment-intent') &&
          req.method === 'POST';

        if (!isStripePaymentRoute) {
          next();
          return;
        }

        res.setHeader('Content-Type', 'application/json');

        if (!stripeSecretKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({
            error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local and restart the dev server.',
          }));
          return;
        }

        try {
          const body = (await readJsonBody(req)) as {
            email?: string;
            name?: string;
            phone?: string;
            serviceType?: string;
            stripeCustomerId?: string;
            paymentIntentId?: string;
          };

          if (pathname === '/api/create-stripe-customer') {
            if (typeof body.email !== 'string' || !body.email.includes('@')) {
              res.statusCode = 400;
              res.end(JSON.stringify({
                error: 'A valid email is required to save your payment method for future charges.',
              }));
              return;
            }

            const stripe = new Stripe(stripeSecretKey);
            const result = await ensureStripeCustomer(stripe, {
              email: body.email,
              name: body.name,
              phone: body.phone,
            });

            res.statusCode = 200;
            res.end(JSON.stringify({
              stripeCustomerId: result.stripeCustomerId,
              supabaseCustomerId: result.supabaseCustomerId,
            }));
            return;
          }

          if (pathname === '/api/sync-payment-intent') {
            const paymentIntentId =
              typeof body.paymentIntentId === 'string' ? body.paymentIntentId.trim() : '';
            if (!paymentIntentId.startsWith('pi_')) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'A valid paymentIntentId is required.' }));
              return;
            }

            const stripe = new Stripe(stripeSecretKey);
            const result = await syncSucceededPaymentIntent(stripe, paymentIntentId);
            res.statusCode = 200;
            res.end(JSON.stringify(result));
            return;
          }

          const result = await createBookingPaymentIntent(stripeSecretKey, body);
          res.statusCode = 200;
          res.end(JSON.stringify({
            clientSecret: result.clientSecret,
            paymentIntentId: result.paymentIntentId,
            stripeCustomerId: result.stripeCustomerId,
          }));
        } catch (error) {
          console.error('Local Stripe API error:', error);
          const message = error instanceof Error ? error.message : 'Stripe API request failed';
          res.statusCode = 500;
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}
