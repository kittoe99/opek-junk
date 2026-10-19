# Opek Junk Removal

Marketing site and online booking flow for [opekjunkremoval.com](https://opekjunkremoval.com):
instant quotes, deposit payments, order tracking and provider signup.

## Stack

- **Frontend:** React 19 + Vite + Tailwind CSS (built via PostCSS, config in `tailwind.config.js`)
- **API routes:** Vercel serverless functions in `api/` (shared server code in `server/`)
- **Database / edge functions:** Supabase (`supabase/migrations`, `supabase/functions`)
- **Payments:** Stripe (deposit PaymentIntents + webhook)
- **Voice agent:** ElevenLabs (`elevenlabs-mcp-server/`)

## Run locally

Prerequisites: Node.js 20+

1. Install dependencies: `npm install`
2. Copy [.env.example](.env.example) to `.env.local` and fill in your keys (never commit `.env.local`)
3. Start the dev server: `npm run dev` (http://localhost:3001)
   - `npm run dev:stripe` runs through `vercel dev` so the real `api/` routes are used

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with a local proxy for the Stripe/pricing API routes |
| `npm run build` | Type-checks the project, then builds to `dist/` |
| `npm run typecheck` | TypeScript check only |
| `npm run images:optimize` | Creates smaller WebP assets, preserving dimensions and transparency; originals remain available |
| `npm run stripe:setup-webhook` | Registers the Stripe webhook endpoint |

## Deploying

- Frontend + `api/` deploy to Vercel (`vercel.json`).
- Read [backend verification and migration status](docs/backend-status.md) before
  configuring Supabase or deploying backend changes. The current CRM is in
  WPacquisition; this checkout still contains legacy website interfaces and
  historical migrations that must not be replayed into that shared project.

Server-only secrets (`STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `BOOKING_API_SECRET`,
`OPEK_SMS_API_KEY`, `OPENAI_API_KEY`) must never use a `VITE_` prefix.
