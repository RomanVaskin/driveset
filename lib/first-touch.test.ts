import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { buildTouch, chooseTouch, hasCampaignParams, parseStoredTouch, touchToLeadFields } from './first-touch.ts'
import { captureFirstTouch, readFirstTouch, resetFirstTouchMemory } from './campaign-attribution.ts'
import { installBrowser, type FakeBrowser } from './__test__/browser-env.ts'

const KEY = 'driveset_first_touch'
let browser: FakeBrowser | null = null
afterEach(() => {
  browser?.restore()
  browser = null
  resetFirstTouchMemory()
})

const T1 = Date.parse('2026-10-05T10:00:00Z')
const T2 = Date.parse('2026-10-06T11:30:00Z')
const T3 = Date.parse('2026-10-07T09:15:00Z')
const PAID_A = 'https://driveset.ru/okleyka-avto?utm_source=yandex&utm_medium=cpc&utm_campaign=714796268&utm_content=1922&utm_term=ppf&yclid=555#hero'
const PAID_B = 'https://driveset.ru/polirovka-avto?utm_source=google&utm_campaign=other'

test('first touch is stored atomically with every field (fragment dropped, query kept)', () => {
  browser = installBrowser({ url: PAID_A, referrer: 'https://yandex.ru/search?text=x' })
  const touch = captureFirstTouch(T1)!
  assert.deepEqual(touch, {
    landing_url: 'https://driveset.ru/okleyka-avto?utm_source=yandex&utm_medium=cpc&utm_campaign=714796268&utm_content=1922&utm_term=ppf&yclid=555',
    landing_path: '/okleyka-avto',
    referrer: 'https://yandex.ru/search?text=x',
    first_seen_at: '2026-10-05T10:00:00.000Z',
    utm_source: 'yandex', utm_medium: 'cpc', utm_campaign: '714796268', utm_content: '1922', utm_term: 'ppf', yclid: '555',
  })
  // one JSON object in localStorage, nothing in sessionStorage
  assert.deepEqual(JSON.parse(browser.store.get(KEY)!), touch)
  assert.equal(browser.store.size, 1)
})

test('fields of different visits are never mixed (a later visit with other params keeps the stored touch whole)', () => {
  browser = installBrowser({ url: PAID_A, referrer: 'https://yandex.ru/' })
  const first = captureFirstTouch(T1)!
  browser.navigate(PAID_B, 'https://google.com/')
  const second = captureFirstTouch(T2)!
  assert.deepEqual(second, first) // paid touch is not overwritten
  assert.equal(second.utm_source, 'yandex')
  assert.equal(second.utm_campaign, '714796268') // not "other"
  assert.equal(second.referrer, 'https://yandex.ru/')
  assert.equal(second.first_seen_at, '2026-10-05T10:00:00.000Z') // not refreshed by later page views
})

test('a paid touch survives later organic/direct visits and repeated page views', () => {
  browser = installBrowser({ url: PAID_A })
  const first = captureFirstTouch(T1)!
  browser.navigate('https://driveset.ru/', '')
  assert.deepEqual(captureFirstTouch(T2), first)
  assert.deepEqual(captureFirstTouch(T3), first)
  assert.deepEqual(readFirstTouch(), first)
})

test('organic/direct touch is replaced ONCE, as a whole, by a later paid touch', () => {
  browser = installBrowser({ url: 'https://driveset.ru/#top', referrer: 'https://www.google.com/' })
  const organic = captureFirstTouch(T1)!
  assert.equal(hasCampaignParams(organic), false)
  assert.equal(organic.referrer, 'https://www.google.com/')

  // another organic visit does not replace it
  browser.navigate('https://driveset.ru/polirovka-avto', '')
  assert.deepEqual(captureFirstTouch(T2), organic)

  // the paid visit replaces it entirely: new landing, referrer, campaign fields and a NEW first_seen_at
  browser.navigate(PAID_A, 'https://yandex.ru/')
  const paid = captureFirstTouch(T3)!
  assert.equal(paid.landing_path, '/okleyka-avto')
  assert.equal(paid.referrer, 'https://yandex.ru/')
  assert.equal(paid.first_seen_at, '2026-10-07T09:15:00.000Z')
  assert.equal(paid.utm_campaign, '714796268')
  assert.deepEqual(JSON.parse(browser.store.get(KEY)!), paid)

  // and then it is final
  browser.navigate(PAID_B, 'https://google.com/')
  assert.deepEqual(captureFirstTouch(Date.now()), paid)
})

test('yclid is stored only when the URL carried one', () => {
  browser = installBrowser({ url: 'https://driveset.ru/okleyka-avto?utm_source=yandex&utm_medium=cpc' })
  const touch = captureFirstTouch(T1)!
  assert.equal('yclid' in touch, false)
  assert.equal('yclid' in touchToLeadFields(touch), false)
  const withYclid = buildTouch({ href: 'https://driveset.ru/?yclid=987', referrer: '', now: T1 })!
  assert.equal(withYclid.yclid, '987')
  assert.equal(hasCampaignParams(withYclid), true)
})

test('first_seen_at is the real client time of the touch and belongs to the whole touch', () => {
  browser = installBrowser({ url: PAID_A })
  const touch = captureFirstTouch(T1)!
  assert.equal(touch.first_seen_at, new Date(T1).toISOString())
  assert.equal(touchToLeadFields(touch).first_seen_at, '2026-10-05T10:00:00.000Z')
})

test('landing_page comes from the touch, never from the current (submit) page', () => {
  browser = installBrowser({ url: PAID_A })
  captureFirstTouch(T1)
  browser.navigate('https://driveset.ru/himchistka-avto', '')
  const fields = touchToLeadFields(readFirstTouch())
  assert.match(fields.landing_page, /^https:\/\/driveset\.ru\/okleyka-avto\?utm_source=yandex/)
  assert.ok(!fields.landing_page.includes('himchistka'))
})

test('localStorage failure is safe: no throw, the touch lives in memory for the page', () => {
  browser = installBrowser({ url: PAID_A, storage: 'throws' })
  const touch = captureFirstTouch(T1)
  assert.equal(touch?.utm_campaign, '714796268')
  assert.deepEqual(readFirstTouch(), touch) // served from memory
  browser.navigate(PAID_B)
  assert.deepEqual(captureFirstTouch(T2), touch) // rules still apply
})

test('corrupt or foreign stored data is treated as "nothing stored"; the old sessionStorage record is ignored', () => {
  browser = installBrowser({ url: PAID_A })
  for (const junk of ['not json', '{}', '[]', 'null', JSON.stringify({ landing_url: 1 }), JSON.stringify({ landing_url: 'u', landing_path: 'p', referrer: '', first_seen_at: 'nope' })]) {
    assert.equal(parseStoredTouch(junk), null)
    browser.store.set(KEY, junk)
    resetFirstTouchMemory()
    assert.equal(captureFirstTouch(T1)?.utm_campaign, '714796268') // replaced by the current touch
  }
  assert.equal(readFirstTouch() !== null, true)
})

test('values are trimmed and bounded; unknown stored keys are dropped', () => {
  const touch = buildTouch({ href: `https://driveset.ru/p?utm_source=%20yandex%20&utm_term=${'x'.repeat(300)}`, referrer: '  ', now: T1 })!
  assert.equal(touch.utm_source, 'yandex')
  assert.equal(touch.utm_term?.length, 200)
  assert.equal(touch.referrer, '')
  const parsed = parseStoredTouch(JSON.stringify({ ...touch, evil: 'x' }))!
  assert.equal('evil' in parsed, false)
  assert.equal(chooseTouch(null, touch), touch)
  assert.equal(buildTouch({ href: 'not a url', referrer: '', now: T1 }), null)
})
