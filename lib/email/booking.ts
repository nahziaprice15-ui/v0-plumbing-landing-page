import { Resend } from 'resend'
import { SITE } from '@/lib/site'

const SERVICE_LABELS: Record<string, string> = {
  emergency: 'Emergency Plumbing',
  drain: 'Drain Cleaning',
  'water-heater': 'Water Heater Service',
  leak: 'Leak Detection & Repair',
  installation: 'Fixture / Bathroom Installation',
  other: 'Other / Not Sure',
}

function label(serviceType: string) {
  return SERVICE_LABELS[serviceType] ?? serviceType
}

export interface BookingEmailPayload {
  id?: string
  name: string
  phone: string
  email?: string | null
  address: string
  serviceType: string
  preferredDate?: string | null
  preferredTime?: string | null
  notes?: string | null
}

// ── iCal generation ───────────────────────────────────────────────────────────

const TIME_SLOT_HOURS: Record<string, number> = {
  morning: 9,
  afternoon: 13,
  evening: 17,
  asap: 9,
}

function toIcalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function buildIcal(b: BookingEmailPayload): string {
  const now = new Date()
  const uid = `${b.id ?? Date.now()}@mspllcs.com`

  let startHour = 9
  if (b.preferredTime) {
    startHour = TIME_SLOT_HOURS[b.preferredTime.toLowerCase()] ?? 9
  }

  let startDate: Date
  if (b.preferredDate) {
    // preferredDate is YYYY-MM-DD — build a local date at the chosen hour
    const [year, month, day] = b.preferredDate.split('-').map(Number)
    startDate = new Date(year, month - 1, day, startHour, 0, 0)
  } else {
    // No date chosen — schedule for tomorrow at 9 AM
    startDate = new Date(now)
    startDate.setDate(startDate.getDate() + 1)
    startDate.setHours(9, 0, 0, 0)
  }

  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // +2 hours

  const ownerEmail = process.env.OWNER_EMAIL ?? SITE.email
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mspllcs.com'

  const description = [
    `Customer: ${b.name}`,
    `Phone: ${b.phone}`,
    b.email ? `Email: ${b.email}` : null,
    `Service: ${label(b.serviceType)}`,
    `Address: ${b.address}`,
    b.preferredTime ? `Time slot: ${b.preferredTime}` : null,
    b.notes ? `Notes: ${b.notes}` : null,
    '',
    `Manage booking: ${siteUrl}/admin/bookings`,
  ]
    .filter(Boolean)
    .join('\\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${SITE.businessName}//Booking//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcalDate(now)}`,
    `DTSTART:${toIcalDate(startDate)}`,
    `DTEND:${toIcalDate(endDate)}`,
    `SUMMARY:${label(b.serviceType)} — ${b.name}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${b.address}`,
    `ORGANIZER;CN=${SITE.businessName}:mailto:${ownerEmail}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

// ── Email HTML ────────────────────────────────────────────────────────────────

function ownerHtml(b: BookingEmailPayload) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mspllcs.com'
  return `
<h2 style="color:#0b3a62">New Booking Request — ${label(b.serviceType)}</h2>
<p style="background:#fff3cd;border:1px solid #ffc107;padding:10px 14px;border-radius:6px;font-size:14px">
  📅 A Google Calendar invite is attached to this email. Open it to add the appointment to your calendar.
</p>
<table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:600px;margin-top:16px">
  <tr><td style="font-weight:bold;width:160px">Customer</td><td>${b.name}</td></tr>
  <tr><td style="font-weight:bold">Phone</td><td><a href="tel:${b.phone}">${b.phone}</a></td></tr>
  ${b.email ? `<tr><td style="font-weight:bold">Email</td><td><a href="mailto:${b.email}">${b.email}</a></td></tr>` : ''}
  <tr><td style="font-weight:bold">Service</td><td>${label(b.serviceType)}</td></tr>
  <tr><td style="font-weight:bold">Address</td><td>${b.address}</td></tr>
  ${b.preferredDate ? `<tr><td style="font-weight:bold">Preferred Date</td><td>${b.preferredDate}</td></tr>` : ''}
  ${b.preferredTime ? `<tr><td style="font-weight:bold">Preferred Time</td><td>${b.preferredTime}</td></tr>` : ''}
  ${b.notes ? `<tr><td style="font-weight:bold">Customer Notes</td><td>${b.notes}</td></tr>` : ''}
</table>
<p style="margin-top:24px">
  <a href="${siteUrl}/admin/bookings" style="background:#0b3a62;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold">
    Open Admin Portal
  </a>
</p>
<p style="color:#888;font-size:12px;margin-top:32px">${SITE.businessName} &bull; ${SITE.city}, ${SITE.state}</p>
  `.trim()
}

function customerHtml(b: BookingEmailPayload) {
  return `
<h2 style="color:#0b3a62">We received your request, ${b.name.split(' ')[0]}!</h2>
<p>Thank you for reaching out to <strong>${SITE.businessName}</strong>. Here's a summary of what you submitted:</p>
<table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:600px">
  <tr><td style="font-weight:bold;width:160px">Service</td><td>${label(b.serviceType)}</td></tr>
  <tr><td style="font-weight:bold">Address</td><td>${b.address}</td></tr>
  ${b.preferredDate ? `<tr><td style="font-weight:bold">Preferred Date</td><td>${b.preferredDate}</td></tr>` : ''}
  ${b.preferredTime ? `<tr><td style="font-weight:bold">Preferred Time</td><td>${b.preferredTime}</td></tr>` : ''}
</table>
<p style="margin-top:24px">We'll call you at <strong>${b.phone}</strong> to confirm your appointment within 2 hours during business hours.</p>
<p>Need to reach us sooner? Call <a href="tel:${SITE.phoneTel}">${SITE.phoneDisplay}</a>.</p>
<p style="color:#888;font-size:13px;margin-top:32px">${SITE.businessName} &bull; ${SITE.city}, ${SITE.state}</p>
  `.trim()
}

// ── Send ──────────────────────────────────────────────────────────────────────

export async function sendBookingEmails(booking: BookingEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[booking-email] RESEND_API_KEY not set — skipping email')
    return
  }

  const resend = new Resend(apiKey)
  const from = process.env.RESEND_FROM_EMAIL ?? 'MS & P LLC <onboarding@resend.dev>'
  const ownerEmail = process.env.OWNER_EMAIL ?? SITE.email

  const icsContent = buildIcal(booking)
  const icsAttachment = {
    filename: 'booking.ics',
    content: Buffer.from(icsContent, 'utf-8').toString('base64'),
    contentType: 'text/calendar; charset=utf-8; method=REQUEST',
  }

  await Promise.allSettled([
    resend.emails.send({
      from,
      to: [ownerEmail],
      subject: `📅 New Booking — ${label(booking.serviceType)} — ${booking.name}`,
      html: ownerHtml(booking),
      attachments: [icsAttachment],
    }),
    booking.email
      ? resend.emails.send({
          from,
          to: [booking.email],
          subject: `We received your request — ${SITE.businessName}`,
          html: customerHtml(booking),
        })
      : Promise.resolve(),
  ])
}
