import { NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { sendBookingEmails } from '@/lib/email/booking'

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(5),
  serviceType: z.string().min(1),
  preferredDate: z.string().optional().nullable(),
  preferredTime: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  sourcePath: z.string().optional(),
  formVariant: z.string().optional(),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? 'Validation error' },
      { status: 422 },
    )
  }

  const d = parsed.data

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      full_name: d.name,
      phone: d.phone,
      email: d.email || null,
      service_type: d.serviceType,
      address: d.address,
      preferred_date: d.preferredDate || null,
      preferred_time: d.preferredTime || null,
      description: d.notes || null,
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) {
    console.error('[booking] supabase insert error', error.message)
    return NextResponse.json({ success: false, error: 'Failed to save booking' }, { status: 500 })
  }

  sendBookingEmails({
    name: d.name,
    phone: d.phone,
    email: d.email || null,
    address: d.address,
    serviceType: d.serviceType,
    preferredDate: d.preferredDate,
    preferredTime: d.preferredTime,
    notes: d.notes,
  }).catch((err) => console.error('[booking] email error', err))

  return NextResponse.json({ success: true, id: booking.id })
}
