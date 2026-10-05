// Click handling for contact links (Telegram, tel:). Pure and dependency-injected so it can be
// tested without a DOM; components/marketing-bootstrap.tsx wires it to the real document.
import type { MarketingEventName } from './marketing-events.ts'

type AnchorLike = { getAttribute(name: string): string | null; target?: string }

export type ContactClickEvent = {
  target: unknown
  button?: number
  metaKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  defaultPrevented?: boolean
  preventDefault(): void
}

export type ContactClickDeps = {
  telegramHref: string
  /** Hands the goal to Metrika; returns false when nothing was queued (no counter / blocked). */
  track: (name: MarketingEventName, payload?: Record<string, never>, callback?: () => void) => boolean
  navigate: (href: string) => void
  setTimer: (fn: () => void, ms: number) => unknown
}

/** Max wait for Metrika before following a same-tab external link anyway. */
export const NAVIGATION_GRACE_MS = 500

function closestAnchor(target: unknown): AnchorLike | null {
  const el = target as { closest?: (selector: string) => AnchorLike | null } | null
  return el && typeof el.closest === 'function' ? el.closest('a[href]') : null
}

export function handleContactClick(event: ContactClickEvent, deps: ContactClickDeps): void {
  const anchor = closestAnchor(event.target)
  const href = anchor?.getAttribute('href')
  if (!anchor || !href) return

  if (href.startsWith('tel:')) {
    deps.track('phone_click')
    return
  }
  if (href !== deps.telegramHref) return

  // A plain left click on a same-tab Telegram link unloads the page, which cancels the pending
  // Metrika request. Hold the navigation until Metrika confirms the goal (or the grace period ends).
  const sameTab = !anchor.target || anchor.target === '_self'
  const plainClick = (event.button ?? 0) === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
  if (!sameTab || !plainClick || event.defaultPrevented) {
    deps.track('telegram_click')
    return
  }

  let navigated = false
  const go = () => {
    if (navigated) return
    navigated = true
    deps.navigate(href)
  }
  if (deps.track('telegram_click', undefined, go)) {
    event.preventDefault()
    deps.setTimer(go, NAVIGATION_GRACE_MS)
  }
}
