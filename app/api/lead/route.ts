import { NextResponse } from 'next/server'
import { leadFingerprint, splitLeadBody } from '@/lib/lead-analytics'
import { buildCrmLeadBody } from '@/lib/lead-crm-payload'

export const runtime = 'nodejs'

const maxBodyBytes = 8_192
const windowMs = 10 * 60_000
const duplicateMs = 2 * 60_000
const attempts = new Map<string, { count: number; started: number }>()
const duplicates = new Map<string, number>()

const fieldLimits = {
  name: 80,
  phone: 32,
  contactChannel: 10,
  vehicleMake: 60,
  vehicleModel: 80,
  vehicleYear: 4,
  package: 320,
  displayedPrice: 80,
  gift: 100,
  timing: 80,
  utm_source: 200,
  utm_medium: 200,
  utm_campaign: 200,
  utm_content: 200,
  utm_term: 200,
  pagePath: 160,
  website: 0,
} as const

type LeadField = keyof typeof fieldLimits
type LeadInput = Record<LeadField, string>

function failure(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status })
}

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader()
  if (!reader) throw new Error('invalid body')
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBodyBytes) {
      await reader.cancel()
      throw new Error('body too large')
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown
}

function parseLead(value: unknown): LeadInput | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const body = value as Record<string, unknown>
  if (Object.keys(body).some((key) => !(key in fieldLimits))) return null

  const input = {} as LeadInput
  for (const key of Object.keys(fieldLimits) as LeadField[]) {
    const raw = body[key]
    if (raw !== undefined && typeof raw !== 'string') return null
    const text = (raw ?? '').trim().replace(/[\u0000-\u001f\u007f]/g, ' ')
    if (text.length > fieldLimits[key]) return null
    input[key] = text
  }
  // Name is optional (the quiz asks only for a phone); when given it must be real.
  if (input.website || (input.name && input.name.length < 2)) return null
  if (!['telegram', 'max', 'phone'].includes(input.contactChannel)) return null
  if (!input.pagePath.startsWith('/') || input.pagePath.startsWith('//') || input.pagePath.includes('?')) return null
  if (input.vehicleYear && !/^\d{4}$/.test(input.vehicleYear)) return null

  // Keep the user's country code; only remove common visual separators.
  input.phone = input.phone.replace(/[\s()-]/g, '')
  if (!/^\+?\d{10,15}$/.test(input.phone)) return null
  return input
}

function crmEndpoint(): URL | null {
  const configured = process.env.OLNOO_CRM_URL
  if (!configured || !process.env.OLNOO_CRM_API_KEY) return null
  try {
    const url = new URL(configured)
    if (url.username || url.password || url.search || url.hash) return null
    if (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && url.origin.startsWith('http://127.0.0.1:'))) return null
    url.pathname = '/api/leads/inbound'
    return url
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return failure(415, 'Нужен JSON-запрос.')
  const ip = request.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  if (attempts.size > 5_000) for (const [key, value] of attempts) if (now - value.started > windowMs) attempts.delete(key)
  if (duplicates.size > 5_000) for (const [key, expires] of duplicates) if (expires < now) duplicates.delete(key)
  const limit = attempts.get(ip)
  const current = !limit || now - limit.started > windowMs ? { count: 1, started: now } : { count: limit.count + 1, started: limit.started }
  attempts.set(ip, current)
  if (current.count > 5) return failure(429, 'Слишком много запросов. Попробуйте позже.')

  let input: LeadInput | null
  let analytics: ReturnType<typeof splitLeadBody>['analytics']
  try {
    // Analytics identifiers are optional and best-effort: split off (invalid ones dropped) before the strict check.
    const split = splitLeadBody(await readBody(request))
    analytics = split.analytics
    input = parseLead(split.business)
  } catch (error) {
    if (error instanceof Error && error.message === 'body too large') return failure(413, 'Слишком большой запрос.')
    return failure(400, 'Некорректные данные заявки.')
  }
  if (!input) return failure(400, 'Проверьте данные заявки.')

  const url = crmEndpoint()
  if (!url) return failure(503, 'Отправка заявки временно недоступна.')

  // Business fields only: analytics metadata can never make two identical requests look different.
  const fingerprint = leadFingerprint(ip, input)
  if ((duplicates.get(fingerprint) ?? 0) > now) return failure(409, 'Такая заявка уже отправлена.')
  duplicates.set(fingerprint, now + duplicateMs)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OLNOO_CRM_API_KEY}`,
      },
      body: JSON.stringify(buildCrmLeadBody(input, analytics)),
      cache: 'no-store',
      signal: AbortSignal.timeout(7_000),
    })
    if (response.status !== 201) {
      duplicates.delete(fingerprint)
      // Server journal only: CRM status and its error text, no lead data.
      const detail = (await response.text().catch(() => '')).slice(0, 200)
      console.error(`[lead] CRM rejected ${input.pagePath}: ${response.status} ${detail}`)
      return failure(502, 'Не удалось отправить заявку. Попробуйте позже.')
    }
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    duplicates.delete(fingerprint)
    console.error(`[lead] CRM request failed ${input.pagePath}: ${error instanceof Error ? error.name : 'unknown'}`)
    return failure(error instanceof Error && error.name === 'TimeoutError' ? 504 : 502, 'Не удалось отправить заявку. Попробуйте позже.')
  }
}
