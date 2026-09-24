import type { CampaignAttribution } from '@/lib/campaign-attribution'

export type MarketingEventName =
  | 'quiz_start'
  | 'car_selected'
  | 'package_selected'
  | 'price_shown'
  | 'gift_selected'
  | 'lead_submit'
  | 'telegram_click'
  | 'whatsapp_click'
  | 'max_click'
  | 'phone_click'

export type MarketingEventPayload = CampaignAttribution & {
  car?: string
  year?: string
  package?: string
  preliminary_price?: string
  gift?: string
  contact_channel?: string
  desired_timing?: string
}

declare global {
  interface Window {
    ym?: (counterId: number, method: 'reachGoal', goal: string, params?: MarketingEventPayload) => void
  }
}

/**
 * Provider-neutral event boundary. Until a public Yandex Metrika counter id is
 * configured, this function intentionally sends nothing outside the browser.
 */
export function trackMarketingEvent(name: MarketingEventName, payload: MarketingEventPayload = {}) {
  if (typeof window === 'undefined') return
  const counterId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID)
  if (!Number.isInteger(counterId) || counterId <= 0 || typeof window.ym !== 'function') return
  window.ym(counterId, 'reachGoal', name, payload)
}
