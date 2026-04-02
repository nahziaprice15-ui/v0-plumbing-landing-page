import { Resend } from 'resend'
import { getAdminDashboardMetrics, getAdminOperationalInsights } from '@/lib/admin/queries'

export type DigestResult = { sent: boolean; error?: string }

/**
 * Sends a low-noise operations digest to ADMIN_NOTIFY_EMAILS.
 * Requires RESEND_API_KEY and RESEND_FROM_EMAIL (verified sender in Resend).
 */
export async function sendAdminDigestEmail(): Promise<DigestResult> {
  const apiKey = process.env.RESEND_API_KEY
  const rawRecipients = process.env.ADMIN_NOTIFY_EMAILS?.trim()
  if (!apiKey) {
    console.warn('[admin-digest] RESEND_API_KEY not set; skip send')
    return { sent: false, error: 'missing_resend_key' }
  }
  if (!rawRecipients) {
    console.warn('[admin-digest] ADMIN_NOTIFY_EMAILS not set; skip send')
    return { sent: false, error: 'missing_recipients' }
  }

  const to = rawRecipients
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (to.length === 0) return { sent: false, error: 'empty_recipients' }

  const [insights, metrics] = await Promise.all([getAdminOperationalInsights(), getAdminDashboardMetrics()])
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  const adminUrl = base ? `${base}/admin/notifications` : '/admin/notifications'

  const from = process.env.RESEND_FROM_EMAIL ?? 'Admin <onboarding@resend.dev>'

  const html = `
    <h2>MS &amp; P — Admin digest</h2>
    <p><strong>Pending past ${insights.slaPendingThresholdHours}h SLA:</strong> ${insights.pendingOlderThanThreshold}</p>
    <p><strong>Pending confirmations (all):</strong> ${metrics.pendingConfirmations}</p>
    <p><a href="${adminUrl}">Open notifications</a></p>
    <p style="color:#666;font-size:12px">Automated message. Set RESEND_API_KEY, RESEND_FROM_EMAIL, ADMIN_NOTIFY_EMAILS, and CRON_SECRET.</p>
  `

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `[MS & P] Admin digest — ${insights.pendingOlderThanThreshold} past SLA`,
    html,
  })

  if (error) {
    console.error('[admin-digest]', error.message)
    return { sent: false, error: error.message }
  }

  return { sent: true }
}
