import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { buildSetCookie, readCookie, statusFromCookieHeader, TEST_COOKIE_NAME, verifyTestToken } from './test-session.ts'
import { issueTestSessionToken, verifyTestSessionToken } from './test-session-token.ts'
import { GET as enter } from '../app/olnoo-test/route.ts'
import { GET as status } from '../app/api/olnoo-test/status/route.ts'

const SECRET = 'd'.repeat(64)
const b64 = (s: string | Buffer) => Buffer.from(s).toString('base64url')
let saved: string | undefined
beforeEach(() => {
  saved = process.env.OLNOO_TEST_SECRET_DRIVESET
  process.env.OLNOO_TEST_SECRET_DRIVESET = SECRET
})
afterEach(() => {
  if (saved === undefined) delete process.env.OLNOO_TEST_SECRET_DRIVESET
  else process.env.OLNOO_TEST_SECRET_DRIVESET = saved
})

const issue = (over: Partial<Parameters<typeof issueTestSessionToken>[0]> = {}) => {
  const r = issueTestSessionToken({ project: 'driveset', secret: SECRET, ttlSeconds: 7200, ...over })
  assert.ok(r.ok)
  return r
}
const link = (token: string | null, host = 'https://driveset.ru') => new Request(`${host}/olnoo-test${token === null ? '' : `?t=${token}`}`)
const setCookie = (r: Response) => r.headers.get('set-cookie')
const statusOf = async (cookie: string | null) => (await status(new Request('https://driveset.ru/api/olnoo-test/status', { headers: cookie ? { cookie } : {} }))).json()

// ---- token spec compatibility with olnoo-admin PR B ---------------------------------------------------

test('the verifier is the olnoo-admin PR B file: pinned spec — golden vector, exact signing input, prefix', () => {
  // Built here with plain node:crypto exactly as the spec says, then verified by the copied module.
  const payload = { v: 1, p: 'driveset', iat: 1_790_000_000, exp: 1_790_007_200, sid: b64(Buffer.alloc(16, 9)), k: 1 }
  const payloadB64 = b64(JSON.stringify(payload))
  const signature = createHmac('sha256', SECRET).update(`olnoo-t1.${payloadB64}`).digest('base64url')
  const token = `olnoo-t1.${payloadB64}.${signature}`
  const ok = verifyTestSessionToken(token, { project: 'driveset', secrets: { 1: SECRET }, now: 1_790_000_100_000 })
  assert.ok(ok.valid)
  assert.deepEqual([ok.project, ok.keyVersion, ok.sessionId, ok.expiresAt.toISOString()], ['driveset', 1, b64(Buffer.alloc(16, 9)), new Date(1_790_007_200_000).toISOString()])
  // The copy issues byte-identical tokens for the same input (deterministic randomness injected).
  const issued = issueTestSessionToken({ project: 'driveset', secret: SECRET, ttlSeconds: 7200, now: 1_790_000_000_000, randomBytes: (n) => Buffer.alloc(n, 9) })
  assert.ok(issued.ok)
  assert.equal(issued.token, token)
})

test('the copied token module only imports node:crypto (portable, no env, no logging)', () => {
  const src = readFileSync(new URL('./test-session-token.ts', import.meta.url), 'utf8')
  assert.deepEqual([...src.matchAll(/^import .* from '([^']+)'/gm)].map((m) => m[1]), ['node:crypto'])
  assert.doesNotMatch(src, /process\.env|console\./)
  assert.match(src, /timingSafeEqual\(given, expected\)/)
})

test('verification outcomes through the DriveSet wrapper: valid, bad signature, expired, wrong project, malformed, secret missing, versions', () => {
  const t = issue({ now: Date.now() }).token
  assert.equal(verifyTestToken(t).valid, true)
  const [p, payload, sig] = t.split('.')
  assert.deepEqual(verifyTestToken(`${p}.${payload}.${(sig[0] === 'A' ? 'B' : 'A') + sig.slice(1)}`), { valid: false, reason: 'bad_signature' })
  assert.deepEqual(verifyTestToken(issue({ now: Date.now() - 3 * 3600_000 }).token), { valid: false, reason: 'expired' })
  assert.deepEqual(verifyTestToken(issue({ project: 'other', now: Date.now() }).token), { valid: false, reason: 'wrong_project' })
  assert.deepEqual(verifyTestToken('garbage'), { valid: false, reason: 'malformed' })
  assert.deepEqual(verifyTestToken(t, {}), { valid: false, reason: 'secret_not_configured' })
  assert.deepEqual(verifyTestToken(issue({ keyVersion: 2, now: Date.now() }).token), { valid: false, reason: 'unsupported_key_version' })
})

// ---- GET /olnoo-test ---------------------------------------------------------------------------------

test('valid link: 303 to the clean "/" with the test cookie; the redirect carries no token, no query, no body', async () => {
  const t = issue({ now: Date.now() })
  const r = await enter(link(t.token))
  assert.equal(r.status, 303)
  assert.equal(r.headers.get('location'), '/')
  assert.equal(r.headers.get('cache-control'), 'no-store')
  assert.equal(r.body, null)
  for (const [name, value] of r.headers) if (name !== 'set-cookie') assert.ok(!value.includes('olnoo-t1'), name)
  assert.ok(setCookie(r)!.startsWith(`${TEST_COOKIE_NAME}=${t.token};`))
})

test('cookie attributes: HttpOnly, Secure, SameSite=Lax, Path=/, host-only, expiry equals the token expiry (no rolling)', async () => {
  const now = Date.now()
  const t = issue({ now, ttlSeconds: 600 })
  const c = setCookie(await enter(link(t.token)))!
  const attrs = c.split(';').map((s) => s.trim())
  assert.ok(attrs.includes('HttpOnly') && attrs.includes('Secure') && attrs.includes('SameSite=Lax') && attrs.includes('Path=/'))
  assert.ok(!attrs.some((a) => /^Domain=/i.test(a))) // host-only
  assert.equal(attrs.find((a) => a.startsWith('Expires='))!.slice(8), t.expiresAt.toUTCString())
  const maxAge = Number(attrs.find((a) => a.startsWith('Max-Age='))!.slice(8))
  assert.ok(maxAge > 590 && maxAge <= 600, String(maxAge))
  assert.equal(buildSetCookie('x.y.z', new Date(1000), 5_000), 'olnoo_test=x.y.z; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0; HttpOnly; Secure; SameSite=Lax') // already expired → Max-Age 0, never negative
})

test('invalid, tampered, expired, wrong-project, missing and secret-less links set NO cookie and redirect the same way', async () => {
  const good = issue({ now: Date.now() }).token
  const [p, payload, sig] = good.split('.')
  const cases: [string, string | null, Record<string, string | undefined>?][] = [
    ['garbage', 'garbage'], ['tampered payload', `${p}.${b64(JSON.stringify({ ...JSON.parse(Buffer.from(payload, 'base64url').toString()), exp: 9_999_999_999 }))}.${sig}`],
    ['bad signature', `${p}.${payload}.${(sig[0] === 'A' ? 'B' : 'A') + sig.slice(1)}`], ['expired', issue({ now: Date.now() - 3 * 3600_000 }).token],
    ['wrong project', issue({ project: 'other', now: Date.now() }).token], ['missing t', null], ['empty t', ''],
  ]
  for (const [name, token] of cases) {
    const r = await enter(link(token))
    assert.equal(r.status, 303, name)
    assert.equal(r.headers.get('location'), '/', name)
    assert.equal(setCookie(r), null, name)
  }
  delete process.env.OLNOO_TEST_SECRET_DRIVESET // fail closed without the secret
  const r = await enter(link(good))
  assert.deepEqual([r.status, r.headers.get('location'), setCookie(r)], [303, '/', null])
})

// ---- GET /api/olnoo-test/status ------------------------------------------------------------------------

test('status: a valid cookie → test:true with expiry and session id; the token is never returned', async () => {
  const t = issue({ now: Date.now() })
  const r = await status(new Request('https://driveset.ru/api/olnoo-test/status', { headers: { cookie: `a=1; ${TEST_COOKIE_NAME}=${t.token}; b=2` } }))
  assert.equal(r.headers.get('cache-control'), 'no-store')
  assert.equal(r.headers.get('set-cookie'), null) // read-only, never refreshes the cookie
  const body = await r.json()
  assert.deepEqual(body, { test: true, expiresAt: t.expiresAt.toISOString(), sessionId: t.sessionId })
  assert.ok(!JSON.stringify(body).includes(t.token) && !JSON.stringify(body).includes(SECRET))
})

test('status: no cookie, garbage, tampered, expired, wrong project, secret missing → test:false (presence alone proves nothing)', async () => {
  const good = issue({ now: Date.now() }).token
  const [p, payload, sig] = good.split('.')
  const bad = [
    null, `${TEST_COOKIE_NAME}=garbage`, `${TEST_COOKIE_NAME}=${p}.${payload}.${(sig[0] === 'A' ? 'B' : 'A') + sig.slice(1)}`,
    `${TEST_COOKIE_NAME}=${issue({ now: Date.now() - 3 * 3600_000 }).token}`, `${TEST_COOKIE_NAME}=${issue({ project: 'other', now: Date.now() }).token}`, `other=${good}`, `${TEST_COOKIE_NAME}=`,
  ]
  for (const cookie of bad) assert.deepEqual(await statusOf(cookie), { test: false }, String(cookie))
  delete process.env.OLNOO_TEST_SECRET_DRIVESET
  assert.deepEqual(await statusOf(`${TEST_COOKIE_NAME}=${good}`), { test: false })
  assert.deepEqual(statusFromCookieHeader(`${TEST_COOKIE_NAME}=${good}`, { OLNOO_TEST_SECRET_DRIVESET: SECRET }), { test: true, expiresAt: new Date(JSON.parse(Buffer.from(good.split('.')[1], 'base64url').toString()).exp * 1000).toISOString(), sessionId: JSON.parse(Buffer.from(good.split('.')[1], 'base64url').toString()).sid })
  assert.equal(readCookie('a=1; olnoo_test=abc; b=2', 'olnoo_test'), 'abc')
  assert.equal(readCookie('xolnoo_test=abc', 'olnoo_test'), null)
})

// ---- no leaks ------------------------------------------------------------------------------------------

test('no leak: nothing logs, the secret is never NEXT_PUBLIC_, client modules never import the token module, the routes only read', () => {
  const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8')
  for (const file of ['./test-session.ts', './test-session-token.ts', '../app/olnoo-test/route.ts', '../app/api/olnoo-test/status/route.ts']) {
    assert.doesNotMatch(read(file), /console\.(log|info|warn|error|debug)/, file)
  }
  const clientFiles = ['./test-session-client.ts', './test-session-state.ts', './marketing-events.ts', '../components/marketing-bootstrap.tsx']
  for (const file of clientFiles) {
    const src = read(file)
    assert.doesNotMatch(src, /test-session-token|TEST_SECRET|from '\.\/test-session\.ts'|olnoo_test\b/, file) // no verifier, no secret, no cookie name in browser code
    assert.doesNotMatch(src, /localStorage\.setItem\([^)]*(token|olnoo)/i, file)
  }
  const everything = [read('./test-session.ts'), read('../app/olnoo-test/route.ts'), read('../.env.production')].join('\n')
  assert.doesNotMatch(everything, /NEXT_PUBLIC_[A-Z_]*TEST_SECRET/)
  assert.doesNotMatch(read('../.env.production'), /OLNOO_TEST_SECRET/) // the secret is never committed
  assert.doesNotMatch(read('../app/olnoo-test/route.ts') + read('../app/api/olnoo-test/status/route.ts'), /Set-Cookie['"]?\s*,\s*['"]\s*;|\.delete\(|cookies\(/)
})
