import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { getAdminBookingById, updateBookingStatus, updateBookingNotes } from '@/lib/admin/queries'
import { getMockBookingById } from '@/lib/admin/mock-repository'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { BookingStatusActionForm } from '@/components/admin/BookingStatusActionForm'
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

async function updateBookingStatusAction(formData: FormData) {
  'use server'
  const id = formData.get('bookingId') as string
  const status = formData.get('status') as BookingStatus
  if (process.env.ADMIN_DATA_SOURCE !== 'mock') {
    await updateBookingStatus(id, status)
  }
  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${id}`)
}

async function saveNotesAction(formData: FormData) {
  'use server'
  const id = formData.get('bookingId') as string
  const notes = formData.get('notes') as string
  if (process.env.ADMIN_DATA_SOURCE !== 'mock') {
    await updateBookingNotes(id, notes)
  }
  revalidatePath(`/admin/bookings/${id}`)
}

async function fetchBooking(id: string): Promise<AdminBookingRow | null> {
  if (process.env.ADMIN_DATA_SOURCE === 'mock') {
    return getMockBookingById(id)
  }
  return getAdminBookingById(id)
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const STATUS_TRANSITIONS: { status: BookingStatus; label: string; variant: 'default' | 'outline' | 'destructive' | 'secondary' }[] = [
  { status: 'confirmed', label: 'Mark Confirmed', variant: 'default' },
  { status: 'in_progress', label: 'Mark In Progress', variant: 'secondary' },
  { status: 'completed', label: 'Mark Completed', variant: 'default' },
  { status: 'cancelled', label: 'Cancel Booking', variant: 'destructive' },
]

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const booking = await fetchBooking(id)

  if (!booking) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/bookings"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Bookings
        </Link>
        <AdminEmptyState
          title="Booking not found"
          description="This booking may have been deleted or the ID is invalid."
          actionLabel="View all bookings"
          actionHref="/admin/bookings"
        />
      </div>
    )
  }

  const availableTransitions = STATUS_TRANSITIONS.filter((t) => t.status !== booking.status)

  return (
    <div className="space-y-6">
      <Link
        href="/admin/bookings"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Bookings
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 space-y-4">
          <h3 className="font-semibold text-[#0b3a62]">Customer Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="w-20 shrink-0 text-muted-foreground">Name</span>
              <span className="font-medium">{booking.full_name}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 text-muted-foreground">Phone</span>
              <a href={`tel:${booking.phone}`} className="text-[#0b3a62] hover:underline">
                {booking.phone}
              </a>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 text-muted-foreground">Email</span>
              <span>{booking.email ?? '—'}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 text-muted-foreground">Address</span>
              <span>{booking.address}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 space-y-4">
          <h3 className="font-semibold text-[#0b3a62]">Service Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="w-20 shrink-0 text-muted-foreground">Service</span>
              <span className="font-medium">
                {SERVICE_LABELS[booking.service_type] ?? booking.service_type}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 text-muted-foreground">Date</span>
              <span>{formatDate(booking.preferred_date)}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 text-muted-foreground">Time</span>
              <span>{booking.preferred_time ?? '—'}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-20 shrink-0 text-muted-foreground">Status</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[booking.status]}`}
              >
                {STATUS_LABELS[booking.status]}
              </span>
            </div>
            {booking.description && (
              <div className="pt-1">
                <p className="text-muted-foreground mb-1">Description</p>
                <p className="rounded-lg bg-muted/30 p-3">{booking.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 space-y-4">
        <h3 className="font-semibold text-[#0b3a62]">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          {availableTransitions.map((t) => (
            <BookingStatusActionForm
              key={t.status}
              action={updateBookingStatusAction}
              bookingId={booking.id}
              nextStatus={t.status}
              variant={t.variant}
              size="sm"
            >
              {t.label}
            </BookingStatusActionForm>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5 space-y-4">
        <h3 className="font-semibold text-[#0b3a62]">Internal Notes</h3>
        <form action={saveNotesAction} className="space-y-3">
          <input type="hidden" name="bookingId" value={booking.id} />
          <textarea
            name="notes"
            defaultValue={booking.notes ?? ''}
            rows={4}
            placeholder="Add internal notes visible only to admins..."
            className="w-full rounded-lg border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b3a62]/30"
          />
          <button
            type="submit"
            className="rounded-md bg-[#0b3a62] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b3a62]/90 transition-colors"
          >
            Save Notes
          </button>
        </form>
      </div>
    </div>
  )
}
