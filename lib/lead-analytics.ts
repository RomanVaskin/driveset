// Server side (DriveSet /api/lead): the OPTIONAL analytics identifiers of a lead. They are split off the body BEFORE the
// strict business validation and are best-effort — an invalid one is dropped, never turned into a rejected lead (the CRM
// would answer 400 for a malformed value). Their values are never logged. The same rules the OLNOO CRM applies.
import { createHash } from 'node:crypto'

export const ANALYTICS_KEYS = ['lead_tracking_id', 'metrika_client_id', 'yclid', 'first_seen_at', 'landing_page', 'referrer'] as const
export type AnalyticsKey = (typeof ANALYTICS_KEYS)[number]
export type LeadAnalytics = Partial<Record<AnalyticsKey, string>>

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const CLIENT_ID_RE = /^\d{1,20}$/
const URL_RE = /^https?:\/\/\S+$/
const TIMESTAMP_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/
const MIN_TIME = Date.parse('2020-01-01T00:00:00Z')
const MAX_FUTURE_MS = 24 * 60 * 60 * 1000

/** Date.parse rolls 2026-02-30 over to March and accepts T24:00, so the calendar fields are checked first. */
function isRealTimestamp(value: string): boolean {
  const m = TIMESTAMP_RE.exec(value)
  if (!m) return false
  const [year, month, day, hour, minute, second] = [m[1], m[2], m[3], m[4], m[5], m[6] ?? '0'].map(Number)
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth && hour <= 23 && minute <= 59 && second <= 59
}

const hasControlOrSpace = (v: string) => /[\s\u0000-\u001f\u007f]/.test(v)

/** Returns only the valid values, trimmed. Anything else (wrong type, malformed, too long) is silently dropped. */
export function sanitizeLeadAnalytics(raw: Record<string, unknown>, now: number = Date.now()): LeadAnalytics {
  const out: LeadAnalytics = {}
  const text = (key: AnalyticsKey) => (typeof raw[key] === 'string' ? (raw[key] as string).trim() : '')

  const trackingId = text('lead_tracking_id')
  if (UUID_RE.test(trackingId)) out.lead_tracking_id = trackingId.toLowerCase()

  const clientId = text('metrika_client_id')
  if (CLIENT_ID_RE.test(clientId)) out.metrika_client_id = clientId // stays a string: UInt64 can exceed the safe-integer range

  const yclid = text('yclid')
  if (yclid && yclid.length <= 200 && !hasControlOrSpace(yclid)) out.yclid = yclid

  const seenAt = text('first_seen_at')
  if (isRealTimestamp(seenAt)) {
    const ms = Date.parse(seenAt)
    if (ms >= MIN_TIME && ms <= now + MAX_FUTURE_MS) out.first_seen_at = new Date(ms).toISOString()
  }

  const landing = text('landing_page')
  if (landing.length <= 500 && URL_RE.test(landing)) out.landing_page = landing

  const referrer = text('referrer')
  if (referrer.length <= 500 && URL_RE.test(referrer)) out.referrer = referrer

  return out
}

/**
 * Separates the analytics keys from the rest of the body. `business` keeps every other key (so the strict
 * unknown-key check still applies to it) and is what duplicate protection and validation see.
 */
export function splitLeadBody(body: unknown, now?: number): { business: unknown; analytics: LeadAnalytics } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { business: body, analytics: {} }
  const business: Record<string, unknown> = { ...(body as Record<string, unknown>) }
  const raw: Record<string, unknown> = {}
  for (const key of ANALYTICS_KEYS) {
    if (key in business) raw[key] = business[key]
    delete business[key]
  }
  return { business, analytics: sanitizeLeadAnalytics(raw, now) }
}

/** The existing duplicate-protection key, computed over the validated BUSINESS input only (analytics never enter it). */
export function leadFingerprint(ip: string, input: unknown): string {
  return createHash('sha256').update(ip + JSON.stringify(input)).digest('hex')
}
