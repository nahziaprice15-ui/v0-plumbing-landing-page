import Link from 'next/link'
import { getAdminBookings } from '@/lib/admin/queries'
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

const TABS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
]

async function fetchBookings(status?: string): Promise<AdminBookingRow[]> {
  if (process.env.ADMIN_DATA_SOURCE === 'mock') {
    return getMockBookings(status || null)
  }
  return getAdminBookings({ status: (status as BookingStatus) || null })
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const activeStatus = params.status ?? ''
  const bookings = await fetchBookings(activeStatus)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = activeStatus === tab.value
          const href = tab.value ? `/admin/bookings?status=${tab.value}` : '/admin/bookings'
          return (
            <Link
              key={tab.value}
              href={href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#0b3a62] text-white'
                  : 'bg-white border text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {bookings.length === 0 ? (
        <AdminEmptyState
          title="No bookings found"
          description={activeStatus ? `No bookings with status "${STATUS_LABELS[activeStatus as BookingStatus] ?? activeStatus}".` : 'No bookings have been submitted yet.'}
          actionLabel="View all bookings"
          actionHref="/admin/bookings"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Phone</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Service</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Time</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{booking.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{booking.phone}</td>
                  <td className="px-4 py-3">
                    {SERVICE_LABELS[booking.service_type] ?? booking.service_type}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(booking.preferred_date)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {booking.preferred_time ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[booking.status]
                      }`}
                    >
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(booking.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="text-[#0b3a62] underline-offset-4 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
