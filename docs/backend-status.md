# Backend verification — October 22, 2026

## Booking integration — October 22, 2026

The main, quote-to-booking and mattress booking flows now use an E2 CRM
booking-request form for **Opek Junk Removal** with no deposit. Form collection
and its optional SMS acknowledgment are enabled in CRM. Website changes were
deployed to production on October 22, 2026 (11:15 AM Mountain Time). See [booking integration](booking-crm-integration.md)
for identifiers, data mapping, automation behavior and validation.

The form saves a request, not a capacity-reserved appointment. Staff must
confirm availability and final pricing. The historical booking/payment routes
and phone-based quote lookup remain outside this migration.

Production Vercel deployment `dpl_BZ3RkYKaL3LjUvf3WA7h6irwEnWr` is READY
for project `opek-junk` and aliased to `www.opekjunkremoval.com` and the apex
domain. The full current website and API routes were deployed. All 23 adapter
tests and local/remote production builds passed. Home, booking, mattress,
quote and contact paths returned HTTP 200; served assets include both the new
booking form/connection identifiers and the separate quote form/connection.
Production booking page rendering was checked without submitting customer data.
No Supabase migrations or ElevenLabs agent updates were deployed.

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

## Contact form integration — October 19, 2026

The Contact page now uses the current CRM public form API, independently of the
legacy website Supabase configuration. Created and enabled through e2-crm MCP:

- Form: `8f11bfaf-60b5-4f40-af07-e6b0987c18d6` (contacts preset), **Opek Junk Removal — Contact Us**.
- Website connection: `25f8ed06-cc69-410d-bf72-b44219d4754d`, enabled on site
  `f6201771-9798-44cb-85dc-e8c737329aa4`.
- Published SMS version 1: one zero-delay acknowledgment, including outside
  sending hours; no later steps and AI replies disabled for this automation.
- Existing business sender: **+1 877 757 4365**. Contact page Call/Text links use it.
- Name, email and normalized phone are fixed fields; topic and message map to
  `details.subject` and `details.message`. Optional SMS consent is unchecked by
  default; unchecked submissions save without SMS. Email enrollment is off.
- The adapter in `lib/crmContact.ts` uses public identifiers only, validates
  responses, retains the same submission UUID for unchanged retries while the
  page remains mounted, and deduplicates in-flight submissions.

Acknowledgment: “Hi {{first_name}}, thanks for contacting Opek Junk Removal!
We've received your message and our team will get back to you during business
hours. Reply STOP to opt out.” Delivery remains subject to consent, suppression,
queue processing and carrier delivery; zero delay is not a delivery guarantee.

Validation: public attributed GET returned 200 and matching fields/consent;
published-rule simulation schedules one immediate acknowledgment after hours
and none without consent; seven mocked adapter tests pass. No live submissions
or test SMS were created. No database migrations were applied.

Production deployed October 19, 2026 (October 20 at 02:12 UTC): Vercel deployment
`dpl_2hZqxWJxCeanoEuF4LZWeSMLvn4p` is READY for project `opek-junk`. The full
current website and API routes passed the production build. Verified HTTP 200
at `https://www.opekjunkremoval.com/contact`; its served Contact page bundle
contains the expected form ID, website connection, consent text and sender.
CRM form collection and published SMS version 1 remain enabled with no reported
readiness blockers. Delivery was not tested with a real recipient.

## Quote form integration — October 19, 2026

The Quote page uses the existing CRM quote form, updated through e2-crm MCP:

- Form `cf1eb32e-db50-4a3f-b1fa-74147701bdc3`, applied revision 5, collection enabled.
- Enabled website connection `de1dc646-aa05-4210-b122-6dd4f577ef92` on the same Opek site.
- SMS automation revision 9, published version 3, enabled; sender **+1 877 757 4365**.
- 12 scheduled messages: immediate acknowledgment, days 1, 2, 3, then days 7,
  10, 14, 17, 21, 24, 28 and 31. Subsequent texts use 9 AM–6 PM America/Denver;
  quiet-hour adjustments can shift follow-up dates. Only the first acknowledgment
  bypasses that window. Replies pause the sequence, opt-out stops it, AI replies
  remain enabled. No historical submissions were enrolled or changed.
- Instant quote text: “Hi {{first_name}}, Opek Junk Removal here. Your
  {{field.service_type}} estimate is {{field.estimated_price}}, based on the details
  you entered. Reply with questions or to arrange service. Reply STOP to opt out.”
  Published version 3 corrects the initial acknowledgment to include the same
  price submitted by the Quote page. Simulated junk removal ($169.00), local
  moving ($396.00), and no-consent cases successfully. No website redeployment
  was needed because the deployed adapter already supplies both fields. This
  applies to future submissions; existing runs keep their previous snapshot.
- `lib/crmQuote.ts` submits normalized contact details, required email, service,
  ZIP, items, estimated price and estimate summary. All Quote page service paths
  use this adapter; services marked Coming Soon remain unavailable in the picker.
  SMS consent is optional, unchecked, and discloses the follow-up cadence.
- Quote submission succeeds only after confirmed CRM acceptance. Identical retries
  retain their UUID while mounted and concurrent submits share one request.
  Quote intake no longer calls the retired quote SMS or legacy prebooking RPC.
  Shared components retain their existing behavior outside the Quote page.
- CRM intake IDs are not passed to legacy booking RPCs. Booking requests now
  have a separate CRM adapter; completing one does not cancel a CRM quote sequence.
  Photo files are not uploaded to CRM by this intake; item/estimate details are saved.

Validation: attributed public form GET returns 200 and the expected fields;
CRM simulations verify all 12 messages across the DST change, after-hours instant
acknowledgment, pause on reply, stop on opt-out, and no enrollment without consent.
All 15 contact/quote adapter tests pass using mocked HTTP. No live test submissions
or SMS were sent, and no database migrations were applied.

Production deployment `dpl_9cdQGwbvwzHzDAXks9X7qfRf74WA` is READY (October 20,
2026 at 02:31 UTC). The production TypeScript/Vite build passed. Verified HTTP 200
at `https://www.opekjunkremoval.com/quote` and the served assets contain the correct
form/connection IDs, email field and 31-day consent. Local browser inspection
confirmed the quote intake is usable without selecting SMS consent; no submission
was sent. Published message bodies and nominal cadence are recorded in
`docs/quote-sms-automation.json` for review; CRM remains the execution source.

## Retired dependencies (legacy website)

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
| Quote intake | Connected to current CRM public form and 31-day SMS sequence |
| Booking intake | CRM booking request adapter, collection and optional SMS acknowledgment live in production |
| Legacy booking estimate text delivery | `send-quote-sms` and retired DigitalOcean `/api/send`; Quote page uses CRM acknowledgment |
| Pricing / photo detection | `pricing_items`, `pricing_config`, `calculate-price`, `detect-items` |
| Deposits / receipts | Removed from current booking flows; historical Stripe endpoints still depend on legacy tables |
| Tracking / verification | `track_order`, `get_order_status_history`, `lookup-quote-otp` |
| Contact | Deployed: connected to current CRM public form API and instant SMS acknowledgment |
| In-home estimate | `in_home_estimates` |
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
configuration. The production deployment includes it for serverless functions. It protects `/api/create-booking`, but does not replace the missing database
integration. Consumers of that route must send `Authorization: Bearer <secret>`.

## Migration history

The two historical files with prefix `20260627000000` are intentionally unchanged.
The old database's applied history could not be read while it was inactive, so
renaming or repairing history would be unverified. These are not migrations for
the current shared CRM. Reconcile any future website migration against the owning
repository and live history before applying only its new, reviewed changes.
