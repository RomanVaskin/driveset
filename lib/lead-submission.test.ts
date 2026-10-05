import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'
import { installBrowser, type FakeBrowser } from './__test__/browser-env.ts'
import { resetFirstTouchMemory } from './campaign-attribution.ts'
import { releaseLeadTrackingId } from './lead-tracking.ts'
import { submitLead, type LeadDraft } from './lead-submission.ts'
import { requestMetrikaClientId, resetMetrikaClientId } from './metrika-client-id.ts'

const draft: LeadDraft = { name: 'Иван', phone: '+79990000000', contactChannel: 'telegram', website: '' }
const COUNTER = 113053562
const g = globalThis as unknown as Record<string, unknown>

type Call = { body: Record<string, unknown> }
let browser: FakeBrowser
let calls: Call[]
let responses: (() => Response | Promise<Response>)[]
let savedFetch: unknown
let savedCrypto: PropertyDescriptor | undefined
let savedEnv: string | undefined
let logged: unknown[][]
const savedConsole = { log: console.log, info: console.info, warn: console.warn, error: console.error }

const created = () => new Response(JSON.stringify({ ok: true }), { status: 201 })

function setup(options: Parameters<typeof installBrowser>[0]) {
  browser = installBrowser(options)
}

beforeEach(() => {
  calls = []
  responses = []
  logged = []
  savedEnv = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = String(COUNTER)
  savedFetch = g.fetch
  savedCrypto = Object.getOwnPropertyDescriptor(globalThis, 'crypto')
  g.fetch = async (_url: string, init: { body: string }) => {
    calls.push({ body: JSON.parse(init.body) })
    const next = responses.shift()
    return next ? next() : created()
  }
  for (const k of ['log', 'info', 'warn', 'error'] as const) console[k] = (...a: unknown[]) => void logged.push(a)
  resetFirstTouchMemory()
  resetMetrikaClientId()
  releaseLeadTrackingId()
})

afterEach(() => {
  browser?.restore()
  g.fetch = savedFetch
  if (savedCrypto) Object.defineProperty(globalThis, 'crypto', savedCrypto)
  if (savedEnv === undefined) delete process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
  else process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = savedEnv
  Object.assign(console, savedConsole)
})

const goals = () => browser.ymCalls.filter((c) => c[1] === 'reachGoal')

describe('submitLead analytics', () => {
  it('sends first-touch landing_page while pagePath is the submit page', async () => {
    setup({ url: 'https://driveset.ru/landing?utm_source=yandex&yclid=77', referrer: 'https://ya.ru/' })
    const { captureFirstTouch } = await import('./campaign-attribution.ts')
    captureFirstTouch()
    browser.navigate('https://driveset.ru/wrapping')
    const result = await submitLead(draft)
    assert.equal(result.ok, true)
    const body = calls[0].body
    assert.equal(body.landing_page, 'https://driveset.ru/landing?utm_source=yandex&yclid=77')
    assert.equal(body.pagePath, '/wrapping')
    assert.equal(body.yclid, '77')
    assert.equal(body.referrer, 'https://ya.ru/')
    assert.match(String(body.first_seen_at), /^\d{4}-\d\d-\d\dT/)
  })

  it('reuses lead_tracking_id on retry after a network error, new one after a confirmed 201', async () => {
    setup({ url: 'https://driveset.ru/' })
    responses.push(() => { throw new Error('network') })
    const failed = await submitLead(draft)
    assert.equal(failed.ok, false)
    const retry = await submitLead(draft)
    assert.equal(retry.ok, true)
    assert.equal(calls[0].body.lead_tracking_id, calls[1].body.lead_tracking_id)
    assert.ok(calls[0].body.lead_tracking_id)
    await submitLead(draft)
    assert.notEqual(calls[2].body.lead_tracking_id, calls[1].body.lead_tracking_id)
  })

  it('keeps the tracking id after a non-201 response', async () => {
    setup({ url: 'https://driveset.ru/' })
    responses.push(() => new Response(JSON.stringify({ error: 'busy' }), { status: 502 }))
    await submitLead(draft)
    await submitLead(draft)
    assert.equal(calls[0].body.lead_tracking_id, calls[1].body.lead_tracking_id)
  })

  it('omits lead_tracking_id when crypto.randomUUID is unavailable and still submits', async () => {
    setup({ url: 'https://driveset.ru/' })
    Object.defineProperty(globalThis, 'crypto', { value: {}, configurable: true })
    const result = await submitLead(draft)
    assert.equal(result.ok, true)
    assert.equal('lead_tracking_id' in calls[0].body, false)
  })

  it('does not wait for ClientID: no callback → submit still goes out without metrika_client_id', async () => {
    setup({ url: 'https://driveset.ru/' })
    requestMetrikaClientId(COUNTER)
    const result = await submitLead(draft)
    assert.equal(result.ok, true)
    assert.equal('metrika_client_id' in calls[0].body, false)
  })

  it('sends a ClientID that arrived as a string; discards an invalid one', async () => {
    setup({ url: 'https://driveset.ru/' })
    requestMetrikaClientId(COUNTER)
    browser.clientIdCallbacks[0]('1700000000123456789')
    await submitLead(draft)
    assert.equal(calls[0].body.metrika_client_id, '1700000000123456789')

    resetMetrikaClientId()
    requestMetrikaClientId(COUNTER)
    browser.clientIdCallbacks[browser.clientIdCallbacks.length - 1](1700000000123 as unknown)
    await submitLead(draft)
    assert.equal('metrika_client_id' in calls[1].body, false)
  })

  it('still submits when localStorage throws', async () => {
    setup({ url: 'https://driveset.ru/?utm_source=x', storage: 'throws' })
    const result = await submitLead(draft)
    assert.equal(result.ok, true)
    assert.equal(calls[0].body.landing_page, 'https://driveset.ru/?utm_source=x')
  })

  it('fires the lead goal with empty params only after 201, none on failure', async () => {
    setup({ url: 'https://driveset.ru/' })
    responses.push(() => new Response(JSON.stringify({ error: 'x' }), { status: 400 }))
    await submitLead(draft)
    assert.equal(goals().length, 0)
    await submitLead(draft, 'polirovka_lead_submit')
    assert.equal(goals().length, 1)
    assert.deepEqual(goals()[0].slice(2), ['polirovka_lead_submit', {}])
  })

  it('never writes identifiers to the console or into goal params', async () => {
    setup({ url: 'https://driveset.ru/?yclid=999' })
    requestMetrikaClientId(COUNTER)
    browser.clientIdCallbacks[0]('1234567890')
    await submitLead(draft)
    const text = JSON.stringify(logged) + JSON.stringify(browser.ymCalls.filter((c) => c[1] === 'reachGoal'))
    for (const secret of ['999', '1234567890', String(calls[0].body.lead_tracking_id)]) assert.equal(text.includes(secret), false)
  })
})
