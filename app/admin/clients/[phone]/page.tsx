import Link from 'next/link'
import { getClientBookings } from '@/lib/admin/queries'
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

async function fetchClientBookings(phone: string): Promise<AdminBookingRow[]> {
  try {
    if (process.env.ADMIN_DATA_SOURCE === 'mock') return getMockBookings().filter((b) => b.phone === phone)
    return await getClientBookings(phone)
  } catch {
    return []
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ phone: string }>
}) {
  const { phone: encodedPhone } = await params
  const phone = decodeURIComponent(encodedPhone)
  const bookings = await fetchClientBookings(phone)

  const client = bookings[0]

  return (
    <div className="space-y-6">
      <Link
        href="/admin/clients"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Clients
      </Link>

      {client ? (
        <div className="rounded-xl border bg-white p-5">
          <h3 className="font-semibold text-[#0b3a62] mb-3">Client Profile</h3>
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{client.full_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <a href={`tel:${client.phone}`} className="font-medium text-[#0b3a62] hover:underline">
                {client.phone}
              </a>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{client.email ?? '—'}</p>
            </div>
          </div>
        </div>
      ) : null}

      {bookings.length === 0 ? (
        <AdminEmptyState
          title="No bookings found"
          description={`No bookings found for ${phone}.`}
          actionLabel="View all clients"
          actionHref="/admin/clients"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <div className="border-b px-4 py-3">
            <p className="font-medium text-[#0b3a62]">
              {bookings.length} booking{bookings.length === 1 ? '' : 's'}
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-left">
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
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[booking.status]}`}
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
