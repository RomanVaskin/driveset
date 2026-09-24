'use client'

import { Copy, MessageCircle, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import { captureCampaignAttribution } from '@/lib/campaign-attribution'
import { site } from '@/lib/site-config'
import { trackMarketingEvent, type MarketingEventPayload } from '@/lib/marketing-events'

type ContactActionsProps = {
  payload?: MarketingEventPayload
  whatsappText?: string
  photoOnly?: boolean
}

export function ContactActions({ payload = {}, whatsappText, photoOnly = false }: ContactActionsProps) {
  const [copied, setCopied] = useState(false)
  const whatsappHref = whatsappText
    ? `${site.whatsappHref}?text=${encodeURIComponent(whatsappText)}`
    : site.whatsappHref

  function eventPayload(channel: string) {
    return { ...captureCampaignAttribution(), ...payload, contact_channel: channel }
  }

  async function copyMaxNumber() {
    trackMarketingEvent('max_click', eventPayload('max'))
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
    <div className={`grid gap-3 ${photoOnly ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
      <a href={site.telegramHref} target="_blank" rel="noreferrer" onClick={() => trackMarketingEvent('telegram_click', eventPayload('telegram'))} className={baseClass}>
        <Send className="size-5 text-champagne" aria-hidden="true" />
        Telegram <span className="ml-auto font-normal text-muted-foreground">{site.telegram}</span>
      </a>
      <a href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => trackMarketingEvent('whatsapp_click', eventPayload('whatsapp'))} className={baseClass}>
        <MessageCircle className="size-5 text-champagne" aria-hidden="true" />
        WhatsApp <span className="ml-auto font-normal text-muted-foreground">{site.whatsapp}</span>
      </a>
      {!photoOnly && (
        <>
          <button type="button" onClick={copyMaxNumber} className={baseClass}>
            <Copy className="size-5 text-champagne" aria-hidden="true" />
            MAX <span className="ml-auto font-normal text-muted-foreground">{copied ? 'Номер скопирован' : site.maxPhone}</span>
          </button>
          <a href={site.phoneHref} onClick={() => trackMarketingEvent('phone_click', eventPayload('phone'))} className={baseClass}>
            <Phone className="size-5 text-champagne" aria-hidden="true" />
            Позвонить <span className="ml-auto font-normal text-muted-foreground">{site.phone}</span>
          </a>
        </>
      )}
    </div>
  )
}
