import { format } from 'date-fns'
import { ExternalLink, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { bookingStatusLabel, bookingStatusVariant } from '@/lib/admin/booking-status'
import { getAdminBookings } from '@/lib/admin/queries'

function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export default async function AdminTodayPage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const all = await getAdminBookings()
  const todayRows = all
    .filter((b) => b.preferredDate === today)
    .sort((a, b) => a.preferredTimeSlot.localeCompare(b.preferredTimeSlot, undefined, { numeric: true }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s board</CardTitle>
          <CardDescription>
            Jobs with preferred date {today}, sorted by time window. Open Maps for driving directions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayRows.length === 0 ? (
            <AdminEmptyState
              title="Nothing scheduled for today"
              description="Check Bookings with the Today tab or confirm upcoming jobs."
              actionLabel="Open bookings"
              actionHref="/admin/bookings?status=today"
            />
          ) : (
            todayRows.map((b) => (
              <div
                key={b.id}
                className="flex flex-col gap-3 rounded-lg border bg-background p-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{b.preferredTimeSlot}</p>
                    <Badge variant={bookingStatusVariant(b.status)}>{bookingStatusLabel(b.status)}</Badge>
                  </div>
                  <p className="text-sm font-semibold">{b.customerName}</p>
                  <p className="text-sm text-muted-foreground">{b.serviceType}</p>
                  <p className="text-xs text-muted-foreground">{b.address}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/admin/bookings/${b.id}`}>Detail</a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={mapsUrl(b.address)} target="_blank" rel="noopener noreferrer" className="gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Maps
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
