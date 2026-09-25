'use client'

import { Camera, Copy, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import { site } from '@/lib/site-config'
import { trackMarketingEvent } from '@/lib/marketing-events'

export function ContactActions() {
  const [copied, setCopied] = useState(false)

  async function copyMaxNumber() {
    trackMarketingEvent('max_click')
    try {
      await navigator.clipboard.writeText(site.maxPhone)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  const baseClass = 'flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm font-semibold transition-colors hover:border-champagne/50'

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <a href={site.telegramHref} target="_blank" rel="noreferrer" className={baseClass}>
        <Send className="size-5 text-champagne" aria-hidden="true" />
        Telegram <span className="ml-auto min-w-0 text-right font-normal text-muted-foreground">{site.telegram}</span>
      </a>
      <button type="button" onClick={copyMaxNumber} className={baseClass}>
        <Copy className="size-5 shrink-0 text-champagne" aria-hidden="true" />
        MAX <span className="ml-auto min-w-0 text-right font-normal text-muted-foreground">{copied ? 'Номер скопирован' : site.maxPhone}</span>
      </button>
      <a href={site.phoneHref} className={baseClass}>
        <Phone className="size-5 shrink-0 text-champagne" aria-hidden="true" />
        Позвонить <span className="ml-auto min-w-0 text-right font-normal text-muted-foreground">{site.phone}</span>
      </a>
    </div>
  )
}

export function PhotoCalcLink() {
  return (
    <a href="#photo-calc" onClick={() => trackMarketingEvent('photo_calc_click')} className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-white/10">
      <Camera className="mr-2 size-4" aria-hidden="true" />
      Рассчитать по фото
    </a>
  )
}
