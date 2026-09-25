'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { captureCampaignAttribution } from '@/lib/campaign-attribution'
import { trackMarketingEvent } from '@/lib/marketing-events'
import { site } from '@/lib/site-config'

const counterId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID)
let initialized = false

export function MarketingBootstrap() {
  const pathname = usePathname()

  useEffect(() => {
    captureCampaignAttribution()
    const handleContactClick = (event: MouseEvent) => {
      if (pathname !== '/' && pathname !== '/okleyka-avto') return
      if (!(event.target instanceof Element)) return
      const href = event.target.closest('a[href]')?.getAttribute('href')
      if (href === site.telegramHref) trackMarketingEvent('telegram_click')
      if (href === site.phoneHref) trackMarketingEvent('phone_click')
    }
    document.addEventListener('click', handleContactClick)
    if (!Number.isInteger(counterId) || counterId <= 0) {
      return () => document.removeEventListener('click', handleContactClick)
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

    try {
      window.ym?.(counterId, 'hit', window.location.href)
    } catch {
      // A blocked counter must not affect the site.
    }
    return () => document.removeEventListener('click', handleContactClick)
  }, [pathname])

  return null
}
