import { NextResponse } from 'next/server'
import { sendAdminDigestEmail } from '@/lib/email/send-admin-digest'

/**
 * Scheduled digest (e.g. Vercel Cron). Protect with CRON_SECRET.
 * Headers: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'

  if (isProd && !secret) {
    return NextResponse.json({ ok: false, error: 'CRON_SECRET not configured' }, { status: 500 })
  }

  if (secret) {
    const auth = request.headers.get('authorization')
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null
    if (token !== secret) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
  }

  const result = await sendAdminDigestEmail()
  return NextResponse.json({ ok: result.sent, ...result })
}

export const dynamic = 'force-dynamic'
