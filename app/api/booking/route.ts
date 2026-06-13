import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createBooking } from '@/lib/airtable'

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

  try {
    const { id } = await createBooking({
      name: d.name,
      email: d.email || null,
      phone: d.phone,
      service: d.serviceType,
      date: d.preferredDate || null,
      time: d.preferredTime || null,
      notes: d.notes || null,
    })
    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error('[booking] airtable error', err)
    return NextResponse.json({ success: false, error: 'Failed to save booking' }, { status: 500 })
  }
}
