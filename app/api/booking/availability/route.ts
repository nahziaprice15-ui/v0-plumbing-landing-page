import { createClient } from '@supabase/supabase-js'
import { getDayAvailabilityForRange, parseIsoDateOnly } from '@/lib/booking-capacity'
import { getServiceRoleClient } from '@/lib/supabase/service-role'
import { NextResponse } from 'next/server'

const MAX_RANGE_DAYS = 120

function getDb() {
  const serviceRoleClient = getServiceRoleClient()
  const anonUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return (
    serviceRoleClient ??
    (anonUrl && anonKey ? createClient(anonUrl, anonKey) : null)
  )
}

/**
 * GET /api/booking/availability?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns per-day availability for disabling dates in booking UIs.
 */
export async function GET(request: Request) {
  const db = getDb()
  if (!db) {
    return NextResponse.json(
      { error: 'Booking service is temporarily unavailable.' },
      { status: 503 },
    )
  }

  const { searchParams } = new URL(request.url)
  const fromRaw = searchParams.get('from') ?? ''
  const toRaw = searchParams.get('to') ?? ''

  const fromDate = parseIsoDateOnly(fromRaw)
  const toDate = parseIsoDateOnly(toRaw)
  if (!fromDate || !toDate) {
    return NextResponse.json(
      { error: 'Query parameters "from" and "to" must be valid YYYY-MM-DD dates.' },
      { status: 400 },
    )
  }
  if (fromDate > toDate) {
    return NextResponse.json({ error: '"from" must be on or before "to".' }, { status: 400 })
  }

  const start = new Date(`${fromDate}T00:00:00Z`).getTime()
  const end = new Date(`${toDate}T00:00:00Z`).getTime()
  const days = (end - start) / 86400000 + 1
  if (days > MAX_RANGE_DAYS || days < 1) {
    return NextResponse.json(
      { error: `Date range must be 1–${MAX_RANGE_DAYS} days.` },
      { status: 400 },
    )
  }

  try {
    const map = await getDayAvailabilityForRange(db, fromDate, toDate)
    const dates: Record<string, { available: boolean; count: number; max: number }> = {}
    for (const [, v] of map) {
      dates[v.date] = { available: v.available, count: v.count, max: v.max }
    }
    return NextResponse.json({ dates })
  } catch (e) {
    console.error('[api/booking/availability]', e)
    return NextResponse.json({ error: 'Could not load availability.' }, { status: 500 })
  }
}
