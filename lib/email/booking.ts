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
  name: string
  phone: string
  email?: string | null
  address: string
  serviceType: string
  preferredDate?: string | null
  preferredTime?: string | null
  notes?: string | null
}

function ownerHtml(b: BookingEmailPayload) {
  return `
<h2 style="color:#0b3a62">New Booking Request — ${label(b.serviceType)}</h2>
<table cellpadding="6" style="border-collapse:collapse;width:100%;max-width:600px">
  <tr><td style="font-weight:bold;width:160px">Customer</td><td>${b.name}</td></tr>
  <tr><td style="font-weight:bold">Phone</td><td><a href="tel:${b.phone}">${b.phone}</a></td></tr>
  ${b.email ? `<tr><td style="font-weight:bold">Email</td><td><a href="mailto:${b.email}">${b.email}</a></td></tr>` : ''}
  <tr><td style="font-weight:bold">Service</td><td>${label(b.serviceType)}</td></tr>
  <tr><td style="font-weight:bold">Address</td><td>${b.address}</td></tr>
  ${b.preferredDate ? `<tr><td style="font-weight:bold">Preferred Date</td><td>${b.preferredDate}</td></tr>` : ''}
  ${b.preferredTime ? `<tr><td style="font-weight:bold">Preferred Time</td><td>${b.preferredTime}</td></tr>` : ''}
  ${b.notes ? `<tr><td style="font-weight:bold">Notes</td><td>${b.notes}</td></tr>` : ''}
</table>
<p style="margin-top:24px;color:#555">Log in to the <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/bookings">admin portal</a> to update this booking.</p>
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
<p style="color:#555;font-size:13px;margin-top:32px">${SITE.businessName} &bull; ${SITE.city}, ${SITE.state}</p>
  `.trim()
}

export async function sendBookingEmails(booking: BookingEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[booking-email] RESEND_API_KEY not set — skipping email')
    return
  }

  const resend = new Resend(apiKey)
  const from = process.env.RESEND_FROM_EMAIL ?? 'MS & P LLC <onboarding@resend.dev>'
  const ownerEmail = process.env.OWNER_EMAIL ?? SITE.email

  await Promise.allSettled([
    resend.emails.send({
      from,
      to: [ownerEmail],
      subject: `New Booking — ${label(booking.serviceType)} — ${booking.name}`,
      html: ownerHtml(booking),
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
