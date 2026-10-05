import { captureFirstTouch, readFirstTouch } from './campaign-attribution.ts'
import { touchToLeadFields } from './first-touch.ts'
import { getLeadTrackingId, releaseLeadTrackingId } from './lead-tracking.ts'
import { trackMarketingEvent, type MarketingEventName } from './marketing-events.ts'
import { getMetrikaClientId } from './metrika-client-id.ts'

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

/**
 * Attribution identifiers for the lead body. Best-effort and synchronous: whatever is already available is sent
 * (first-touch, tracking id, cached ClientID); nothing is awaited and any failure yields {} — analytics must never
 * cost a lead.
 */
function collectAnalytics(): Record<string, string> {
  let fields: Record<string, string> = {}
  try {
    fields = touchToLeadFields(readFirstTouch() ?? captureFirstTouch())
  } catch {
    fields = {}
  }
  try {
    const trackingId = getLeadTrackingId()
    if (trackingId) fields.lead_tracking_id = trackingId
    const clientId = getMetrikaClientId()
    if (clientId) fields.metrika_client_id = clientId
  } catch {
    // keep whatever was collected
  }
  return fields
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
        ...collectAnalytics(),
        // page_path: where the form was actually submitted. landing_page (from the first touch) stays the first-touch URL.
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
    // A confirmed lead ends this attempt: the next lead gets a new tracking id. Goal parameters carry no identifiers.
    releaseLeadTrackingId()
    trackMarketingEvent(successEvent)
    return { ok: true }
  } catch {
    return { ok: false, error: 'Нет связи с сервером. Попробуйте ещё раз.' }
  }
}
