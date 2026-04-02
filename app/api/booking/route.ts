import { createClient } from '@supabase/supabase-js'
import { getServiceRoleClient } from '@/lib/supabase/service-role'
import { notifyAllStaff } from '@/lib/admin/staff-notifications'
import { SITE } from '@/lib/site'
import { NextResponse } from 'next/server'

/** Maps `/book` (snake_case) and `BookingModal` (camelCase) payloads to DB columns. */
function normalizeBookingPayload(body: Record<string, unknown>) {
  const str = (v: unknown) => (v == null ? '' : String(v).trim())

  const full_name = str(body.full_name) || str(body.name)
  const email = str(body.email)
  const phone = str(body.phone)
  const address = str(body.address)
  const city = str(body.city) || SITE.city
  const zip_code = str(body.zip_code)
  const service_type = str(body.service_type) || str(body.serviceType)
  const description = str(body.description) || str(body.notes) || '—'
  const preferred_raw = str(body.preferred_date) || str(body.preferredDate)
  const preferred_date =
    preferred_raw.length > 0 ? preferred_raw : new Date().toISOString().slice(0, 10)
  const preferred_time_slot =
    str(body.preferred_time_slot) || str(body.preferredTime) || 'Morning'
  const urgency = str(body.urgency) || 'standard'
  const source_path = str(body.sourcePath) || '/'
  const form_variant = str(body.formVariant) || 'unknown'

  return {
    full_name,
    email,
    phone,
    address,
    city,
    zip_code,
    service_type,
    description,
    preferred_date,
    preferred_time_slot,
    urgency,
    source_path,
    form_variant,
  }
}

function formatRouteError(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message?: string }).message
    if (typeof msg === 'string' && msg.length > 0) {
      const details = (error as { details?: string }).details
      const hint = (error as { hint?: string }).hint
      const code = (error as { code?: string }).code
      if (process.env.NODE_ENV === 'development' && (details || hint || code)) {
        return [msg, code && `code=${code}`, details && `details=${details}`, hint && `hint=${hint}`]
          .filter(Boolean)
          .join(' | ')
      }
      return msg
    }
  }
  if (error instanceof Error) return error.message
  return String(error)
}

function isUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const code = (error as { code?: string }).code
  return code === '23505'
}

function isMissingFunnelEventsTable(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const code = (error as { code?: string }).code
  return code === 'PGRST205'
}

export async function POST(request: Request) {
  // Create anon client lazily so module evaluation doesn't run at build time.
  const db =
    getServiceRoleClient() ??
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const p = normalizeBookingPayload(body)

    if (!p.full_name || !p.phone || !p.address || !p.service_type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields (name, phone, address, service type).',
        },
        { status: 400 }
      )
    }

    const { data: customer, error: customerError } = await db
      .from('customers')
      .insert({
        full_name: p.full_name,
        email: p.email || '—',
        phone: p.phone,
        address: p.address,
        city: p.city,
        zip_code: p.zip_code || '—',
      })
      .select()
      .single()

    if (customerError) throw customerError
    if (!customer) throw new Error('Customer insert returned no row')

    let bookingRow: { id: string } | null = null
    let confirmationCode = ''
    let lastBookingError: unknown = null

    // Retry on rare confirmation-code collisions (bookings.confirmation_code is unique).
    for (let attempt = 0; attempt < 5; attempt += 1) {
      confirmationCode = `PLM-${Math.floor(Math.random() * 90000) + 10000}`
      const { data, error } = await db
        .from('bookings')
        .insert({
          customer_id: customer.id,
          confirmation_code: confirmationCode,
          service_type: p.service_type,
          description: p.description,
          preferred_date: p.preferred_date,
          preferred_time_slot: p.preferred_time_slot,
          urgency: p.urgency,
          status: 'pending',
        })
        .select('id')
        .single()

      if (!error) {
        bookingRow = data
        break
      }
      lastBookingError = error
      if (!isUniqueViolation(error)) break
    }

    if (!bookingRow?.id) {
      if (lastBookingError) throw lastBookingError
      throw new Error('Booking insert returned no id')
    }

    await notifyAllStaff({
      kind: 'new_booking',
      title: `New booking: ${p.full_name}`,
      body: `${p.service_type} · ${p.preferred_date}`,
      bookingId: String(bookingRow.id),
      dedupeKey: `new-booking-${bookingRow.id}`,
    })

    const { error: funnelError } = await db.from('booking_funnel_events').insert({
      event_type: 'submit',
      source_path: p.source_path,
      form_variant: p.form_variant,
    })
    if (funnelError && !isMissingFunnelEventsTable(funnelError)) {
      console.error('[api/booking] funnel event insert failed', formatRouteError(funnelError))
    }

    return NextResponse.json({
      success: true,
      confirmation_code: confirmationCode,
    })
  } catch (error) {
    const message = formatRouteError(error)
    console.error('[api/booking]', error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
