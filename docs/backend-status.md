# Backend verification — October 19, 2026

## Current Opek services

- Supabase project: **WPacquisition**, `wxamwhfmelxqahkdtcci` (active).
- API base: `https://wxamwhfmelxqahkdtcci.supabase.co/functions/v1`.
- CRM business: **Opek Junk Removal**, `biz-1c0c09ce-819e-4795-86b9-0e457ab92f58`.
- Enabled quote-request form: `cf1eb32e-db50-4a3f-b1fa-74147701bdc3`.
- Canonical backend implementation and migrations live in the sibling `opek-sms`
  and `E2local-main` repositories. Use their current API contracts and migration
  ownership rules. Form collection and SMS follow-up activation are separate.

Verified through Supabase project/function inventories, a read-only REST schema
inspection, and the CRM's scoped business/form listing. No customer records were
created and no messages were sent.

## Retired dependencies

The inactive project `mjgwoukwyqwoectxfwqv` (named `hinn.io`) contains this
website's legacy functions. Its migration files remain historical records;
preserving them does not designate it as the current deployment target.

The DigitalOcean `opek-sms-zllz4` application and its API-key `/api/send` interface
were retired in the CRM cutover. Its booking-sync worker, Dockerfile, requirements,
and deployment spec have been removed from this repository. The website server
no longer defaults to the inactive database, and the legacy quote/verification
SMS functions no longer default to the retired SMS host. Local Supabase cache
files are ignored.

The two existing ElevenLabs agents still have tools pointing at the inactive
project's `submit-agent-booking` and `lookup-agent-bookings` functions. They do
not call Vercel `/api/create-booking`. Their tools cannot simply be pointed at
the current CRM: it uses different authentication and booking contracts.

## Website migration remains required

The current CRM project does **not** expose the legacy `bookings`, `payments`,
`pricing_items`, `pricing_config`, `contacts`, `in_home_estimates`, or
`stripe_webhook_events` tables. It uses scoped `sms_*` records and authenticated
Edge APIs. Its public quote form is intake, not a confirmed appointment.

| Website feature | Legacy dependency that needs a supported replacement |
| --- | --- |
| Quote and booking intake | `create_prebooking`, `update_prebooking`, `bookings` |
| Estimate text delivery | `send-quote-sms` and retired DigitalOcean `/api/send` |
| Pricing / photo detection | `pricing_items`, `pricing_config`, `calculate-price`, `detect-items` |
| Deposits / receipts | `payments`, `stripe_webhook_events`, booking payment updates |
| Tracking / verification | `track_order`, `get_order_status_history`, `lookup-quote-otp` |
| Contact / in-home estimate | `contacts`, `in_home_estimates` |
| Providers | Provider document storage, signup/eligibility RPCs and Supabase Auth |
| Voice | Legacy ElevenLabs booking/lookup tools |

Do not set the legacy website's `VITE_SUPABASE_*` / `SUPABASE_*` variables to
WPacquisition and assume these interfaces exist. Do not deploy the legacy
functions, replay this repository's migration chain, or apply its pending
`20261019120000_edge_rate_limits.sql` to the shared CRM as a migration shortcut.
The SMS function would still call a retired service, even with that table present.

Vercel currently lacks the website Supabase variables; the served JavaScript also
contains no configured Supabase project URL. Both active Supabase projects were
checked: `Hobby Projects` contains reading/study tables, not Opek's backend.

`BOOKING_API_SECRET` is set in Vercel Production and Preview and in ignored local
configuration. A new deployment is needed for serverless functions to receive
it. It protects `/api/create-booking`, but does not replace the missing database
integration. Consumers of that route must send `Authorization: Bearer <secret>`.

## Migration history

The two historical files with prefix `20260627000000` are intentionally unchanged.
The old database's applied history could not be read while it was inactive, so
renaming or repairing history would be unverified. These are not migrations for
the current shared CRM. Reconcile any future website migration against the owning
repository and live history before applying only its new, reviewed changes.
