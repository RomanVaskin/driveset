import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { installBrowser, type FakeBrowser } from './__test__/browser-env.ts'
import { captureFirstTouch, readFirstTouch, resetFirstTouchMemory } from './campaign-attribution.ts'
import { trackMarketingEvent } from './marketing-events.ts'
import { applyTestSessionMarker, resetTestSessionClient } from './test-session-client.ts'
import { GET as enter } from '../app/olnoo-test/route.ts'
import { issueTestSessionToken } from './test-session-token.ts'
import { readFileSync } from 'node:fs'

const COUNTER = 113053562
const g = globalThis as unknown as Record<string, unknown>
let browser: FakeBrowser
let savedFetch: unknown
let fetchCalls: string[]

function status(body: unknown, ok = true) {
  g.fetch = async (url: string) => {
    fetchCalls.push(String(url))
    return { ok, json: async () => body }
  }
}
const inOneHour = () => new Date(Date.now() + 3600_000).toISOString()
const params = () => browser.ymCalls.filter((c) => c[1] === 'params')

beforeEach(() => {
  browser = installBrowser({ url: 'https://driveset.ru/' })
  savedFetch = g.fetch
  fetchCalls = []
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = String(COUNTER)
  resetTestSessionClient()
  resetFirstTouchMemory()
})
afterEach(() => {
  browser.restore()
  g.fetch = savedFetch
  resetTestSessionClient()
})

test('normal visitor: the status is asked, no Metrika params, goal params unchanged', async () => {
  status({ test: false })
  assert.equal(await applyTestSessionMarker(COUNTER, '/'), false)
  assert.deepEqual(fetchCalls, ['/api/olnoo-test/status'])
  assert.deepEqual(params(), [])
  trackMarketingEvent('telegram_click')
  assert.deepEqual(browser.ymCalls.at(-1), [COUNTER, 'reachGoal', 'telegram_click', { channel: 'telegram' }])
})

test('test visitor: ym(counter, "params", { olnoo_traffic: "test" }) — visit params, never userParams', async () => {
  status({ test: true, expiresAt: inOneHour(), sessionId: 'sid' })
  assert.equal(await applyTestSessionMarker(COUNTER, '/'), true)
  assert.deepEqual(params(), [[COUNTER, 'params', { olnoo_traffic: 'test' }]])
  assert.ok(!browser.ymCalls.some((c) => c[1] === 'userParams'))
  const code = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8').split('\n').filter((l) => !l.trim().startsWith('//')).join('\n')
  assert.doesNotMatch(code('./test-session-client.ts') + code('../components/marketing-bootstrap.tsx') + code('./marketing-events.ts'), /userParams/) // comments aside, it is never called
})

test('no duplicates on re-render or the dev double-effect; one status request per page load; a new path re-marks', async () => {
  status({ test: true, expiresAt: inOneHour(), sessionId: 'sid' })
  await applyTestSessionMarker(COUNTER, '/')
  await applyTestSessionMarker(COUNTER, '/')
  await Promise.all([applyTestSessionMarker(COUNTER, '/'), applyTestSessionMarker(COUNTER, '/')])
  assert.equal(params().length, 1)
  assert.equal(fetchCalls.length, 1)
  await applyTestSessionMarker(COUNTER, '/okleyka-avto') // SPA navigation = a new hit
  assert.equal(params().length, 2)
  assert.equal(fetchCalls.length, 1)
})

test('nothing is marked before the status is known, and never when it fails, is malformed or has expired', async () => {
  let release!: (v: unknown) => void
  g.fetch = () => new Promise((resolve) => (release = resolve))
  const pending = applyTestSessionMarker(COUNTER, '/')
  await new Promise((r) => setTimeout(r, 5))
  assert.deepEqual(params(), []) // still waiting for the server: no marker yet
  release({ ok: true, json: async () => ({ test: true, expiresAt: inOneHour() }) })
  assert.equal(await pending, true)

  for (const body of [{ test: true }, { test: true, expiresAt: 'nope' }, { test: 'yes', expiresAt: inOneHour() }, null, 'x', { test: true, expiresAt: new Date(Date.now() - 1000).toISOString() }]) {
    resetTestSessionClient()
    browser.ymCalls.length = 0
    status(body)
    assert.equal(await applyTestSessionMarker(COUNTER, '/'), false, JSON.stringify(body))
    assert.deepEqual(params(), [])
  }
  resetTestSessionClient()
  status({ test: true, expiresAt: inOneHour() }, false) // HTTP error
  assert.equal(await applyTestSessionMarker(COUNTER, '/'), false)
  resetTestSessionClient()
  g.fetch = async () => {
    throw new Error('offline')
  }
  assert.equal(await applyTestSessionMarker(COUNTER, '/'), false) // never throws
})

test('without Metrika (no ym) nothing throws and the existing analytics keep working', async () => {
  browser.restore()
  browser = installBrowser({ url: 'https://driveset.ru/', withYm: false })
  status({ test: true, expiresAt: inOneHour() })
  assert.equal(await applyTestSessionMarker(COUNTER, '/'), false)
  assert.equal(trackMarketingEvent('lead_submit'), false)
})

test('goal params: olnoo_traffic is added only while a verified test session is active; package/channel are kept', async () => {
  status({ test: true, expiresAt: inOneHour() })
  trackMarketingEvent('package_selected', { package: 'full-ppf' })
  assert.deepEqual(browser.ymCalls.at(-1), [COUNTER, 'reachGoal', 'package_selected', { package: 'full-ppf' }]) // before the status: untouched
  await applyTestSessionMarker(COUNTER, '/')
  trackMarketingEvent('package_selected', { package: 'full-ppf' })
  trackMarketingEvent('telegram_click')
  assert.deepEqual(browser.ymCalls.at(-2), [COUNTER, 'reachGoal', 'package_selected', { package: 'full-ppf', olnoo_traffic: 'test' }])
  assert.deepEqual(browser.ymCalls.at(-1), [COUNTER, 'reachGoal', 'telegram_click', { channel: 'telegram', olnoo_traffic: 'test' }])
  resetTestSessionClient() // a normal visitor again
  trackMarketingEvent('phone_click')
  assert.deepEqual(browser.ymCalls.at(-1), [COUNTER, 'reachGoal', 'phone_click', { channel: 'phone' }])
})

// ---- first-touch / attribution ----------------------------------------------------------------------------

test('the signed link never reaches client code: the route answers a body-less 303 to "/", so first-touch starts on the clean URL', async () => {
  process.env.OLNOO_TEST_SECRET_DRIVESET = 'f'.repeat(64)
  const issued = issueTestSessionToken({ project: 'driveset', secret: 'f'.repeat(64), ttlSeconds: 600 })
  assert.ok(issued.ok)
  const r = await enter(new Request(`https://driveset.ru/olnoo-test?t=${issued.token}`))
  assert.deepEqual([r.status, r.headers.get('location'), r.body], [303, '/', null]) // no HTML, so no script can run on the signed URL
  // The browser follows the redirect: client analytics boot on the clean URL.
  browser.restore()
  browser = installBrowser({ url: `https://driveset.ru${r.headers.get('location')}`, referrer: '' })
  captureFirstTouch()
  const stored = JSON.stringify(readFirstTouch()) + JSON.stringify([...browser.store.entries()])
  assert.doesNotMatch(stored, /olnoo-test|olnoo-t1|[?&]t=|olnoo_test/)
  assert.equal(readFirstTouch()!.landing_url, 'https://driveset.ru/')
  assert.equal(readFirstTouch()!.landing_path, '/')
  delete process.env.OLNOO_TEST_SECRET_DRIVESET
})

test('the browser never stores the token or the marker: no localStorage writes by the Test Mode client', async () => {
  status({ test: true, expiresAt: inOneHour(), sessionId: 'sid' })
  await applyTestSessionMarker(COUNTER, '/')
  assert.equal(browser.store.size, 0)
})
