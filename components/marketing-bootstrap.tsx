'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { captureFirstTouch } from '@/lib/campaign-attribution'
import { handleContactClick } from '@/lib/contact-click'
import { trackMarketingEvent } from '@/lib/marketing-events'
import { requestMetrikaClientId } from '@/lib/metrika-client-id'
import { applyTestSessionMarker } from '@/lib/test-session-client'
import { site } from '@/lib/site-config'

const counterId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID)
let initialized = false

export function MarketingBootstrap() {
  const pathname = usePathname()

  useEffect(() => {
    captureFirstTouch()
    const onClick = (event: MouseEvent) =>
      handleContactClick(event, {
        telegramHref: site.telegramHref,
        track: trackMarketingEvent,
        navigate: (href) => window.location.assign(href),
        setTimer: (fn, ms) => window.setTimeout(fn, ms),
      })
    document.addEventListener('click', onClick)
    if (!Number.isInteger(counterId) || counterId <= 0) {
      return () => document.removeEventListener('click', onClick)
    }

    if (!initialized) {
      try {
        if (!window.ym) {
          const stub = ((...args: unknown[]) => { (stub.a ??= []).push(args) }) as NonNullable<Window['ym']>
          stub.l = Date.now()
          window.ym = stub
          const script = document.createElement('script')
          script.async = true
          script.src = 'https://mc.yandex.ru/metrika/tag.js'
          document.head.appendChild(script)
        }
        window.ym?.(counterId, 'init', { defer: true, clickmap: false, trackLinks: false, webvisor: true, sendTitle: false })
        initialized = true
      } catch {
        // A blocked counter must not affect the site.
      }
    }

    // Best-effort ClientID for the lead form: asked once, cached when (and if) the tag answers; nothing waits for it.
    requestMetrikaClientId(counterId)

    try {
      window.ym?.(counterId, 'hit', window.location.href)
    } catch {
      // A blocked counter must not affect the site.
    }

    // Test Mode: once the server confirms a verified test session, mark this Metrika visit (visit params). Never before.
    void applyTestSessionMarker(counterId, window.location.pathname)
    return () => document.removeEventListener('click', onClick)
  }, [pathname])

  return null
}
