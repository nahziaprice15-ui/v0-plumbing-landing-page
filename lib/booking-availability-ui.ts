/** Client-side helpers for booking calendar availability (keep timezone aligned with SITE_TIMEZONE / NEXT_PUBLIC_SITE_TIMEZONE). */

export function getClientSiteTimezone(): string {
  return process.env.NEXT_PUBLIC_SITE_TIMEZONE?.trim() || 'America/Chicago'
}

/** YYYY-MM-DD for "today" in the site timezone (matches server `todayDateStringInSiteTimezone` when envs align). */
export function getClientTodayDateString(): string {
  const tz = getClientSiteTimezone()
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

export function addCalendarDaysYmd(ymd: string, deltaDays: number): string {
  const [y, mo, d] = ymd.split('-').map(Number)
  const t = Date.UTC(y, mo - 1, d + deltaDays)
  const dt = new Date(t)
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, '0')}-${String(dt.getUTCDate()).padStart(2, '0')}`
}

export type BookingAvailabilityDates = Record<
  string,
  { available: boolean; count: number; max: number }
>

export async function fetchBookingAvailability(
  from: string,
  to: string,
): Promise<BookingAvailabilityDates> {
  const qs = new URLSearchParams({ from, to })
  const res = await fetch(`/api/booking/availability?${qs}`)
  if (!res.ok) return {}
  const json = (await res.json()) as { dates?: BookingAvailabilityDates }
  return json.dates ?? {}
}
