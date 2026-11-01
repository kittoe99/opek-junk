# Booking integration — October 22, 2026

## Current configuration

- Business: **Opek Junk Removal**, `biz-1c0c09ce-819e-4795-86b9-0e457ab92f58`.
- CRM form: `3c69393f-38e0-45ae-bfc6-eededfab8efa`, bookings preset, applied
  revision 4, collection enabled, separate saved draft revision 3.
- Website: `f6201771-9798-44cb-85dc-e8c737329aa4`; connection
  `699d41fd-a0d9-4a76-a367-0952d581cfe3`. Both belong to the same Opek business.
- SMS: form automation revision 4, published version 1, enabled. Existing
  business sender +1 877 757 4365. Final CRM read reports no readiness blockers.
- No new availability schedule, operational appointment, payment or historical
  SMS enrollment was created. No database migration was applied. The website
  was released to Vercel production on October 22, 2026.

The main booking and mattress flows now use `lib/crmBooking.ts` in production. The
deposit and card screens are removed from these flows at the user's request.
The pricing and moving options remain in place. Estimate steps no longer call
legacy prebooking or SMS endpoints; complete requests are saved at final review.

## Data and customer experience

The adapter sends fixed name, normalized E.164 phone, email and appointmentAt
fields. Details contain service, service address/unit/city/state/ZIP, preferred
date, arrival window, items, estimated price/summary, optional moving drop-off
address, crew/truck/access details, notes and explicit terms acceptance.

Arrival windows are explicitly **America/Denver** business time. The start of
the requested window is sent as a local datetime without an offset; the CRM
handler converts it using the business timezone, including DST. The adapter
rejects invalid dates and windows already started. Windows are requests, not
capacity-checked reservations. Staff must confirm availability and final pricing.

SMS consent is optional and unchecked. Legacy marketing-consent timestamps
are not interpreted as fresh booking consent. Email automation consent is false.
Terms acceptance is required separately. Success requires HTTP acceptance with
the matching CRM submission UUID, which is displayed as a request reference.
There is no generated order number, claimed email confirmation or fake success.
Concurrent clicks share a request. Unchanged uncertain retries reuse their UUID
while the form remains mounted; a page reload does not retain that identity.

The CRM public endpoint accepts at most 16 KiB and does not provide an upload
contract. Booking no longer asks for a required photo that cannot be stored;
item/estimate details are sent instead. Historical photo/payment APIs remain
outside this migration. Legacy phone-based quote recovery and order tracking
still need supported CRM replacements. Completing a request does not stop an
existing CRM quote follow-up sequence.

## Automation

One zero-delay acknowledgment runs on future consented submissions, including
outside the usual 9 AM–6 PM Mountain sending window. AI replies are disabled
for this automation, replies pause it, and STOP remains handled by CRM.

> Hi {{first_name}}, Opek Junk Removal received your {{field.service_type}}
> booking request for {{field.preferred_date}}, {{field.arrival_window}}
> Mountain Time. Your estimate is {{field.estimated_price}}. Our team will
> confirm availability and final pricing. Reply STOP to opt out.

This acknowledges a request and does not claim confirmation. There are no
automatic appointment reminders or later sales messages in this sequence.
CRM currently supports one form sequence; confirmed appointment reminders need
a confirmed-booking workflow before they can be connected accurately.
Provider processing, consent/suppression checks and carrier delivery still apply.

## Verification

- Attributed public GET: HTTP 200, correct business, 15 custom fields, bookings
  preset, America/Denver timezone and matching optional SMS consent text.
- CRM simulations: after-hours immediate acknowledgment, junk removal,
  mattress disposal and moving estimate substitution, and no message without
  consent. Published-rule simulation reports no readiness blockers.
- 23 mocked contact/quote/booking adapter tests passed, including CRM errors,
  invalid responses, retry/concurrency behavior, field/body limits, required
  terms, service mapping and dates around the November DST change.
- Production TypeScript/Vite build passed. Main and mattress browser checks reached final
  review with SMS unchecked, verified addresses and no payment screen. No final
  submission was sent, no customer record created, and no SMS sent for testing.

CRM settings and website changes are live. Vercel production deployment
`dpl_BZ3RkYKaL3LjUvf3WA7h6irwEnWr` is READY and serves
`https://www.opekjunkremoval.com`. Released October 22, 2026 at 11:15 AM Mountain
Time. Home, booking, mattress, quote and contact routes returned HTTP 200.
Served JavaScript contains the new booking form/connection IDs and the separate
quote form/connection IDs. Production booking page rendered successfully.
No customer submission or delivery test was sent during release verification.
