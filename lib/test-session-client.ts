// Browser side of Test Mode: ask the server whether this browser has a verified test session and, only then, mark the
// Metrika VISIT with `ym(counter, 'params', { olnoo_traffic: 'test' })`. Visit params, never userParams (userParams is
// tied to the ClientID and would stain later real visits of the same browser). Nothing is marked before the status is
// known, so real visitors are never touched. The token never reaches this code: the status endpoint does not return it.

import { setTestSessionActive } from './test-session-state.ts'

export const TEST_MARKER = { olnoo_traffic: 'test' } as const

type Status = { test: boolean; expiresAt: number }

let statusPromise: Promise<Status> | null = null
let markedFor: string | null = null

async function loadStatus(): Promise<Status> {
  try {
    const response = await fetch('/api/olnoo-test/status', { cache: 'no-store', credentials: 'same-origin' })
    const body: unknown = await response.json()
    if (response.ok && body && typeof body === 'object' && (body as { test?: unknown }).test === true) {
      const expiresAt = Date.parse(String((body as { expiresAt?: unknown }).expiresAt))
      if (Number.isFinite(expiresAt)) return { test: true, expiresAt }
    }
  } catch {
    // Any failure means "not a test session": the site and its analytics behave as for a real visitor.
  }
  return { test: false, expiresAt: 0 }
}

/**
 * Called by the analytics bootstrap on page load / navigation. One status request per page load; the marker is sent at
 * most once per path (a re-render or the dev double-effect does not repeat it) and stops when the session expires.
 */
export async function applyTestSessionMarker(counterId: number, path: string): Promise<boolean> {
  if (typeof window === 'undefined') return false
  statusPromise ??= loadStatus()
  const status = await statusPromise
  const live = status.test && Date.now() < status.expiresAt
  setTestSessionActive(live)
  if (!live || markedFor === path || typeof window.ym !== 'function') return false
  try {
    window.ym(counterId, 'params', { ...TEST_MARKER })
    markedFor = path
    return true
  } catch {
    return false
  }
}

/** For tests only. */
export function resetTestSessionClient() {
  statusPromise = null
  markedFor = null
  setTestSessionActive(false)
}
