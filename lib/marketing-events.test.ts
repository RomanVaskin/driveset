import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { trackMarketingEvent } from './marketing-events.ts'

type Call = unknown[]
let calls: Call[]

beforeEach(() => {
  calls = []
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = '113053562'
  ;(globalThis as { window?: unknown }).window = { ym: (...args: unknown[]) => calls.push(args) }
})

test('contact events reach window.ym as reachGoal with the exact goal id and channel', () => {
  assert.equal(trackMarketingEvent('telegram_click'), true)
  assert.equal(trackMarketingEvent('phone_click'), true)
  assert.equal(trackMarketingEvent('max_click'), true)
  assert.deepEqual(calls, [
    [113053562, 'reachGoal', 'telegram_click', { channel: 'telegram' }],
    [113053562, 'reachGoal', 'phone_click', { channel: 'phone' }],
    [113053562, 'reachGoal', 'max_click', { channel: 'max' }],
  ])
})

test('quiz events keep their payloads', () => {
  trackMarketingEvent('quiz_start')
  trackMarketingEvent('package_selected', { package: 'definitely-not-a-package' })
  assert.deepEqual(calls[0], [113053562, 'reachGoal', 'quiz_start', {}])
  assert.deepEqual(calls[1], [113053562, 'reachGoal', 'package_selected', {}])
})

test('callback is forwarded to Metrika', () => {
  const cb = () => {}
  trackMarketingEvent('telegram_click', {}, cb)
  assert.equal(calls[0][4], cb)
})

test('nothing is sent without a counter id or window.ym', () => {
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = ''
  assert.equal(trackMarketingEvent('phone_click'), false)
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = '113053562'
  ;(globalThis as { window?: unknown }).window = {}
  assert.equal(trackMarketingEvent('phone_click'), false)
  assert.equal(calls.length, 0)
})

test('a throwing ym never breaks the caller', () => {
  ;(globalThis as { window?: unknown }).window = { ym: () => { throw new Error('blocked') } }
  assert.equal(trackMarketingEvent('phone_click'), false)
})
