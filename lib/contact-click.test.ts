import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { handleContactClick, NAVIGATION_GRACE_MS, type ContactClickEvent } from './contact-click.ts'
import { trackMarketingEvent } from './marketing-events.ts'

const TG = 'https://t.me/driveset'

type Goal = { name: string; cb?: () => void }
let goals: Goal[]
let navigations: string[]
let timers: { fn: () => void; ms: number }[]
let ymWorks: boolean
let autoConfirm: boolean

function anchor(href: string, target = '') {
  return { getAttribute: (n: string) => (n === 'href' ? href : null), target }
}
function clickOn(a: ReturnType<typeof anchor> | null, extra: Partial<ContactClickEvent> = {}) {
  let prevented = false
  const event: ContactClickEvent = {
    target: { closest: () => a },
    button: 0,
    preventDefault: () => { prevented = true },
    ...extra,
  }
  handleContactClick(event, {
    telegramHref: TG,
    track: trackMarketingEvent,
    navigate: (h) => navigations.push(h),
    setTimer: (fn, ms) => timers.push({ fn, ms }),
  })
  return { prevented }
}

beforeEach(() => {
  goals = []
  navigations = []
  timers = []
  ymWorks = true
  autoConfirm = false
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = '113053562'
  ;(globalThis as { window?: unknown }).window = {
    ym: (_id: number, method: string, name: string, _p: unknown, cb?: () => void) => {
      if (!ymWorks) throw new Error('blocked')
      if (method === 'reachGoal') {
        goals.push({ name, cb })
        if (autoConfirm) cb?.()
      }
    },
  }
})

test('tel: link sends phone_click (every tel: href, not only the configured one)', () => {
  for (const href of ['tel:+79013447733', 'tel:+74950000000']) {
    const { prevented } = clickOn(anchor(href))
    assert.equal(prevented, false)
  }
  assert.deepEqual(goals.map((g) => g.name), ['phone_click', 'phone_click'])
})

test('Telegram link opened in a new tab sends telegram_click without touching navigation', () => {
  const { prevented } = clickOn(anchor(TG, '_blank'))
  assert.equal(prevented, false)
  assert.deepEqual(goals.map((g) => g.name), ['telegram_click'])
  assert.equal(navigations.length, 0)
})

test('same-tab Telegram link waits for Metrika, then navigates exactly once', () => {
  const { prevented } = clickOn(anchor(TG))
  assert.equal(prevented, true)
  assert.deepEqual(goals.map((g) => g.name), ['telegram_click'])
  assert.deepEqual(navigations, [])
  assert.equal(timers[0].ms, NAVIGATION_GRACE_MS)
  goals[0].cb!() // Metrika confirms
  timers[0].fn() // grace timer fires afterwards
  assert.deepEqual(navigations, [TG])
})

test('same-tab Telegram link still navigates if Metrika never answers', () => {
  clickOn(anchor(TG))
  timers[0].fn()
  assert.deepEqual(navigations, [TG])
})

test('modified clicks and blocked/missing Metrika keep native navigation', () => {
  assert.equal(clickOn(anchor(TG), { ctrlKey: true }).prevented, false)
  assert.equal(clickOn(anchor(TG), { metaKey: true }).prevented, false)
  assert.equal(clickOn(anchor(TG), { button: 1 }).prevented, false)
  ymWorks = false
  assert.equal(clickOn(anchor(TG)).prevented, false)
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID = ''
  assert.equal(clickOn(anchor(TG)).prevented, false)
  assert.equal(navigations.length, 0)
})

test('child of the link (icon/span) counts, unrelated links and non-links do not', () => {
  clickOn(anchor('tel:+79013447733'))
  assert.equal(goals.length, 1)
  clickOn(anchor('https://example.com/'))
  clickOn(anchor('#calculator'))
  clickOn(null)
  assert.equal(goals.length, 1)
})
