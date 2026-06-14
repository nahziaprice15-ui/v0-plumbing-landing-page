import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/AdminShell'
import { getAdminDashboardMetrics } from '@/lib/admin/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let pendingSlaCount = 0
  let unreadNotifications = 0

  try {
    const metrics = await getAdminDashboardMetrics()
    pendingSlaCount = metrics.pendingSlaCount
    unreadNotifications = metrics.unreadNotifications
  } catch {
    // non-fatal — render shell without counts
  }

  return (
    <AdminShell pendingSlaCount={pendingSlaCount} unreadNotifications={unreadNotifications}>
      {children}
    </AdminShell>
  )
}
