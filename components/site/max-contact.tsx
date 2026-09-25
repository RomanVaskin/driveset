'use client'

import { useState } from 'react'
import { trackMarketingEvent } from '@/lib/marketing-events'
import { site } from '@/lib/site-config'

export function MaxContact() {
  const [copied, setCopied] = useState(false)

  async function copyNumber() {
    trackMarketingEvent('max_click')
    try {
      await navigator.clipboard.writeText(site.maxPhone)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return <button type="button" onClick={copyNumber} className="text-left transition-colors hover:text-champagne">{copied ? 'Номер скопирован' : site.maxPhone}</button>
}
