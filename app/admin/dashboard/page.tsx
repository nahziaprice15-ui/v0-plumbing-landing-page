import { Clock3, ClipboardList, PhoneCall, Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdminBookings, getAdminDashboardMetrics } from '@/lib/admin/queries'

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'completed') return 'secondary'
  if (status === 'cancelled') return 'destructive'
  if (status === 'pending') return 'outline'
  return 'default'
}

export default async function AdminDashboardPage() {
  const [metrics, bookings] = await Promise.all([getAdminDashboardMetrics(), getAdminBookings()])
  const kpis = [
    {
      label: 'Created today',
      value: String(metrics.bookingsCreatedToday),
      note: 'New requests submitted today (by created time)',
      icon: ClipboardList,
    },
    {
      label: 'Scheduled today',
      value: String(metrics.bookingsScheduledToday),
      note: 'Jobs with preferred date = today',
      icon: Wrench,
    },
    {
      label: 'Pending confirmations',
      value: String(metrics.pendingConfirmations),
      note: 'All bookings still awaiting confirmation',
      icon: PhoneCall,
    },
    {
      label: 'Conversion (7d)',
      value: `${metrics.bookingConversionRate}%`,
      note: `${metrics.bookingSubmissions}/${metrics.bookingStarts} submit/start`,
      icon: Clock3,
    },
  ] as const

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">{kpi.note}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Booking Pipeline</CardTitle>
            <CardDescription>Work queue for new and active jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-3 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{booking.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.serviceType} · {booking.preferredTimeSlot}
                  </p>
                  <p className="text-xs text-muted-foreground">{booking.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(booking.status)}>{booking.status.replace('_', ' ')}</Badge>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/admin/bookings/${booking.id}`}>Open</a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today & Next 7 Days</CardTitle>
            <CardDescription>Upcoming scheduled visits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings.slice(0, 7).map((booking) => (
              <div key={booking.id} className="rounded-lg border bg-background p-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-medium">{booking.preferredDate}</p>
                  <Badge variant="outline">{booking.serviceType}</Badge>
                </div>
                <p className="text-sm">{booking.preferredTimeSlot}</p>
                <p className="text-xs text-muted-foreground">{booking.customerName}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Demand Snapshot</CardTitle>
            <CardDescription>Most booked service in current data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-semibold">{metrics.topBookedService}</p>
            <p className="text-sm text-muted-foreground">
              Upcoming 7 days: {metrics.upcoming7Days} bookings (by preferred date)
            </p>
            <p className="text-sm text-muted-foreground">
              In progress (all): {metrics.inProgress} · Completed (scheduled today):{' '}
              {metrics.completedScheduledToday} · Cancelled (scheduled today): {metrics.cancelledScheduledToday}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Entry Pages</CardTitle>
            <CardDescription>Pages generating booking submissions (7 days)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {metrics.topEntryPages.map((entry) => (
              <div key={entry.sourcePath} className="flex items-center justify-between rounded-md border p-2">
                <span className="text-sm">{entry.sourcePath}</span>
                <Badge variant="outline">{entry.submissions}</Badge>
              </div>
            ))}
            {metrics.topEntryPages.length === 0 && (
              <p className="text-sm text-muted-foreground">No submission source data yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
