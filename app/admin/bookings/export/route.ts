import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminBookings } from '@/lib/admin/queries'

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export async function GET(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const url = new URL(req.url)
  const from = url.searchParams.get('from')?.trim() ?? ''
  const to = url.searchParams.get('to')?.trim() ?? ''

  const rows = await getAdminBookings()
  let filtered = rows
  if (from) filtered = filtered.filter((r) => r.preferredDate >= from)
  if (to) filtered = filtered.filter((r) => r.preferredDate <= to)

  const header = [
    'id',
    'customer_name',
    'phone',
    'email',
    'address',
    'service',
    'preferred_date',
    'time_slot',
    'status',
    'created_at',
  ]

  const lines = [
    header.join(','),
    ...filtered.map((r) =>
      [
        r.id,
        r.customerName,
        r.phone,
        r.email,
        r.address,
        r.serviceType,
        r.preferredDate,
        r.preferredTimeSlot,
        r.status,
        r.createdAt,
      ]
        .map((c) => csvEscape(String(c)))
        .join(','),
    ),
  ]

  return new NextResponse(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="bookings-export.csv"',
    },
  })
}
