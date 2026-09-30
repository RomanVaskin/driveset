import { captureCampaignAttribution } from '@/lib/campaign-attribution'
import { trackMarketingEvent, type MarketingEventName } from '@/lib/marketing-events'

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

/** `successEvent` lets each landing keep its own Metrika funnel; it fires only after `201 {ok:true}`. */
export async function submitLead(
  draft: LeadDraft,
  successEvent: Extract<MarketingEventName, 'lead_submit' | 'polirovka_lead_submit' | 'himchistka_lead_submit'> = 'lead_submit',
): Promise<{ ok: boolean; error?: string }> {
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
    const result: unknown = await response.json().catch(() => null)
    if (response.status !== 201) {
      // Show the handler's own reason (validation, rate limit, CRM unavailable) instead of a generic text.
      const reason = result && typeof result === 'object' && 'error' in result && typeof result.error === 'string' ? result.error : ''
      return { ok: false, error: `${reason || 'Не удалось отправить заявку. Попробуйте ещё раз.'} Данные в форме сохранены.` }
    }
    if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== true) {
      return { ok: false, error: 'Не удалось подтвердить отправку заявки.' }
    }
    trackMarketingEvent(successEvent)
    return { ok: true }
  } catch {
    return { ok: false, error: 'Нет связи с сервером. Попробуйте ещё раз.' }
  }
}
