import Link from 'next/link'
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookingStatusActionForm } from '@/components/admin/BookingStatusActionForm'
import { updateBookingStatus } from '@/app/admin/bookings/actions'
import { bookingStatusLabel, bookingStatusVariant } from '@/lib/admin/booking-status'
import { getAdminBookingDetail, getBookingEvents } from '@/lib/admin/queries'

function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [detail, events] = await Promise.all([getAdminBookingDetail(id), getBookingEvents(id)])

  if (!detail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking not found</CardTitle>
          <CardDescription>This id is missing or you do not have access.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/admin/bookings">Back to bookings</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const canOps =
    detail.status !== 'completed' && detail.status !== 'cancelled' && detail.status !== 'no_show'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/bookings" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Bookings
          </Link>
        </Button>
        <h2 className="text-lg font-semibold">Booking {detail.id.slice(0, 8)}</h2>
        <Badge variant={bookingStatusVariant(detail.status)}>{bookingStatusLabel(detail.status)}</Badge>
      </div>

      {canOps ? (
        <Card>
          <CardHeader>
            <CardTitle>Update status</CardTitle>
            <CardDescription>Transitions are logged to booking events.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {detail.status === 'pending' && (
              <BookingStatusActionForm
                action={updateBookingStatus}
                bookingId={detail.id}
                nextStatus="confirmed"
                variant="outline"
                size="sm"
              >
                Confirm
              </BookingStatusActionForm>
            )}
            {(detail.status === 'pending' || detail.status === 'confirmed') && (
              <BookingStatusActionForm
                action={updateBookingStatus}
                bookingId={detail.id}
                nextStatus="in_progress"
                variant="outline"
                size="sm"
              >
                Start job
              </BookingStatusActionForm>
            )}
            <BookingStatusActionForm
              action={updateBookingStatus}
              bookingId={detail.id}
              nextStatus="completed"
              size="sm"
            >
              Complete
            </BookingStatusActionForm>
            <BookingStatusActionForm
              action={updateBookingStatus}
              bookingId={detail.id}
              nextStatus="cancelled"
              variant="outline"
              size="sm"
            >
              Cancel
            </BookingStatusActionForm>
            <BookingStatusActionForm
              action={updateBookingStatus}
              bookingId={detail.id}
              nextStatus="no_show"
              variant="destructive"
              size="sm"
            >
              Mark no-show
            </BookingStatusActionForm>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Confirmation {detail.confirmationCode}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Customer</p>
            <p className="font-medium">{detail.customerName}</p>
            <p className="text-sm text-muted-foreground">{detail.phone}</p>
            <p className="text-sm text-muted-foreground">{detail.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Service</p>
            <p className="font-medium">{detail.serviceTypeLabel}</p>
            <p className="text-sm text-muted-foreground">{detail.description}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">When</p>
            <p className="font-medium">
              {detail.preferredDate} · {detail.preferredTimeSlot}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="text-sm">{detail.address}</p>
            <Button className="mt-2" variant="outline" size="sm" asChild>
              <a href={mapsUrl(detail.address)} target="_blank" rel="noopener noreferrer" className="gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Open in Google Maps
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </Button>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="text-sm">{detail.createdAt}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>Status changes and other booking events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="rounded-md border p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{ev.eventType}</span>
                <span className="text-xs text-muted-foreground">{ev.createdAt}</span>
              </div>
              {ev.eventType === 'status_change' && (
                <p className="mt-1 text-muted-foreground">
                  {String(ev.payload.from ?? '—')} → {String(ev.payload.to ?? '—')}
                </p>
              )}
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-sm text-muted-foreground">No events recorded yet. Events appear after status updates.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
