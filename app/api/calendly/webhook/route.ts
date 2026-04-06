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

function isMissingBookingEventsTable(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const code = (error as { code?: string }).code
  const message = String((error as { message?: string }).message ?? '')
  return code === '42P01' || message.includes('booking_events')
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

function normalizePhone(raw: string | undefined): string {
  const digits = String(raw ?? '').replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`
  }
  if (digits.length === 10) {
    return `+1${digits}`
  }
  return String(raw ?? '').trim()
}

function answerForQuestion(
  questionsAndAnswers: Array<{ question?: string; answer?: string }> | undefined,
  pattern: RegExp,
): string | null {
  const row = questionsAndAnswers?.find((q) => pattern.test(String(q.question ?? '')))
  const value = String(row?.answer ?? '').trim()
  return value || null
}

async function findOrCreateCustomerId(
  db: NonNullable<ReturnType<typeof getServiceRoleClient>>,
  params: {
    fullName: string
    email: string
    phone: string
    address: string
  },
): Promise<string> {
  const email = params.email.trim()
  const phone = params.phone.trim()

  if (email && email !== '—') {
    const byEmail = await db
      .from('customers')
      .select('id')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (byEmail.data?.id) return String(byEmail.data.id)
  }

  if (phone && phone !== '—') {
    const byPhone = await db
      .from('customers')
      .select('id')
      .eq('phone', phone)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (byPhone.data?.id) return String(byPhone.data.id)
  }

  const { data: customer, error: customerError } = await db
    .from('customers')
    .insert({
      full_name: params.fullName,
      email: email || '—',
      phone: phone || '—',
      address: params.address || 'Captured in Calendly',
      city: 'New Orleans',
      zip_code: '—',
    })
    .select('id')
    .single()
  if (customerError || !customer) {
    throw new Error(customerError?.message ?? 'Customer insert failed')
  }
  return String(customer.id)
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
  const { data, error } = await db
    .from('booking_events')
    .select('booking_id')
    .eq('event_type', 'calendly_invitee_created')
    .contains('payload', { invitee_uri: inviteeUri })
    .maybeSingle()
  if (error) {
    if (isMissingBookingEventsTable(error)) {
      console.warn('[api/calendly/webhook] booking_events table missing; dedupe unavailable')
      return null
    }
    throw error
  }
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
  console.info('[api/calendly/webhook] received', { eventType, inviteeUri })

  if (eventType === 'invitee.created') {
    const existingBookingId = await findBookingByInviteeUri(db, inviteeUri)
    if (existingBookingId) {
      return NextResponse.json({ success: true, booking_id: existingBookingId, deduped: true })
    }

    const answers = body.payload?.questions_and_answers
    const fullName = String(invitee?.name ?? 'Calendly customer')
    const email = String(invitee?.email ?? '—')
    const qaAddress =
      answerForQuestion(answers, /address|service address|property address/i) ?? 'Captured in Calendly'
    const qaPhone = answerForQuestion(answers, /phone|best number|contact number/i)
    const phone = normalizePhone(String(invitee?.text_reminder_number ?? qaPhone ?? '—'))
    const preferredDate = String(event?.start_time ?? '').slice(0, 10) || new Date().toISOString().slice(0, 10)
    const preferredTimeSlot = deriveTimeSlot(event?.start_time)
    const serviceType = String(event?.name ?? 'Calendly booking')
    const description = joinAnswers(answers)
    const confirmationCode = confirmationFromInviteeUri(inviteeUri)

    let customerId = ''
    try {
      customerId = await findOrCreateCustomerId(db, {
        fullName,
        email,
        phone,
        address: qaAddress,
      })
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Customer upsert failed'
      return NextResponse.json({ success: false, error: msg }, { status: 500 })
    }

    const { data: booking, error: bookingError } = await db
      .from('bookings')
      .insert({
        customer_id: customerId,
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

    const { error: eventInsertError } = await db.from('booking_events').insert({
      booking_id: booking.id,
      event_type: 'calendly_invitee_created',
      payload: {
        calendly_event_type: eventType,
        calendly_event_uri: event?.uri ?? null,
        invitee_uri: inviteeUri,
        tracking: body.payload?.tracking ?? null,
        answers,
      },
    })
    if (eventInsertError) {
      if (isMissingBookingEventsTable(eventInsertError)) {
        console.warn('[api/calendly/webhook] booking_events missing; booking created without event log', {
          bookingId: booking.id,
        })
      } else {
        console.error('[api/calendly/webhook] event insert failed', eventInsertError)
      }
    }

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
    const { error: cancelEventInsertError } = await db.from('booking_events').insert({
      booking_id: bookingId,
      event_type: 'calendly_invitee_canceled',
      payload: {
        calendly_event_type: eventType,
        calendly_event_uri: event?.uri ?? null,
        invitee_uri: inviteeUri,
      },
    })
    if (cancelEventInsertError) {
      if (isMissingBookingEventsTable(cancelEventInsertError)) {
        console.warn('[api/calendly/webhook] booking_events missing; cancellation logged only on bookings table', {
          bookingId,
        })
      } else {
        console.error('[api/calendly/webhook] cancellation event insert failed', cancelEventInsertError)
      }
    }

    revalidatePath('/admin/bookings')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/today')
    revalidatePath('/admin/insights')
    revalidatePath('/admin/activity')

    return NextResponse.json({ success: true, booking_id: bookingId, status: 'cancelled' })
  }

  return NextResponse.json({ success: true, ignored: true, eventType })
}
