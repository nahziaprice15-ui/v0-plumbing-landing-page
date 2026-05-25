import Link from 'next/link'
import { getTodayBookings } from '@/lib/admin/queries'
import { getMockBookings } from '@/lib/admin/mock-repository'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import type { AdminBookingRow, BookingStatus } from '@/lib/admin/queries'

const SERVICE_LABELS: Record<string, string> = {
  emergency: 'Emergency Plumbing',
  drain: 'Drain Cleaning',
  'water-heater': 'Water Heater Service',
  leak: 'Leak Detection & Repair',
  installation: 'Fixture / Installation',
  other: 'Other',
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

type TimeGroup = 'ASAP' | 'Morning' | 'Afternoon' | 'Evening'

function getTimeGroup(time: string | null): TimeGroup {
  if (!time) return 'ASAP'
  const lower = time.toLowerCase()
  if (lower.includes('morning')) return 'Morning'
  if (lower.includes('afternoon')) return 'Afternoon'
  if (lower.includes('evening')) return 'Evening'
  return 'ASAP'
}

async function fetchTodayBookings(): Promise<AdminBookingRow[]> {
  try {
    if (process.env.ADMIN_DATA_SOURCE === 'mock') {
      const today = new Date().toISOString().slice(0, 10)
      return getMockBookings().filter((b) => b.preferred_date === today)
    }
    return await getTodayBookings()
  } catch {
    return []
  }
}

function BookingCard({ booking }: { booking: AdminBookingRow }) {
  return (
    <Link
      href={`/admin/bookings/${booking.id}`}
      className="block rounded-xl border bg-white p-4 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-foreground">{booking.full_name}</p>
          <p className="text-sm text-muted-foreground">{booking.phone}</p>
          <p className="mt-1 text-sm">
            {SERVICE_LABELS[booking.service_type] ?? booking.service_type}
          </p>
          {booking.address && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">
              {booking.address}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[booking.status]}`}
        >
          {STATUS_LABELS[booking.status]}
        </span>
      </div>
    </Link>
  )
}

const TIME_GROUP_ORDER: TimeGroup[] = ['ASAP', 'Morning', 'Afternoon', 'Evening']

export default async function TodayPage() {
  const bookings = await fetchTodayBookings()

  if (bookings.length === 0) {
    return (
      <AdminEmptyState
        title="No bookings scheduled for today"
        description="You have a clear schedule today. New bookings submitted today will appear here."
        actionLabel="View all bookings"
        actionHref="/admin/bookings"
      />
    )
  }

  const grouped = new Map<TimeGroup, AdminBookingRow[]>()
  for (const group of TIME_GROUP_ORDER) {
    grouped.set(group, [])
  }
  for (const booking of bookings) {
    const group = getTimeGroup(booking.preferred_time)
    grouped.get(group)!.push(booking)
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        {bookings.length} booking{bookings.length === 1 ? '' : 's'} for today
      </p>

      {TIME_GROUP_ORDER.map((group) => {
        const items = grouped.get(group)!
        if (items.length === 0) return null
        return (
          <div key={group} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {group}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
