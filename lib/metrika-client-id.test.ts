import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { getMetrikaClientId, isValidClientId, requestMetrikaClientId, resetMetrikaClientId } from './metrika-client-id.ts'
import { installBrowser, type FakeBrowser } from './__test__/browser-env.ts'

let browser: FakeBrowser | null = null
afterEach(() => {
  browser?.restore()
  browser = null
  resetMetrikaClientId()
})

test('ClientID is requested through the official getClientID API and cached as a string', () => {
  browser = installBrowser({ url: 'https://driveset.ru/' })
  requestMetrikaClientId(113053562)
  assert.equal(browser.ymCalls.length, 1)
  assert.deepEqual(browser.ymCalls[0].slice(0, 2), [113053562, 'getClientID'])
  assert.equal(getMetrikaClientId(), null) // not answered yet — nothing waits for it
  browser.clientIdCallbacks[0]('18446744073709551615') // UInt64 max: beyond the JS safe-integer range
  assert.equal(getMetrikaClientId(), '18446744073709551615')
  assert.equal(typeof getMetrikaClientId(), 'string')
})

test('it asks once per page load', () => {
  browser = installBrowser({ url: 'https://driveset.ru/' })
  requestMetrikaClientId(1)
  requestMetrikaClientId(1)
  requestMetrikaClientId(1)
  assert.equal(browser.ymCalls.length, 1)
})

test('invalid ClientIDs are discarded (numbers, junk, empty, too long)', () => {
  for (const bad of [1712345678901234567, 'abc', '12a', '', ' ', '-1', '1.5', '123456789012345678901', null, undefined, {}, ['1']]) {
    assert.equal(isValidClientId(bad), false)
    browser = installBrowser({ url: 'https://driveset.ru/' })
    requestMetrikaClientId(1)
    browser.clientIdCallbacks[0](bad)
    assert.equal(getMetrikaClientId(), null)
    browser.restore()
    resetMetrikaClientId()
  }
  assert.equal(isValidClientId('1'), true)
})

test('Metrika blocked / not loaded / throwing never throws and leaves the cache empty', () => {
  browser = installBrowser({ url: 'https://driveset.ru/', withYm: false })
  requestMetrikaClientId(1) // window.ym absent → no-op
  assert.equal(getMetrikaClientId(), null)
  browser.restore()
  resetMetrikaClientId()

  browser = installBrowser({ url: 'https://driveset.ru/', withYm: false })
  ;(globalThis as unknown as { window: Record<string, unknown> }).window.ym = () => { throw new Error('blocked') }
  assert.doesNotThrow(() => requestMetrikaClientId(1))
  assert.equal(getMetrikaClientId(), null)
})

test('a request made before window.ym exists can be repeated once it does', () => {
  browser = installBrowser({ url: 'https://driveset.ru/', withYm: false })
  requestMetrikaClientId(1) // too early
  const win = (globalThis as unknown as { window: Record<string, unknown> }).window
  const calls: unknown[][] = []
  win.ym = (...args: unknown[]) => void calls.push(args)
  requestMetrikaClientId(1)
  assert.equal(calls.length, 1)
})

test('a throwing ym does not consume the request: a later call retries and caches the ClientID', () => {
  browser = installBrowser({ url: 'https://driveset.ru/' })
  const working = window.ym
  window.ym = (() => { throw new Error('ym broken') }) as unknown as typeof window.ym
  assert.doesNotThrow(() => requestMetrikaClientId(1))
  assert.equal(browser.ymCalls.length, 0)
  window.ym = working
  requestMetrikaClientId(1)
  assert.equal(browser.ymCalls.length, 1)
  assert.deepEqual(browser.ymCalls[0].slice(0, 2), [1, 'getClientID'])
  browser.clientIdCallbacks[0]('12345')
  assert.equal(getMetrikaClientId(), '12345')
})
