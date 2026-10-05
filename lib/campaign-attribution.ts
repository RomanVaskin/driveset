// Browser side of first-touch attribution: reads/writes ONE atomic touch in localStorage (see first-touch.ts for the rules).
// A storage failure (private mode, quota, security error) never throws: the touch is then kept in memory for the page lifetime.
import { buildTouch, chooseTouch, parseStoredTouch, type FirstTouch } from './first-touch.ts'

export type { FirstTouch } from './first-touch.ts'

const storageKey = 'driveset_first_touch'
let memoryTouch: FirstTouch | null = null

function readStored(): FirstTouch | null {
  try {
    return parseStoredTouch(window.localStorage.getItem(storageKey))
  } catch {
    return null
  }
}

/** The current touch without changing anything. */
export function readFirstTouch(): FirstTouch | null {
  if (typeof window === 'undefined') return null
  return readStored() ?? memoryTouch
}

/** Records this page view's touch per the first-touch rules and returns the touch in force. */
export function captureFirstTouch(now: number = Date.now()): FirstTouch | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = readStored() ?? memoryTouch
    const incoming = buildTouch({ href: window.location.href, referrer: document.referrer, now })
    const chosen = incoming ? chooseTouch(stored, incoming) : stored
    if (chosen && chosen !== stored) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(chosen))
      } catch {
        // Storage can be unavailable; the memory copy below still serves this page.
      }
    }
    memoryTouch = chosen
    return chosen
  } catch {
    return memoryTouch
  }
}

/** For tests only. */
export function resetFirstTouchMemory() {
  memoryTouch = null
}
