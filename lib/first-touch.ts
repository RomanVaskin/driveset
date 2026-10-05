// First-touch attribution as ONE atomic object. Pure (no window / storage access) so the rules can be tested.
//
// Rules: (A) nothing stored → store the current touch. (B) a stored touch WITHOUT campaign parameters may be
// replaced once by a later touch that carries them. (C) a stored touch that carries campaign parameters is never
// overwritten. (D) a touch is always stored/replaced as a whole — fields of different visits are never mixed.
// "Carries campaign parameters" = at least one of utm_* / yclid is present in the landing URL; nothing more is inferred.

export const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid'] as const
export type CampaignKey = (typeof campaignKeys)[number]

export type FirstTouch = {
  /** Landing URL without the #fragment, query kept (it carries the utm_*). */
  landing_url: string
  landing_path: string
  /** document.referrer at the moment of the touch; "" when none. */
  referrer: string
  /** Client clock, ISO UTC, set once when this touch was created. */
  first_seen_at: string
} & Partial<Record<CampaignKey, string>>

const MAX_VALUE = 200
const MAX_URL = 500
const MAX_PATH = 160

const clean = (value: string | null | undefined, max: number) => value?.trim().slice(0, max) || undefined

export function buildTouch(input: { href: string; referrer: string; now: number }): FirstTouch | null {
  let url: URL
  try {
    url = new URL(input.href)
  } catch {
    return null
  }
  const touch: FirstTouch = {
    landing_url: `${url.origin}${url.pathname}${url.search}`.slice(0, MAX_URL),
    landing_path: url.pathname.slice(0, MAX_PATH),
    referrer: clean(input.referrer, MAX_URL) ?? '',
    first_seen_at: new Date(input.now).toISOString(),
  }
  for (const key of campaignKeys) {
    const value = clean(url.searchParams.get(key), MAX_VALUE)
    if (value) touch[key] = value
  }
  return touch
}

export function hasCampaignParams(touch: FirstTouch): boolean {
  return campaignKeys.some((key) => Boolean(touch[key]))
}

/** Returns the stored touch itself (same reference) when it stays, otherwise the incoming one. */
export function chooseTouch(stored: FirstTouch | null, incoming: FirstTouch): FirstTouch {
  if (!stored) return incoming
  if (hasCampaignParams(stored) || !hasCampaignParams(incoming)) return stored
  return incoming
}

/** Rebuilds a touch from stored JSON; anything malformed is treated as "nothing stored". Unknown keys are dropped. */
export function parseStoredTouch(raw: string | null): FirstTouch | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (!parsed || typeof parsed !== 'object') return null
    const { landing_url, landing_path, referrer, first_seen_at } = parsed
    if (typeof landing_url !== 'string' || typeof landing_path !== 'string' || typeof referrer !== 'string') return null
    if (typeof first_seen_at !== 'string' || !Number.isFinite(Date.parse(first_seen_at))) return null
    const touch: FirstTouch = { landing_url, landing_path, referrer, first_seen_at }
    for (const key of campaignKeys) {
      const value = parsed[key]
      if (typeof value === 'string' && value) touch[key] = value.slice(0, MAX_VALUE)
    }
    return touch
  } catch {
    return null
  }
}

/** The /api/lead body fields a touch contributes. landing_page = the touch's landing URL, never the submit page. */
export function touchToLeadFields(touch: FirstTouch | null): Record<string, string> {
  if (!touch) return {}
  const fields: Record<string, string> = { landing_page: touch.landing_url, first_seen_at: touch.first_seen_at }
  if (touch.referrer) fields.referrer = touch.referrer
  for (const key of campaignKeys) if (touch[key]) fields[key] = touch[key] as string
  return fields
}
