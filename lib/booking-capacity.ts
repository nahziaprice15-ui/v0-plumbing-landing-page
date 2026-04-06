import type { SupabaseClient } from '@supabase/supabase-js'
import { BOOKING_DATE_FULL_MESSAGE, BOOKING_TIME_BUCKET_FULL_MESSAGE } from '@/lib/booking-messages'

/** Bookings that consume same-day capacity (exclude cancelled, no_show, completed). */
export const BOOKING_CAPACITY_STATUSES = ['pending', 'confirmed', 'in_progress'] as const

export type BookingCapacityStatus = (typeof BOOKING_CAPACITY_STATUSES)[number]

export { BOOKING_DATE_FULL_MESSAGE, BOOKING_TIME_BUCKET_FULL_MESSAGE }

const DEFAULT_SITE_TIMEZONE = 'America/Chicago'
const DEFAULT_MAX_PER_DAY = 8

export function getSiteTimezone(): string {
  return process.env.SITE_TIMEZONE?.trim() || DEFAULT_SITE_TIMEZONE
}

/** Calendar date string (YYYY-MM-DD) for "today" in the site timezone. */
export function todayDateStringInSiteTimezone(): string {
  const tz = getSiteTimezone()
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const parts = fmt.formatToParts(new Date())
  const y = parts.find((p) => p.type === 'year')?.value
  const m = parts.find((p) => p.type === 'month')?.value
  const d = parts.find((p) => p.type === 'day')?.value
  if (!y || !m || !d) return new Date().toISOString().slice(0, 10)
  return `${y}-${m}-${d}`
}

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (raw == null || raw.trim() === '') return fallback
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1) return fallback
  return n
}

export function getMaxActivePerDay(): number {
  return parsePositiveInt(process.env.BOOKING_MAX_ACTIVE_PER_DAY, DEFAULT_MAX_PER_DAY)
}

/** When set (>=1), each normalized time bucket (morning/afternoon/evening/asap) has its own cap. */
export function getMaxActivePerTimeBucket(): number | null {
  const raw = process.env.BOOKING_MAX_ACTIVE_PER_TIME_BUCKET?.trim()
  if (!raw) return null
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1) return null
  return n
}

/**
 * Canonical keys: morning | afternoon | evening | asap | standard
 * Aligns modal values (morning), legacy labels ("Morning (8AM-12PM)"), and /book free text.
 */
export function normalizePreferredTimeSlot(raw: string): string {
  const s = raw.trim().toLowerCase()
  if (!s) return 'standard'
  if (s.includes('asap')) return 'asap'
  if (s.startsWith('evening') || s.includes('evening')) return 'evening'
  if (s.startsWith('afternoon') || s.includes('afternoon')) return 'afternoon'
  if (s.startsWith('morning') || s.includes('morning')) return 'morning'
  if (s === 'morning' || s === 'afternoon' || s === 'evening') return s
  return 'standard'
}

function normalizeSlotForCompare(stored: string | null | undefined): string {
  return normalizePreferredTimeSlot(String(stored ?? ''))
}

export type CapacityCheckResult =
  | { ok: true }
  | { ok: false; reason: 'day_full' | 'bucket_full'; message: string }

/**
 * Count bookings that apply toward capacity for a calendar day.
 * When per-bucket cap is enabled, filters by normalized time slot.
 */
export async function countCapacityBookings(
  db: SupabaseClient,
  preferredDate: string,
  timeBucket?: string,
): Promise<number> {
  const { data, error } = await db
    .from('bookings')
    .select('id, preferred_time_slot, status')
    .eq('preferred_date', preferredDate)
    .in('status', [...BOOKING_CAPACITY_STATUSES])

  if (error) throw error
  const rows = data ?? []
  if (!timeBucket) return rows.length

  const bucket = normalizePreferredTimeSlot(timeBucket)
  return rows.filter((r) => normalizeSlotForCompare(r.preferred_time_slot as string) === bucket).length
}

export type DayAvailability = {
  date: string
  available: boolean
  count: number
  max: number
}

/** Per-day availability for a date range (inclusive). Used by GET /api/booking/availability. */
export async function getDayAvailabilityForRange(
  db: SupabaseClient,
  fromDate: string,
  toDate: string,
): Promise<Map<string, DayAvailability>> {
  const maxDay = getMaxActivePerDay()
  const { data, error } = await db
    .from('bookings')
    .select('preferred_date, status')
    .gte('preferred_date', fromDate)
    .lte('preferred_date', toDate)
    .in('status', [...BOOKING_CAPACITY_STATUSES])

  if (error) throw error

  const countByDate = new Map<string, number>()
  for (const row of data ?? []) {
    const d = String((row as { preferred_date: string }).preferred_date ?? '')
    if (!d) continue
    countByDate.set(d, (countByDate.get(d) ?? 0) + 1)
  }

  const out = new Map<string, DayAvailability>()
  const [fy, fm, fd] = fromDate.split('-').map(Number)
  const [ty, tm, td] = toDate.split('-').map(Number)
  const endUtc = Date.UTC(ty, tm - 1, td)
  let t = Date.UTC(fy, fm - 1, fd)
  while (t <= endUtc) {
    const dt = new Date(t)
    const key = `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`
    const count = countByDate.get(key) ?? 0
    out.set(key, {
      date: key,
      count,
      max: maxDay,
      available: count < maxDay,
    })
    t += 86400000
  }
  return out
}

export async function checkBookingCapacity(
  db: SupabaseClient,
  preferredDate: string,
  preferredTimeSlotNormalized: string,
): Promise<CapacityCheckResult> {
  const maxDay = getMaxActivePerDay()
  const maxBucket = getMaxActivePerTimeBucket()

  const dayCount = await countCapacityBookings(db, preferredDate)
  if (dayCount >= maxDay) {
    return { ok: false, reason: 'day_full', message: BOOKING_DATE_FULL_MESSAGE }
  }

  if (maxBucket != null) {
    const bucket = normalizePreferredTimeSlot(preferredTimeSlotNormalized)
    const bucketCount = await countCapacityBookings(db, preferredDate, bucket)
    if (bucketCount >= maxBucket) {
      return { ok: false, reason: 'bucket_full', message: BOOKING_TIME_BUCKET_FULL_MESSAGE }
    }
  }

  return { ok: true }
}

/** Parse YYYY-MM-DD; returns null if invalid. */
export function parseIsoDateOnly(s: string): string | null {
  const t = s.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null
  const d = new Date(`${t}T12:00:00`)
  if (Number.isNaN(d.getTime())) return null
  return t
}

export function isDateNotBeforeToday(preferredDate: string): boolean {
  const today = todayDateStringInSiteTimezone()
  return preferredDate >= today
}
