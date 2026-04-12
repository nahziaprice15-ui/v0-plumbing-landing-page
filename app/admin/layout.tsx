import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'
import { getNotificationBadgeCount } from '@/lib/admin/notifications-feed'
import { getAdminOperationalInsights } from '@/lib/admin/queries'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Admin | MS & P LLC',
  description: 'Private admin tools for MS & P LLC operations and dispatch.',
  robots: {
    index: false,
    follow: false,
  },
}

/** Admin uses Supabase SSR (`cookies()`); must not be statically generated at build time. */
export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin-login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    redirect('/admin-login')
  }

  const [insights, unreadNotifications] = await Promise.all([
    getAdminOperationalInsights(),
    getNotificationBadgeCount(user.id),
  ])

  return (
    <AdminShell pendingSlaCount={insights.pendingOlderThanThreshold} unreadNotifications={unreadNotifications}>
      {children}
    </AdminShell>
  )
}
