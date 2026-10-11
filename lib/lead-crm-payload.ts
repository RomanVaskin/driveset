// The body DriveSet sends to the OLNOO CRM (`POST /api/leads/inbound`), moved out of the route unchanged so it can be
// tested. `source` stays the hard-coded 'Ads' (deferred: a separate decision about CRM source semantics).
import { services } from './site-config.ts'
import type { LeadAnalytics } from './lead-analytics.ts'

export type CrmLeadInput = {
  name: string
  phone: string
  contactChannel: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: string
  package: string
  displayedPrice: string
  gift: string
  timing: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  utm_term: string
  pagePath: string
}

function message(input: CrmLeadInput, yclid: string | undefined) {
  const car = [input.vehicleMake, input.vehicleModel, input.vehicleYear].filter(Boolean).join(' ')
  return [
    `Канал: ${input.contactChannel}`,
    car && `Автомобиль: ${car}`,
    input.package && `Услуга: ${input.package}`,
    input.displayedPrice && `Показанная цена: ${input.displayedPrice}`,
    input.gift && `Подарок: ${input.gift}`,
    input.timing && `Срок: ${input.timing}`,
    yclid && `YCLID: ${yclid}`,
  ].filter(Boolean).join('\n')
}

/** CRM `service` column per landing, derived server-side from the validated pagePath. */
const serviceByPage: Record<string, string> = {
  '/okleyka-avto': 'okleyka-avto',
  '/polirovka-avto': 'polirovka-avto',
  '/himchistka-avto': 'himchistka-avto',
}

/**
 * Homepage form: `package` is the chosen service title from `services`; only
 * those titles map to a landing slug. Anything else («Другое / не знаю», nothing
 * chosen) is a general request — `Other`, the value the OLNOO CRM already
 * receives from olnoo.com.
 */
const serviceByHomeChoice: Record<string, string> = {
  wrapping: 'okleyka-avto',
  polishing: 'polirovka-avto',
  cleaning: 'himchistka-avto',
}

export function crmService(input: Pick<CrmLeadInput, 'pagePath' | 'package'>) {
  if (input.pagePath !== '/') return serviceByPage[input.pagePath] ?? ''
  const choice = services.find((item) => item.title === input.package)
  return (choice && serviceByHomeChoice[choice.id]) || 'Other'
}

/**
 * Channel (Quiz vs Form), derived from the same validated `pagePath` `crmService()` already
 * uses — never guessed from anything else. The home page (`/`) has a simple select-a-service
 * form, not a quiz; each of the three landing pages runs the multi-step quiz (see
 * OLNOO_ARCHITECTURE.md's "Квиз и отправка лида"/"Посадочная полировки"/"...химчистки" sections).
 * Any other `pagePath` has no known submit flow today, so `channel` is left unset rather than
 * guessed between the two — matches `crmService`'s own `''` fallback for an unrecognized page.
 */
const QUIZ_PAGE_PATHS = new Set(Object.keys(serviceByPage))

export function crmChannel(input: Pick<CrmLeadInput, 'pagePath'>): string | undefined {
  if (input.pagePath === '/') return 'Form'
  if (QUIZ_PAGE_PATHS.has(input.pagePath)) return 'Quiz'
  return undefined
}

export function buildCrmLeadBody(input: CrmLeadInput, analytics: LeadAnalytics) {
  const channel = crmChannel(input)
  return {
    project: 'driveset',
    // OLNOO CRM requires a non-empty name: a phone-only lead gets a technical title, not a fake person name.
    name: input.name || 'Заявка DriveSet',
    phone: input.phone,
    source: 'Ads',
    service: crmService(input),
    ...(channel ? { channel } : {}),
    // pagePath = the page the form was submitted on; pageUrl (CRM landing_page) = the first-touch landing URL.
    pagePath: input.pagePath,
    utm_source: input.utm_source,
    utm_medium: input.utm_medium,
    utm_campaign: input.utm_campaign,
    utm_content: input.utm_content,
    utm_term: input.utm_term,
    message: message(input, analytics.yclid),
    // Optional analytics identifiers: only valid values reach this point, and only present ones are sent.
    ...(analytics.lead_tracking_id ? { lead_tracking_id: analytics.lead_tracking_id } : {}),
    ...(analytics.metrika_client_id ? { metrika_client_id: analytics.metrika_client_id } : {}),
    ...(analytics.yclid ? { yclid: analytics.yclid } : {}),
    ...(analytics.first_seen_at ? { first_seen_at: analytics.first_seen_at } : {}),
    ...(analytics.landing_page ? { pageUrl: analytics.landing_page } : {}),
    ...(analytics.referrer ? { referrer: analytics.referrer } : {}),
  }
}
