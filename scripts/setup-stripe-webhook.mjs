/**
 * Configure Stripe webhook endpoint for Opek Junk Removal.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe-webhook.mjs
 *
 * Optional env:
 *   WEBHOOK_URL=https://www.opekjunkremoval.com/api/stripe-webhook
 */
import Stripe from 'stripe';

const WEBHOOK_URL =
  process.env.WEBHOOK_URL?.trim() || 'https://www.opekjunkremoval.com/api/stripe-webhook';

const ENABLED_EVENTS = [
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'payment_intent.canceled',
  'payment_intent.processing',
  'payment_intent.requires_action',
];

const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
if (!secretKey) {
  console.error('Missing STRIPE_SECRET_KEY. Set it in your environment and re-run.');
  process.exit(1);
}

if (!/^sk_(test|live)_/.test(secretKey)) {
  console.error('STRIPE_SECRET_KEY must start with sk_test_ or sk_live_.');
  process.exit(1);
}

const stripe = new Stripe(secretKey);
const mode = secretKey.startsWith('sk_live_') ? 'live' : 'test';

function eventsMatch(current, expected) {
  const a = [...current].sort();
  const b = [...expected].sort();
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

async function main() {
  console.log(`Stripe mode: ${mode}`);
  console.log(`Webhook URL: ${WEBHOOK_URL}`);
  console.log(`Events: ${ENABLED_EVENTS.join(', ')}`);

  const existing = await stripe.webhookEndpoints.list({ limit: 100 });
  const match = existing.data.find((endpoint) => endpoint.url === WEBHOOK_URL);

  if (match) {
    const needsUpdate =
      !match.enabled ||
      !eventsMatch(match.enabled_events ?? [], ENABLED_EVENTS);

    if (needsUpdate) {
      const updated = await stripe.webhookEndpoints.update(match.id, {
        enabled_events: ENABLED_EVENTS,
        disabled: false,
        description: 'Opek Junk Removal booking deposit payments',
      });
      console.log(`Updated existing webhook endpoint: ${updated.id}`);
    } else {
      console.log(`Webhook endpoint already configured: ${match.id}`);
    }

    console.log('\nAdd this to Vercel (if not already set):');
    console.log('STRIPE_WEBHOOK_SECRET=<signing secret from Stripe Dashboard>');
    console.log(`Dashboard: https://dashboard.stripe.com/${mode === 'test' ? 'test/' : ''}webhooks/${match.id}`);
    console.log('\nNote: Stripe only reveals the signing secret when an endpoint is first created.');
    console.log('If you do not have whsec_... saved, create a new endpoint or roll the secret in Dashboard.');
    return;
  }

  const created = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: ENABLED_EVENTS,
    description: 'Opek Junk Removal booking deposit payments',
  });

  console.log(`\nCreated webhook endpoint: ${created.id}`);
  console.log('\n=== IMPORTANT: add this to Vercel environment variables ===');
  console.log(`STRIPE_WEBHOOK_SECRET=${created.secret}`);
  console.log('===========================================================');
  console.log(`Dashboard: https://dashboard.stripe.com/${mode === 'test' ? 'test/' : ''}webhooks/${created.id}`);
}

main().catch((error) => {
  console.error('Failed to configure Stripe webhook:', error.message ?? error);
  process.exit(1);
});
