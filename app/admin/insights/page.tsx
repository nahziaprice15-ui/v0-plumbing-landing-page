import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdminDashboardMetrics, getServiceDemand } from '@/lib/admin/queries'

export default async function AdminInsightsPage() {
  const [metrics, serviceDemand] = await Promise.all([getAdminDashboardMetrics(), getServiceDemand()])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Traffic to Booking Funnel (7 days)</CardTitle>
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
          <CardTitle>Top Converting Entry Pages</CardTitle>
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
            <p className="text-sm text-muted-foreground">No source-page conversion events captured yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Booked Services</CardTitle>
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

