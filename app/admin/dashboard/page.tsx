import { Clock3, ClipboardList, PhoneCall, Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { bookingStatusLabel, bookingStatusVariant } from '@/lib/admin/booking-status'
import { getAdminBookings, getAdminDashboardMetrics, getAdminOperationalInsights } from '@/lib/admin/queries'

export default async function AdminDashboardPage() {
  const [metrics, bookings, ops] = await Promise.all([
    getAdminDashboardMetrics(),
    getAdminBookings(),
    getAdminOperationalInsights(),
  ])

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

  const pipeline = bookings.slice(0, 5)

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

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">SLA backlog</CardTitle>
            <CardDescription>Pending over {ops.slaPendingThresholdHours}h</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{ops.pendingOlderThanThreshold}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Emergency (30d)</CardTitle>
            <CardDescription>Emergency-category jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{ops.emergencyBookingsLast30d}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Residential vs commercial</CardTitle>
            <CardDescription>By category signal in data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <span className="font-semibold">{ops.residentialBookingsCount}</span> residential ·{' '}
              <span className="font-semibold">{ops.commercialBookingsCount}</span> commercial
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Repeat emergency risk</CardTitle>
            <CardDescription>Phones with &gt;1 emergency in 30d</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{ops.repeatEmergencyCustomers30d}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">No-show rate (7d)</CardTitle>
            <CardDescription>Share of bookings created in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{ops.noShowRate7d}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cancellation rate (7d)</CardTitle>
            <CardDescription>Share of bookings created in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{ops.cancelRate7d}%</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Booking pipeline</CardTitle>
            <CardDescription>Work queue for new and active jobs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pipeline.length === 0 ? (
              <AdminEmptyState
                title="No bookings loaded"
                description="Connect Supabase or enable mock data for demos."
                actionLabel="Bookings"
                actionHref="/admin/bookings"
              />
            ) : (
              pipeline.map((booking) => (
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
                    <Badge variant={bookingStatusVariant(booking.status)}>{bookingStatusLabel(booking.status)}</Badge>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/admin/bookings/${booking.id}`}>Open</a>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today & next 7 days</CardTitle>
            <CardDescription>Upcoming scheduled visits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings.slice(0, 7).length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming rows in the current window.</p>
            ) : (
              bookings.slice(0, 7).map((booking) => (
                <div key={booking.id} className="rounded-lg border bg-background p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium">{booking.preferredDate}</p>
                    <Badge variant="outline">{booking.serviceType}</Badge>
                  </div>
                  <p className="text-sm">{booking.preferredTimeSlot}</p>
                  <p className="text-xs text-muted-foreground">{booking.customerName}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Demand snapshot</CardTitle>
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
            <CardTitle>Top entry pages</CardTitle>
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
