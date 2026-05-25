import Link from 'next/link'
import { getPendingSlabookings } from '@/lib/admin/queries'
import { getMockBookings } from '@/lib/admin/mock-repository'
import type { AdminBookingRow } from '@/lib/admin/queries'

const SERVICE_LABELS: Record<string, string> = {
  emergency: 'Emergency Plumbing',
  drain: 'Drain Cleaning',
  'water-heater': 'Water Heater Service',
  leak: 'Leak Detection & Repair',
  installation: 'Fixture / Installation',
  other: 'Other',
}

async function fetchSlaBookings(): Promise<AdminBookingRow[]> {
  try {
    if (process.env.ADMIN_DATA_SOURCE === 'mock') {
      const cutoff = new Date(Date.now() - 4 * 60 * 60 * 1000)
      return getMockBookings('pending').filter((b) => new Date(b.created_at) < cutoff)
    }
    return await getPendingSlabookings(4)
  } catch {
    return []
  }
}

function formatTimeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  if (diffHours > 0) {
    return `${diffHours}h ${diffMins}m ago`
  }
  return `${diffMins}m ago`
}

export default async function NotificationsPage() {
  const bookings = await fetchSlaBookings()

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-green-50 border-green-200 px-6 py-12 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <span className="text-2xl">✓</span>
        </div>
        <p className="text-base font-medium text-green-800">All clear</p>
        <p className="mt-1 max-w-md text-sm text-green-700">
          No bookings past the 4-hour SLA window. Great work keeping up with the queue.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {bookings.length} pending booking{bookings.length === 1 ? '' : 's'} past the 4-hour SLA window. Please follow up promptly.
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <Link
            key={booking.id}
            href={`/admin/bookings/${booking.id}`}
            className="block rounded-xl border border-red-100 bg-white p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{booking.full_name}</p>
                <p className="text-sm text-muted-foreground">{booking.phone}</p>
              </div>
              <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                Overdue
              </span>
            </div>
            <p className="mt-2 text-sm">
              {SERVICE_LABELS[booking.service_type] ?? booking.service_type}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Submitted {formatTimeAgo(booking.created_at)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
