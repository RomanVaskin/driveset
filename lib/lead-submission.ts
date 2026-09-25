import { captureCampaignAttribution } from '@/lib/campaign-attribution'
import { trackMarketingEvent } from '@/lib/marketing-events'

export type LeadDraft = {
  name: string
  phone: string
  contactChannel: 'telegram' | 'max' | 'phone'
  vehicleMake?: string
  vehicleModel?: string
  vehicleYear?: string
  package?: string
  displayedPrice?: string
  gift?: string
  timing?: string
  website: string
}

export async function submitLead(draft: LeadDraft): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...draft,
        ...captureCampaignAttribution(),
        pagePath: window.location.pathname,
      }),
    })
    if (response.status !== 201) return { ok: false, error: 'Не удалось отправить заявку. Попробуйте ещё раз.' }
    const result: unknown = await response.json()
    if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== true) {
      return { ok: false, error: 'Не удалось подтвердить отправку заявки.' }
    }
    trackMarketingEvent('lead_submit')
    return { ok: true }
  } catch {
    return { ok: false, error: 'Нет связи с сервером. Попробуйте ещё раз.' }
  }
}
