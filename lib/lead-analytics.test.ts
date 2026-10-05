import { test } from 'node:test'
import assert from 'node:assert/strict'
import { leadFingerprint, sanitizeLeadAnalytics, splitLeadBody } from './lead-analytics.ts'

const NOW = Date.parse('2026-10-05T12:00:00Z')
const UUID = '0b6f4c1e-5d4a-4f0e-9a3b-7c2d1e8f9a10'
const business = { name: '', phone: '+79990001122', contactChannel: 'phone', pagePath: '/okleyka-avto', utm_source: 'yandex', website: '' }

test('valid identifiers pass through (ClientID stays a string, UUID is lower-cased, time is normalised)', () => {
  const out = sanitizeLeadAnalytics(
    {
      lead_tracking_id: UUID.toUpperCase(), metrika_client_id: '18446744073709551615', yclid: ' 555 ',
      first_seen_at: '2026-10-04T21:00:00+03:00', landing_page: 'https://driveset.ru/okleyka-avto?utm_source=yandex', referrer: 'https://yandex.ru/',
    },
    NOW,
  )
  assert.deepEqual(out, {
    lead_tracking_id: UUID, metrika_client_id: '18446744073709551615', yclid: '555',
    first_seen_at: '2026-10-04T18:00:00.000Z', landing_page: 'https://driveset.ru/okleyka-avto?utm_source=yandex', referrer: 'https://yandex.ru/',
  })
})

test('invalid optional values are dropped one by one — they never reject the lead', () => {
  const out = sanitizeLeadAnalytics(
    {
      lead_tracking_id: 'not-a-uuid', metrika_client_id: 1712345678901234567, yclid: 'has space', first_seen_at: '2026-02-30T10:00:00Z',
      landing_page: 'javascript:alert(1)', referrer: 'x'.repeat(600),
    },
    NOW,
  )
  assert.deepEqual(out, {})
  // a bad value does not take the good ones with it
  assert.deepEqual(sanitizeLeadAnalytics({ lead_tracking_id: UUID, metrika_client_id: 'abc', yclid: '1'.repeat(201) }, NOW), { lead_tracking_id: UUID })
})

test('every validation rule', () => {
  const only = (k: string, v: unknown) => sanitizeLeadAnalytics({ [k]: v }, NOW)
  for (const v of ['12a', '', '123456789012345678901', '-1', '1.5']) assert.deepEqual(only('metrika_client_id', v), {})
  assert.deepEqual(only('metrika_client_id', '1'), { metrika_client_id: '1' })
  for (const v of ['a\nb', 'a\tb', 'a\u0000b', ' ', '']) assert.deepEqual(only('yclid', v), {})
  for (const v of ['2019-12-31T23:59:59Z', '2026-10-07T12:00:01Z', '2026-10-04T10:00:00', '2026-10-04', '2026-10-04T24:00:00Z', '2026-04-31T10:00:00Z', 'yesterday', 123]) {
    assert.deepEqual(only('first_seen_at', v), {}, String(v))
  }
  assert.deepEqual(only('first_seen_at', '2026-10-06T11:59:59Z'), { first_seen_at: '2026-10-06T11:59:59.000Z' })
  for (const v of ['/relative', 'ftp://x', 'https://a b', 'data:text/html,x', {}, null]) assert.deepEqual(only('landing_page', v), {})
})

test('splitLeadBody: analytics keys leave the business body, everything else (even unknown keys) stays for the strict check', () => {
  const split = splitLeadBody({ ...business, lead_tracking_id: UUID, metrika_client_id: '42', first_seen_at: '2026-10-04T10:00:00Z', landing_page: 'https://driveset.ru/', referrer: '', yclid: '9', surprise: 'x' }, NOW)
  assert.deepEqual(split.business, { ...business, surprise: 'x' }) // unknown key still present → parseLead rejects it as before
  assert.deepEqual(split.analytics, { lead_tracking_id: UUID, metrika_client_id: '42', first_seen_at: '2026-10-04T10:00:00.000Z', landing_page: 'https://driveset.ru/', yclid: '9' })
})

test('backward compatibility: a body without any new field is untouched', () => {
  const split = splitLeadBody(business, NOW)
  assert.deepEqual(split.business, business)
  assert.deepEqual(split.analytics, {})
  assert.deepEqual(splitLeadBody(null, NOW), { business: null, analytics: {} })
  assert.deepEqual(splitLeadBody([1], NOW), { business: [1], analytics: {} })
  assert.deepEqual(splitLeadBody('x', NOW), { business: 'x', analytics: {} })
})

test('duplicate fingerprint ignores analytics metadata: the same business request has one fingerprint', () => {
  const a = splitLeadBody({ ...business }, NOW)
  const b = splitLeadBody({ ...business, lead_tracking_id: UUID, metrika_client_id: '777', yclid: '1', first_seen_at: '2026-10-04T10:00:00Z', landing_page: 'https://driveset.ru/x', referrer: 'https://yandex.ru/' }, NOW)
  const c = splitLeadBody({ ...business, lead_tracking_id: '11111111-1111-4111-8111-111111111111', metrika_client_id: '888' }, NOW)
  const fp = (s: { business: unknown }) => leadFingerprint('1.2.3.4', s.business)
  assert.equal(fp(a), fp(b))
  assert.equal(fp(a), fp(c))
  // …while a different business request or a different ip still differs (spam protection intact)
  assert.notEqual(fp(a), leadFingerprint('1.2.3.4', { ...business, phone: '+79990009999' }))
  assert.notEqual(fp(a), leadFingerprint('5.6.7.8', business))
})

test('no identifier value reaches the console while sanitising invalid input', () => {
  const captured: string[] = []
  const originals = { log: console.log, info: console.info, warn: console.warn, error: console.error }
  for (const k of Object.keys(originals) as (keyof typeof originals)[]) console[k] = (...a: unknown[]) => void captured.push(a.map(String).join(' '))
  try {
    sanitizeLeadAnalytics({ lead_tracking_id: 'SECRET-TRACK', metrika_client_id: 'SECRET-CID', yclid: 'SECRET YCLID' }, NOW)
  } finally {
    Object.assign(console, originals)
  }
  assert.deepEqual(captured, [])
})
