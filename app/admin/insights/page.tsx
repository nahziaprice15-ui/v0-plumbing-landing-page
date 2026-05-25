import { getServiceDemand } from '@/lib/admin/queries'
import { getMockServiceDemand } from '@/lib/admin/mock-repository'
import type { ServiceDemandRow } from '@/lib/admin/queries'
import { InsightsChart } from './_components/InsightsChart'

const SERVICE_LABELS: Record<string, string> = {
  emergency: 'Emergency Plumbing',
  drain: 'Drain Cleaning',
  'water-heater': 'Water Heater Service',
  leak: 'Leak Detection & Repair',
  installation: 'Fixture / Installation',
  other: 'Other',
}

async function fetchDemand(): Promise<ServiceDemandRow[]> {
  try {
    if (process.env.ADMIN_DATA_SOURCE === 'mock') return getMockServiceDemand()
    return await getServiceDemand(30)
  } catch {
    return []
  }
}

export default async function InsightsPage() {
  const data = await fetchDemand()

  const totalBookings = data.reduce((sum, row) => sum + row.total, 0)
  const topService = data[0] ?? null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-3xl font-bold text-[#0b3a62]">{totalBookings}</p>
          <p className="mt-1 text-sm text-muted-foreground">Total Bookings (30 days)</p>
        </div>
        {topService && (
          <div className="rounded-xl border bg-white p-4 col-span-2 sm:col-span-2">
            <p className="text-lg font-bold text-[#0b3a62]">
              {SERVICE_LABELS[topService.service_type] ?? topService.service_type}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Top service this month — {topService.total} booking{topService.total === 1 ? '' : 's'} ({topService.pct}% of total)
            </p>
          </div>
        )}
      </div>

      {data.length > 0 ? (
        <div className="rounded-xl border bg-white p-5">
          <h3 className="mb-4 font-semibold text-[#0b3a62]">Service Demand (Last 30 Days)</h3>
          <InsightsChart data={data} />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">No booking data available for the last 30 days.</p>
        </div>
      )}

      <div className="rounded-xl border bg-[#eef2f8] px-5 py-4 text-sm text-muted-foreground">
        Full analytics including conversion funnel coming soon.
      </div>
    </div>
  )
}
