import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'

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
  package: 100,
  displayedPrice: 80,
  gift: 100,
  timing: 80,
  utm_source: 200,
  utm_medium: 200,
  utm_campaign: 200,
  utm_content: 200,
  utm_term: 200,
  yclid: 200,
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
  if (input.website || input.name.length < 2) return null
  if (!['telegram', 'max', 'phone'].includes(input.contactChannel)) return null
  if (!input.pagePath.startsWith('/') || input.pagePath.startsWith('//') || input.pagePath.includes('?')) return null
  if (input.vehicleYear && !/^\d{4}$/.test(input.vehicleYear)) return null

  // Keep the user's country code; only remove common visual separators.
  input.phone = input.phone.replace(/[\s()-]/g, '')
  if (!/^\+?\d{10,15}$/.test(input.phone)) return null
  return input
}

function message(input: LeadInput) {
  const car = [input.vehicleMake, input.vehicleModel, input.vehicleYear].filter(Boolean).join(' ')
  return [
    `Канал: ${input.contactChannel}`,
    car && `Автомобиль: ${car}`,
    input.package && `Услуга: ${input.package}`,
    input.displayedPrice && `Показанная цена: ${input.displayedPrice}`,
    input.gift && `Подарок: ${input.gift}`,
    input.timing && `Срок: ${input.timing}`,
    input.yclid && `YCLID: ${input.yclid}`,
  ].filter(Boolean).join('\n')
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
  try {
    input = parseLead(await readBody(request))
  } catch (error) {
    if (error instanceof Error && error.message === 'body too large') return failure(413, 'Слишком большой запрос.')
    return failure(400, 'Некорректные данные заявки.')
  }
  if (!input) return failure(400, 'Проверьте данные заявки.')

  const url = crmEndpoint()
  if (!url) return failure(503, 'Отправка заявки временно недоступна.')

  const fingerprint = createHash('sha256').update(ip + JSON.stringify(input)).digest('hex')
  if ((duplicates.get(fingerprint) ?? 0) > now) return failure(409, 'Такая заявка уже отправлена.')
  duplicates.set(fingerprint, now + duplicateMs)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OLNOO_CRM_API_KEY}`,
      },
      body: JSON.stringify({
        project: 'driveset',
        name: input.name,
        phone: input.phone,
        source: 'Ads',
        pagePath: input.pagePath,
        utm_source: input.utm_source,
        utm_medium: input.utm_medium,
        utm_campaign: input.utm_campaign,
        utm_content: input.utm_content,
        utm_term: input.utm_term,
        message: message(input),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(7_000),
    })
    if (response.status !== 201) {
      duplicates.delete(fingerprint)
      return failure(502, 'Не удалось отправить заявку. Попробуйте позже.')
    }
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    duplicates.delete(fingerprint)
    return failure(error instanceof Error && error.name === 'TimeoutError' ? 504 : 502, 'Не удалось отправить заявку. Попробуйте позже.')
  }
}
