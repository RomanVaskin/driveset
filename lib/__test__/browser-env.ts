// Minimal fake browser for node:test: window.location / localStorage / document.referrer / window.ym / fetch.
// Test support only — not imported by the app.

export type FakeStorageMode = 'ok' | 'throws'

export type FakeBrowser = {
  navigate(url: string, referrer?: string): void
  store: Map<string, string>
  ymCalls: unknown[][]
  /** Callbacks passed to ym(…, 'getClientID', cb), in call order. */
  clientIdCallbacks: ((value: unknown) => void)[]
  restore(): void
}

type G = Record<string, unknown>

export function installBrowser(options: { url: string; referrer?: string; storage?: FakeStorageMode; withYm?: boolean }): FakeBrowser {
  const g = globalThis as unknown as G
  const saved = { window: g.window, document: g.document }
  const store = new Map<string, string>()
  const ymCalls: unknown[][] = []
  const clientIdCallbacks: ((value: unknown) => void)[] = []

  const localStorage =
    options.storage === 'throws'
      ? {
          getItem: () => { throw new Error('SecurityError') },
          setItem: () => { throw new Error('QuotaExceededError') },
          removeItem: () => { throw new Error('SecurityError') },
        }
      : {
          getItem: (k: string) => store.get(k) ?? null,
          setItem: (k: string, v: string) => void store.set(k, v),
          removeItem: (k: string) => void store.delete(k),
        }

  const win: G = { location: new URL(options.url), localStorage }
  if (options.withYm !== false) {
    win.ym = (...args: unknown[]) => {
      ymCalls.push(args)
      if (args[1] === 'getClientID' && typeof args[2] === 'function') clientIdCallbacks.push(args[2] as (v: unknown) => void)
    }
  }
  const doc: G = { referrer: options.referrer ?? '' }
  g.window = win
  g.document = doc

  return {
    navigate(url, referrer) {
      win.location = new URL(url)
      if (referrer !== undefined) doc.referrer = referrer
    },
    store,
    ymCalls,
    clientIdCallbacks,
    restore() {
      g.window = saved.window
      g.document = saved.document
    },
  }
}
