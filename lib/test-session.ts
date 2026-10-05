// DriveSet side of Test Mode (Test Traffic v1, PR C): verify the signed test token issued by olnoo-admin, keep it in a
// host-only httpOnly cookie until the token's own expiry, and answer "is a test session active?" server-side.
// The token verifier is lib/test-session-token.ts, copied VERBATIM from olnoo-admin (spec version 1); nothing here
// re-implements it. Server-only: the secret is read from the server env (never NEXT_PUBLIC_), the token is never logged,
// never put in a response body and never given to client JS. No database, no server-side session store.

import { verifyTestSessionToken, type VerifyResult } from './test-session-token.ts'

export const TEST_COOKIE_NAME = 'olnoo_test'
export const TEST_PROJECT = 'driveset'
export const TEST_SECRET_ENV = 'OLNOO_TEST_SECRET_DRIVESET'

type Env = Record<string, string | undefined>

/** Key version → secret. Only version 1 exists; a second one (rotation) is one more entry here. */
export function testSecrets(env: Env = process.env) {
  return { 1: env[TEST_SECRET_ENV]?.trim() || undefined }
}

export function verifyTestToken(token: unknown, env: Env = process.env, now: number = Date.now()): VerifyResult {
  return verifyTestSessionToken(token, { project: TEST_PROJECT, secrets: testSecrets(env), now })
}

/**
 * The Set-Cookie value for a verified token. Host-only (no Domain), Path=/, HttpOnly, Secure, SameSite=Lax, and valid
 * for exactly the remaining life of the token: no refresh, no rolling session. The token is base64url + dots, so it
 * needs no escaping.
 */
export function buildSetCookie(token: string, expiresAt: Date, now: number = Date.now()): string {
  const maxAge = Math.max(0, Math.floor((expiresAt.getTime() - now) / 1000))
  return `${TEST_COOKIE_NAME}=${token}; Path=/; Expires=${expiresAt.toUTCString()}; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`
}

/** Value of one cookie from a `Cookie` request header, or null. */
export function readCookie(header: string | null | undefined, name: string): string | null {
  if (!header) return null
  for (const part of header.split(';')) {
    const eq = part.indexOf('=')
    if (eq > 0 && part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim()
  }
  return null
}

export type TestSessionStatus = { test: true; expiresAt: string; sessionId: string } | { test: false }

/** Re-validates the cookie on every call (presence alone proves nothing). The token itself is never returned. */
export function statusFromCookieHeader(header: string | null | undefined, env: Env = process.env, now: number = Date.now()): TestSessionStatus {
  const token = readCookie(header, TEST_COOKIE_NAME)
  if (!token) return { test: false }
  const result = verifyTestToken(token, env, now)
  return result.valid ? { test: true, expiresAt: result.expiresAt.toISOString(), sessionId: result.sessionId } : { test: false }
}
