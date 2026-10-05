import { statusFromCookieHeader } from '../../../../lib/test-session.ts'

export const dynamic = 'force-dynamic'

/**
 * GET /api/olnoo-test/status → { test: true, expiresAt, sessionId } for a cookie that verifies right now, otherwise
 * { test: false }. Read-only: it never sets or refreshes a cookie, never returns the token or a reason, never logs.
 */
export async function GET(request: Request) {
  return Response.json(statusFromCookieHeader(request.headers.get('cookie')), { headers: { 'Cache-Control': 'no-store' } })
}
