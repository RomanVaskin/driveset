import { quizPackageOptions } from '@/lib/wrapping-config'

export type MarketingEventName =
  | 'quiz_start'
  | 'car_selected'
  | 'package_selected'
  | 'elements_selected'
  | 'quiz_phone'
  | 'lead_submit'
  | 'offer_view'
  | 'telegram_click'
  | 'whatsapp_click'
  | 'max_click'
  | 'phone_click'
  | 'photo_calc_click'

export type MarketingEventPayload = {
  package?: string
  channel?: 'telegram' | 'max' | 'phone' | 'photo'
}

const contactChannels = {
  telegram_click: 'telegram',
  max_click: 'max',
  phone_click: 'phone',
  photo_calc_click: 'photo',
} as const

declare global {
  interface Window {
    ym?: ((counterId: number, method: string, ...args: unknown[]) => void) & { a?: unknown[][]; l?: number }
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
  const safePayload: MarketingEventPayload = {}
  if ((name === 'package_selected' || name === 'offer_view') && quizPackageOptions.some((item) => item.id === payload.package)) {
    safePayload.package = payload.package
  }
  if (name in contactChannels) safePayload.channel = contactChannels[name as keyof typeof contactChannels]
  try {
    window.ym(counterId, 'reachGoal', name, safePayload)
  } catch {
    // Analytics must never interrupt navigation or the quiz.
  }
}
