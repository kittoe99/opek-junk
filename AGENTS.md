# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
This repo is the **Opek Junk Removal** website — a single-page React 19 app built with Vite. It uses Supabase (DB/storage/edge functions), Stripe (deposit payments), and OpenAI (AI item detection for quotes). There is no backend server in this repo; `/api/*` routes are Vercel serverless functions, and during local `npm run dev` the Stripe/price endpoints are emulated by `vite-plugin-stripe-api.ts`.

Auxiliary, out of the main web-app dev scope:
- `services/booking_sync_agent.py` — a DigitalOcean worker (`Dockerfile.agent`, `.do/app.yaml`); deps in `do-requirements.txt`.
- `elevenlabs-mcp-server/` — a separate Node/TypeScript MCP server with its own `package.json`.

### Running the app (dev)
- `npm run dev` — starts Vite on **port 3001** (note: `vite.config.ts` sets 3000 but the `dev` script overrides with `--port 3001`).
- The site loads and the full quote → estimate → scheduling → review flow works **without any secrets** (pricing uses a local fallback; address autocomplete is client-side).
- Features that need secrets: AI photo item-detection (`VITE_OPENAI_API_KEY`/`GEMINI_API_KEY`), Stripe deposit payment (`STRIPE_SECRET_KEY` etc.), and Supabase persistence/emails (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Copy `.env.example` to `.env.local` and fill these in to exercise those paths. Without Stripe configured, the final booking step (after "Details & Review") cannot complete payment.

### Build / lint / test
- Build: `npm run build` (Vite/esbuild — does **not** type-check).
- There is **no** lint script and **no** automated test suite configured in `package.json`.
- `npx tsc --noEmit` is NOT a clean gate: it reports many pre-existing type errors and also scans `elevenlabs-mcp-server/` (whose deps aren't installed at the repo root). Don't treat `tsc` failures as regressions from your change unless they're in files you touched.
