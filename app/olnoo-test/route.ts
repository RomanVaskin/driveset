import { buildSetCookie, verifyTestToken } from '../../lib/test-session.ts'

export const dynamic = 'force-dynamic'

/**
 * Entry point of a signed Test Link: GET /olnoo-test?t=<token> (issued by olnoo-admin). A valid token sets the host-only
 * httpOnly test cookie; every outcome — valid, invalid, expired, missing, secret not configured — answers the same
 * body-less 303 to the clean URL "/", so the token never reaches client JS, the address bar, the first-touch landing URL
 * or Metrika, and the reason is never revealed. Fail-closed: no cookie unless the token verifies. The token is not logged.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('t')
  const headers = new Headers({ Location: '/', 'Cache-Control': 'no-store' })
  if (token) {
    const result = verifyTestToken(token)
    if (result.valid) headers.append('Set-Cookie', buildSetCookie(token, result.expiresAt))
  }
  return new Response(null, { status: 303, headers })
}
