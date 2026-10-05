// Yandex Metrika ClientID, obtained ONLY through the official ym(counterId, 'getClientID', callback) and cached.
// Best-effort: nothing ever waits for it. Metrika blocked, tag not loaded yet, callback never fired or an invalid
// value → the cache stays empty and the lead goes out without metrika_client_id. Always a STRING (UInt64, up to 20 digits).

const CLIENT_ID_RE = /^\d{1,20}$/
let cached: string | null = null
let requested = false

export function isValidClientId(value: unknown): value is string {
  return typeof value === 'string' && CLIENT_ID_RE.test(value)
}

/** Asks Metrika once per page load; a no-op until `window.ym` exists. The callback runs whenever (if ever) the tag answers. */
export function requestMetrikaClientId(counterId: number): void {
  if (requested || typeof window === 'undefined' || typeof window.ym !== 'function') return
  requested = true
  try {
    window.ym(counterId, 'getClientID', (value: unknown) => {
      if (isValidClientId(value)) cached = value
    })
  } catch {
    // A blocked or broken counter must not affect the site.
  }
}

/** Whatever is available right now — never waits. */
export function getMetrikaClientId(): string | null {
  return cached
}

/** For tests only. */
export function resetMetrikaClientId() {
  cached = null
  requested = false
}
