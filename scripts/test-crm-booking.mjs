import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// Fake HTTP only: never create customer records, charge a card or send SMS.
const source = await readFile(new URL('../lib/crmBooking.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { bookingPayload, bookingLocalNow, createBookingSubmitter, BOOKING_FORM_URL } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const now = new Date('2026-10-22T12:00:00Z');
const input = { name: ' Example Customer ', phone: '(202) 555-0123', email: ' test@example.com ',
  serviceType: 'Junk Removal', address: '123 Example St', unitNumber: '2', city: 'Denver', state: 'CO', zipCode: '80202',
  date: '2099-11-02', timeSlot: 'morning', items: ['1x Sofa'], price: 169, summary: 'Website estimate', volume: 'A few items',
  smsOptIn: false, termsAccepted: true };
const accepted = body => Response.json({ ok: true, submissionId: body.submissionId });

test('maps booking to the Opek connected form and never sends payment fields or credentials', async () => {
  await createBookingSubmitter(async (url, options) => {
    assert.equal(url, BOOKING_FORM_URL);
    assert.ok(url.includes('3c69393f-38e0-45ae-bfc6-eededfab8efa?connection=699d41fd-a0d9-4a76-a367-0952d581cfe3'));
    assert.deepEqual(options.headers, { 'Content-Type': 'application/json' });
    const body = JSON.parse(options.body);
    assert.equal(body.name, 'Example Customer');
    assert.equal(body.phone, '+12025550123');
    assert.equal(body.email, 'test@example.com');
    assert.equal(body.appointmentAt, '2099-11-02T08:00');
    assert.equal(body.details.estimated_price, '$169.00');
    assert.equal(body.details.arrival_window, 'Morning (8am – 12pm)');
    assert.equal(body.details.terms_accepted, true);
    assert.equal(body.smsOptIn, false);
    assert.equal(body.emailOptIn, false);
    assert.ok(!/stripe|deposit|paymentIntent/i.test(options.body));
    return accepted(body);
  })(input);
});

test('supports mattress and moving details without losing the drop-off address', () => {
  for (const serviceType of ['Mattress Disposal', 'Moving Labor']) {
    const body = bookingPayload({ ...input, serviceType, dropoffAddress: '456 Example Rd, Denver CO 80203', movingDetails: '2 helpers; ground floor; customer truck', smsOptIn: true }, now);
    assert.equal(body.details.service_type, serviceType === 'Moving Labor' ? 'Local Moving' : serviceType);
    assert.equal(body.details.dropoff_address, '456 Example Rd, Denver CO 80203');
    assert.equal(body.smsOptIn, true);
  }
});

test('arrival times stay in business local time across DST and browser timezones', () => {
  assert.equal(bookingLocalNow(new Date('2026-10-31T14:00:00Z')), '2026-10-31T08:00');
  assert.equal(bookingLocalNow(new Date('2026-11-02T15:00:00Z')), '2026-11-02T08:00');
  for (const date of ['2026-10-31', '2026-11-02']) {
    assert.equal(bookingPayload({ ...input, date }, now).appointmentAt, `${date}T08:00`);
  }
});

test('rejects missing terms, invalid dates, past windows, service and malformed contacts before HTTP', () => {
  for (const override of [{ termsAccepted: false }, { date: '2026-02-30' }, { date: '2026-10-21' },
    { date: '2026-10-22', timeSlot: 'morning' }, { timeSlot: '' }, { timeSlot: 'bad' }, { name: '' },
    { email: '' }, { phone: '123' }, { zipCode: '123' }, { address: '' }, { items: [] }, { price: NaN }, { serviceType: 'invalid' }]) {
    const at = new Date('2026-10-22T16:00:00Z');
    assert.throws(() => bookingPayload({ ...input, ...override }, at), /Please/);
  }
});

test('validates CRM field and request byte limits without silently truncating customer details', () => {
  for (const override of [{ address: 'a'.repeat(301) }, { notes: 'a'.repeat(2001) },
    { notes: '😀'.repeat(1000), summary: '😀'.repeat(1000), movingDetails: '😀'.repeat(1000) }]) {
    assert.throws(() => bookingPayload({ ...input, ...override }, now), /Please/);
  }
});

test('uncertain retries reuse the UUID, changed details get a new UUID, and success returns the CRM reference', async () => {
  const ids = [];
  const submit = createBookingSubmitter(async (_url, options) => {
    const body = JSON.parse(options.body); ids.push(body.submissionId);
    if (ids.length === 1) throw new TypeError('Network lost after acceptance');
    return accepted(body);
  });
  await assert.rejects(submit(input), /couldn’t confirm/);
  assert.equal(await submit(input), ids[0]);
  await submit({ ...input, notes: 'Use side gate' });
  assert.equal(ids[0], ids[1]); assert.notEqual(ids[1], ids[2]);
});

test('concurrent clicks share one request', async () => {
  let finish, count = 0;
  const submit = createBookingSubmitter(async (_url, options) => {
    count++;
    return new Promise(resolve => { finish = () => resolve(accepted(JSON.parse(options.body))); });
  });
  const first = submit(input), second = submit(input);
  assert.equal(first, second); finish(); await first; assert.equal(count, 1);
});

test('CRM rejection, malformed responses and rate limits never report booking success', async () => {
  for (const response of [Response.json({}, { status: 429 }), new Response('<html>error</html>'),
    Response.json({ ok: true, submissionId: 'wrong-id' }), Response.json(null), Response.json({ ok: false }, { status: 503 })]) {
    await assert.rejects(createBookingSubmitter(async () => response)(input));
  }
});
