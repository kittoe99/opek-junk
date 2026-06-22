import type { Plugin } from 'vite';
import { createBookingPaymentIntent } from './lib/createPaymentIntent';

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

export function stripeApiDevPlugin(stripeSecretKey?: string): Plugin {
  return {
    name: 'stripe-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split('?')[0];
        if (pathname !== '/api/create-payment-intent' || req.method !== 'POST') {
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
          const body = (await readJsonBody(req)) as { email?: string; serviceType?: string };
          const result = await createBookingPaymentIntent(stripeSecretKey, body);
          res.statusCode = 200;
          res.end(JSON.stringify(result));
        } catch (error) {
          console.error('Local Stripe PaymentIntent error:', error);
          const message = error instanceof Error ? error.message : 'Failed to create payment intent';
          res.statusCode = 500;
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}
