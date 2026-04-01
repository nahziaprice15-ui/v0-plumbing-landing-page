import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { getAdminDashboardMetrics, getAdminOperationalInsights, getServiceDemand } from '@/lib/admin/queries'

export default async function AdminInsightsPage() {
  const [metrics, serviceDemand, ops] = await Promise.all([
    getAdminDashboardMetrics(),
    getServiceDemand(),
    getAdminOperationalInsights(),
  ])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Traffic to booking funnel (7 days)</CardTitle>
          <CardDescription>Operational conversion from booking intent to submission</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Booking form starts</p>
            <p className="text-2xl font-semibold">{metrics.bookingStarts}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Booking submissions</p>
            <p className="text-2xl font-semibold">{metrics.bookingSubmissions}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Submit conversion</p>
            <p className="text-2xl font-semibold">{metrics.bookingConversionRate}%</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plumbing operations KPIs</CardTitle>
          <CardDescription>Emergency vs commercial mix, SLA-style backlog, and quality signals</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Pending over {ops.slaPendingThresholdHours}h</p>
            <p className="text-2xl font-semibold">{ops.pendingOlderThanThreshold}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Emergency bookings (30d)</p>
            <p className="text-2xl font-semibold">{ops.emergencyBookingsLast30d}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Residential / commercial</p>
            <p className="text-sm font-semibold">
              {ops.residentialBookingsCount} / {ops.commercialBookingsCount}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">No-show rate (7d)</p>
            <p className="text-2xl font-semibold">{ops.noShowRate7d}%</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Cancellation rate (7d)</p>
            <p className="text-2xl font-semibold">{ops.cancelRate7d}%</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Repeat emergency customers (30d)</p>
            <p className="text-2xl font-semibold">{ops.repeatEmergencyCustomers30d}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top converting entry pages</CardTitle>
          <CardDescription>Source pages associated with successful booking submissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {metrics.topEntryPages.map((entry) => (
            <div key={entry.sourcePath} className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm">{entry.sourcePath}</span>
              <Badge variant="outline">{entry.submissions}</Badge>
            </div>
          ))}
          {metrics.topEntryPages.length === 0 && (
            <AdminEmptyState
              title="No funnel conversions yet"
              description="Funnel events will populate as visitors use the booking flow."
              actionLabel="Dashboard"
              actionHref="/admin/dashboard"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most booked services</CardTitle>
          <CardDescription>Demand ranking by booking volume</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {serviceDemand.slice(0, 8).map((row, idx) => (
            <div key={row.serviceType} className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm font-medium">
                #{idx + 1} {row.serviceType}
              </span>
              <Badge variant="secondary">{row.bookings}</Badge>
            </div>
          ))}
          {serviceDemand.length === 0 && (
            <p className="text-sm text-muted-foreground">No booking demand data available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
