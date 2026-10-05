import { isTestSessionActive } from './test-session-state.ts'
import { quizPackageOptions } from './wrapping-config.ts'

export type MarketingEventName =
  | 'quiz_start'
  | 'car_selected'
  | 'package_selected'
  | 'quiz_phone'
  | 'lead_submit'
  | 'polirovka_quiz_start'
  | 'polirovka_car_selected'
  | 'polirovka_service_selected'
  | 'polirovka_quiz_phone'
  | 'polirovka_lead_submit'
  | 'himchistka_quiz_start'
  | 'himchistka_car_selected'
  | 'himchistka_service_selected'
  | 'himchistka_quiz_phone'
  | 'himchistka_lead_submit'
  | 'telegram_click'
  | 'whatsapp_click'
  | 'max_click'
  | 'phone_click'
  | 'photo_calc_click'

export type MarketingEventPayload = {
  package?: string
  channel?: 'telegram' | 'max' | 'phone' | 'photo'
  /** Added only while a verified test session is active (Test Traffic v1); never by callers. */
  olnoo_traffic?: 'test'
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
 * Returns true when the goal was handed to Metrika (queued or sent).
 */
export function trackMarketingEvent(name: MarketingEventName, payload: MarketingEventPayload = {}, callback?: () => void): boolean {
  if (typeof window === 'undefined') return false
  const counterId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID)
  if (!Number.isInteger(counterId) || counterId <= 0 || typeof window.ym !== 'function') return false
  const safePayload: MarketingEventPayload = {}
  if (name === 'package_selected' && quizPackageOptions.some((item) => item.id === payload.package)) {
    safePayload.package = payload.package
  }
  if (name in contactChannels) safePayload.channel = contactChannels[name as keyof typeof contactChannels]
  if (isTestSessionActive()) safePayload.olnoo_traffic = 'test'
  try {
    // The optional callback fires once Metrika has sent the goal (used before same-tab navigation).
    if (callback) window.ym(counterId, 'reachGoal', name, safePayload, callback)
    else window.ym(counterId, 'reachGoal', name, safePayload)
    return true
  } catch {
    // Analytics must never interrupt navigation or the quiz.
    return false
  }
}
