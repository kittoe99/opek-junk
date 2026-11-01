import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// Run the standalone browser adapter with fake HTTP responses; never submit to the CRM.
const source = await readFile(new URL('../lib/crmContact.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { createContactSubmitter, CONTACT_FORM_URL } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const input = { name: ' Example Visitor ', phone: '(202) 555-0123', email: ' example@example.com ', subject: 'General question', message: ' Test enquiry ', smsOptIn: true, website: '' };
const accepted = (body, status = 201) => Response.json({ ok: true, submissionId: body.submissionId, duplicate: status === 200 }, { status });

test('maps contact fields, explicit consent and website attribution without credentials', async () => {
  const submit = createContactSubmitter(async (url, options) => {
    assert.equal(url, CONTACT_FORM_URL);
    assert.ok(new URL(url).searchParams.get('connection'));
    assert.deepEqual(options.headers, { 'Content-Type': 'application/json' });
    const body = JSON.parse(options.body);
    assert.equal(body.phone, '+12025550123');
    assert.equal(body.name, 'Example Visitor');
    assert.equal(body.email, 'example@example.com');
    assert.deepEqual(body.details, { subject: 'General question', message: 'Test enquiry' });
    assert.equal(body.smsOptIn, true);
    assert.equal(body.emailOptIn, false);
    return accepted(body);
  });
  await submit(input);
});

test('submits without inventing SMS consent', async () => {
  await createContactSubmitter(async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.smsOptIn, false);
    return accepted(body);
  })({ ...input, smsOptIn: false });
});

test('network retry reuses submission ID; changed content gets a new ID', async () => {
  const ids = [];
  const submit = createContactSubmitter(async (_url, options) => {
    const body = JSON.parse(options.body);
    ids.push(body.submissionId);
    if (ids.length === 1) throw new TypeError('Network lost after server accepted request');
    return accepted(body, 200);
  });
  await assert.rejects(submit(input), /couldn’t confirm/);
  await submit(input);
  await submit({ ...input, message: 'A different enquiry' });
  assert.equal(ids[0], ids[1]);
  assert.notEqual(ids[1], ids[2]);
});

test('double submission shares the in-flight request', async () => {
  let resolve;
  let count = 0;
  const submit = createContactSubmitter((_url, options) => {
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
    await assert.rejects(createContactSubmitter(async () => response)(input));
  }
});

test('invalid phone, blank message and unknown topic are rejected before HTTP', () => {
  const submit = createContactSubmitter(() => { throw new Error('HTTP must not run'); });
  for (const override of [{ phone: '12345678' }, { message: ' ' }, { subject: 'invalid' }]) {
    assert.throws(() => submit({ ...input, ...override }), /Please/);
  }
});

test('explicit international country code is preserved', async () => {
  await createContactSubmitter(async (_url, options) => {
    const body = JSON.parse(options.body);
    assert.equal(body.phone, '+442079460123');
    return accepted(body);
  })({ ...input, phone: '+44 20 7946 0123' });
});
