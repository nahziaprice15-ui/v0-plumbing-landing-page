import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { getRecentBookingActivity } from '@/lib/admin/queries'

export default async function AdminActivityPage() {
  const events = await getRecentBookingActivity(50)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Recent booking events (status changes and notes). Source: booking_events.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <AdminEmptyState
            title="No activity yet"
            description="Events appear when staff update booking status or add notes."
            actionLabel="Go to bookings"
            actionHref="/admin/bookings"
          />
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="flex flex-col gap-1 rounded-md border p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{ev.eventType}</p>
                <p className="text-muted-foreground">{ev.label}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">{ev.createdAt}</span>
                {ev.bookingId ? (
                  <Link
                    href={`/admin/bookings/${ev.bookingId}`}
                    className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Open booking
                  </Link>
                ) : null}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
