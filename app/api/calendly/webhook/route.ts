import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { getServiceRoleClient } from '@/lib/supabase/service-role'

type CalendlyPayload = {
  event?: string
  payload?: {
    event?: {
      uri?: string
      name?: string
      start_time?: string
    }
    invitee?: {
      uri?: string
      name?: string
      email?: string
      text_reminder_number?: string
      status?: string
      canceled?: boolean
      cancel_url?: string
    }
    questions_and_answers?: Array<{ question?: string; answer?: string }>
    tracking?: Record<string, unknown>
  }
}

function deriveTimeSlot(startIso?: string): string {
  if (!startIso) return 'asap'
  const hour = new Date(startIso).getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

function confirmationFromInviteeUri(uri: string | undefined): string {
  const raw = (uri ?? '').split('/').filter(Boolean).pop() ?? `${Date.now()}`
  const short = raw.replace(/[^a-zA-Z0-9]/g, '').slice(-8).toUpperCase()
  return `CLD-${short || 'UNKNOWN'}`
}

function joinAnswers(
  questionsAndAnswers: Array<{ question?: string; answer?: string }> | undefined,
): string {
  if (!questionsAndAnswers?.length) return 'Submitted via Calendly'
  const lines = questionsAndAnswers
    .map((q) => `${q.question ?? 'Question'}: ${q.answer ?? ''}`.trim())
    .filter(Boolean)
  return lines.join('\n')
}

function ensureWebhookToken(request: Request): boolean {
  const expected = process.env.CALENDLY_WEBHOOK_TOKEN?.trim()
  if (!expected) return true
  const url = new URL(request.url)
  const received = url.searchParams.get('token')?.trim()
  return Boolean(received && received === expected)
}

async function findBookingByInviteeUri(
  db: NonNullable<ReturnType<typeof getServiceRoleClient>>,
  inviteeUri: string,
): Promise<string | null> {
  const { data } = await db
    .from('booking_events')
    .select('booking_id')
    .eq('event_type', 'calendly_invitee_created')
    .contains('payload', { invitee_uri: inviteeUri })
    .maybeSingle()
  return data?.booking_id ? String(data.booking_id) : null
}

export async function POST(request: Request) {
  if (!ensureWebhookToken(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized webhook token' }, { status: 401 })
  }

  const db = getServiceRoleClient()
  if (!db) {
    return NextResponse.json({ success: false, error: 'Service role unavailable' }, { status: 503 })
  }

  let body: CalendlyPayload
  try {
    body = (await request.json()) as CalendlyPayload
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const eventType = String(body.event ?? '')
  const invitee = body.payload?.invitee
  const event = body.payload?.event
  const inviteeUri = String(invitee?.uri ?? '')

  if (!eventType || !inviteeUri) {
    return NextResponse.json({ success: false, error: 'Missing Calendly event or invitee uri' }, { status: 400 })
  }

  if (eventType === 'invitee.created') {
    const existingBookingId = await findBookingByInviteeUri(db, inviteeUri)
    if (existingBookingId) {
      return NextResponse.json({ success: true, booking_id: existingBookingId, deduped: true })
    }

    const fullName = String(invitee?.name ?? 'Calendly customer')
    const email = String(invitee?.email ?? '—')
    const phone = String(invitee?.text_reminder_number ?? '—')
    const preferredDate = String(event?.start_time ?? '').slice(0, 10) || new Date().toISOString().slice(0, 10)
    const preferredTimeSlot = deriveTimeSlot(event?.start_time)
    const serviceType = String(event?.name ?? 'Calendly booking')
    const description = joinAnswers(body.payload?.questions_and_answers)
    const confirmationCode = confirmationFromInviteeUri(inviteeUri)

    const { data: customer, error: customerError } = await db
      .from('customers')
      .insert({
        full_name: fullName,
        email,
        phone,
        address: 'Captured in Calendly',
        city: 'New Orleans',
        zip_code: '—',
      })
      .select('id')
      .single()
    if (customerError || !customer) {
      return NextResponse.json({ success: false, error: customerError?.message ?? 'Customer insert failed' }, { status: 500 })
    }

    const { data: booking, error: bookingError } = await db
      .from('bookings')
      .insert({
        customer_id: customer.id,
        confirmation_code: confirmationCode,
        service_type: serviceType,
        description,
        preferred_date: preferredDate,
        preferred_time_slot: preferredTimeSlot,
        urgency: 'standard',
        status: 'confirmed',
      })
      .select('id')
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ success: false, error: bookingError?.message ?? 'Booking insert failed' }, { status: 500 })
    }

    await db.from('booking_events').insert({
      booking_id: booking.id,
      event_type: 'calendly_invitee_created',
      payload: {
        calendly_event_type: eventType,
        calendly_event_uri: event?.uri ?? null,
        invitee_uri: inviteeUri,
        tracking: body.payload?.tracking ?? null,
      },
    })

    revalidatePath('/admin/bookings')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/today')
    revalidatePath('/admin/insights')
    revalidatePath('/admin/activity')

    return NextResponse.json({ success: true, booking_id: booking.id })
  }

  if (eventType === 'invitee.canceled') {
    const bookingId = await findBookingByInviteeUri(db, inviteeUri)
    if (!bookingId) {
      return NextResponse.json({ success: true, skipped: true, reason: 'Booking not found for cancellation event' })
    }

    await db.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)
    await db.from('booking_events').insert({
      booking_id: bookingId,
      event_type: 'calendly_invitee_canceled',
      payload: {
        calendly_event_type: eventType,
        calendly_event_uri: event?.uri ?? null,
        invitee_uri: inviteeUri,
      },
    })

    revalidatePath('/admin/bookings')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/today')
    revalidatePath('/admin/insights')
    revalidatePath('/admin/activity')

    return NextResponse.json({ success: true, booking_id: bookingId, status: 'cancelled' })
  }

  return NextResponse.json({ success: true, ignored: true, eventType })
}
