import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// Run the standalone browser adapter with fake HTTP responses; never submit to the CRM.
const source = await readFile(new URL('../lib/crmQuote.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { createQuoteSubmitter, QUOTE_FORM_URL } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const input = { name: ' Example Visitor ', phone: '(202) 555-0123', email: ' example@example.com ', serviceType: 'Junk Removal', zipCode: '80202', items: ['1x Sofa'], price: 150, summary: 'Website estimate', volume: 'A few items', smsOptIn: true, website: '' };
const accepted = (body, status = 201) => Response.json({ ok: true, submissionId: body.submissionId, duplicate: status === 200 }, { status });

test('maps quote fields, explicit consent and website attribution without credentials', async () => {
  const submit = createQuoteSubmitter(async (url, options) => {
    assert.equal(url, QUOTE_FORM_URL);
    assert.ok(new URL(url).searchParams.get('connection'));
    assert.deepEqual(options.headers, { 'Content-Type': 'application/json' });
    const body = JSON.parse(options.body);
    assert.equal(body.phone, '+12025550123');
    assert.equal(body.name, 'Example Visitor');
    assert.equal(body.email, 'example@example.com');
    assert.deepEqual(body.details, { items_to_remove: '1x Sofa', pickup_location: '80202', service_type: 'Junk Removal', estimated_price: '$150.00', estimate_summary: 'A few items\nWebsite estimate' });
    assert.equal(body.smsOptIn, true);
    assert.equal(body.emailOptIn, false);
    return accepted(body);
  });
  await submit(input);
});

test('submits without inventing SMS consent', async () => {
  await createQuoteSubmitter(async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.smsOptIn, false);
    return accepted(body);
  })({ ...input, smsOptIn: false });
});

test('network retry reuses submission ID; changed content gets a new ID', async () => {
  const ids = [];
  const submit = createQuoteSubmitter(async (_url, options) => {
    const body = JSON.parse(options.body);
    ids.push(body.submissionId);
    if (ids.length === 1) throw new TypeError('Network lost after server accepted request');
    return accepted(body, 200);
  });
  await assert.rejects(submit(input), /couldn’t confirm/);
  await submit(input);
  await submit({ ...input, items: ['2x Sofa'] });
  assert.equal(ids[0], ids[1]);
  assert.notEqual(ids[1], ids[2]);
});

test('double submission shares the in-flight request', async () => {
  let resolve;
  let count = 0;
  const submit = createQuoteSubmitter((_url, options) => {
    count++;
    return new Promise(done => { resolve = () => done(accepted(JSON.parse(options.body))); });
  });
  const first = submit(input);
  const second = submit(input);
  assert.equal(first, second);
  resolve();
  await first;
  assert.equal(count, 1);
});

test('rate limits, malformed responses and mismatched IDs never display success', async () => {
  for (const response of [Response.json({}, { status: 429 }), new Response('<html>error</html>'), Response.json({ ok: true, submissionId: 'wrong-id' }), Response.json(null), Response.json({ ok: false }, { status: 503 })]) {
    await assert.rejects(createQuoteSubmitter(async () => response)(input));
  }
});

test('invalid phone, empty items, missing email and unknown service are rejected before HTTP', () => {
  const submit = createQuoteSubmitter(() => { throw new Error('HTTP must not run'); });
  for (const override of [{ phone: '12345678' }, { items: [] }, { email: '' }, { serviceType: 'invalid' }, { zipCode: '' }, { price: NaN }]) {
    assert.throws(() => submit({ ...input, ...override }), /Please/);
  }
});

test('explicit international country code is preserved', async () => {
  await createQuoteSubmitter(async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.phone, '+442079460123');
    return accepted(body);
  })({ ...input, phone: '+44 20 7946 0123' });
});


test('every Quote page service maps to an accepted CRM service', async () => {
  for (const [serviceType, expected] of [['Junk Removal', 'Junk Removal'], ['Moving Labor', 'Local Moving'], ['Local Moving', 'Local Moving'], ['Dumpster Rental', 'Dumpster Rental'], ['Donation Pick Up', 'Donation Pick Up']]) {
    await createQuoteSubmitter(async (_url, options) => {
      const body = JSON.parse(options.body);
      assert.equal(body.details.service_type, expected);
      return accepted(body);
    })({ ...input, serviceType });
  }
});
