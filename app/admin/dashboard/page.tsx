import Link from 'next/link'
import { getAdminDashboardMetrics } from '@/lib/admin/queries'
import { getMockDashboardMetrics } from '@/lib/admin/mock-repository'
import type { AdminDashboardMetrics } from '@/lib/admin/queries'

async function fetchMetrics(): Promise<AdminDashboardMetrics> {
  if (process.env.ADMIN_DATA_SOURCE === 'mock') {
    return getMockDashboardMetrics()
  }
  return getAdminDashboardMetrics()
}

function MetricCard({
  label,
  value,
  href,
  highlight,
}: {
  label: string
  value: number
  href?: string
  highlight?: boolean
}) {
  const content = (
    <div
      className={`rounded-xl border bg-white p-4 ${
        highlight && value > 0
          ? 'border-red-200 bg-red-50'
          : ''
      }`}
    >
      <p
        className={`text-3xl font-bold ${
          highlight && value > 0 ? 'text-red-600' : 'text-[#0b3a62]'
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-80">
        {content}
      </Link>
    )
  }
  return content
}

export default async function DashboardPage() {
  const metrics = await fetchMetrics()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <MetricCard
          label="New Bookings Today"
          value={metrics.newBookingsToday}
          href="/admin/bookings"
        />
        <MetricCard
          label="Pending Confirmation"
          value={metrics.pendingConfirmations}
          href="/admin/bookings?status=pending"
          highlight
        />
        <MetricCard
          label="In Progress"
          value={metrics.inProgress}
          href="/admin/bookings?status=in_progress"
        />
        <MetricCard
          label="Completed This Month"
          value={metrics.completedThisMonth}
          href="/admin/bookings?status=completed"
        />
        <MetricCard
          label="Pending Past SLA (4h)"
          value={metrics.pendingSlaCount}
          href="/admin/notifications"
          highlight
        />
        <div className="rounded-xl border bg-white p-4">
          <p className="text-3xl font-bold text-[#0b3a62]">&rarr;</p>
          <p className="mt-1 text-sm text-muted-foreground">
            <Link
              href="/admin/bookings"
              className="text-[#0b3a62] underline-offset-4 hover:underline"
            >
              View all bookings
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
