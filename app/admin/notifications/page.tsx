import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertTriangle, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { markAllNotificationsRead, markNotificationRead } from '@/app/admin/notifications/actions'
import type { AdminNotificationFilter } from '@/lib/admin/notification-types'
import { getAdminNotificationsFeed } from '@/lib/admin/notifications-feed'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

function parseFilter(raw: string | undefined): AdminNotificationFilter {
  if (raw === 'action_required' || raw === 'info') return raw
  return 'all'
}

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  } catch {
    return iso
  }
}

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const sp = await searchParams
  const filter = parseFilter(sp.filter)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/admin-login')

  const items = await getAdminNotificationsFeed(user.id, filter)
  const hasDbUnread = items.some((i) => i.source === 'db' && !i.readAt)

  const tabs: { key: AdminNotificationFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'action_required', label: 'Action required' },
    { key: 'info', label: 'Info' },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Action items and updates. In production, new bookings and status changes also create rows here. Mock mode
              shows a computed feed.
            </CardDescription>
          </div>
          {hasDbUnread ? (
            <form action={markAllNotificationsRead}>
              <Button type="submit" variant="outline" size="sm">
                Mark all read
              </Button>
            </form>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <Button key={t.key} variant={filter === t.key ? 'default' : 'outline'} size="sm" asChild>
                <Link href={t.key === 'all' ? '/admin/notifications' : `/admin/notifications?filter=${t.key}`}>
                  {t.label}
                </Link>
              </Button>
            ))}
          </div>

          {items.length === 0 ? (
            <AdminEmptyState
              title="You’re caught up"
              description="No notifications match this filter."
              actionLabel="View bookings"
              actionHref="/admin/bookings"
            />
          ) : (
            <ul className="space-y-2">
              {items.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    'flex flex-col gap-2 rounded-lg border bg-background p-4 sm:flex-row sm:items-start sm:justify-between',
                    n.severity === 'action_required' && 'border-l-4 border-l-destructive',
                    n.source === 'db' && n.readAt && 'opacity-70',
                  )}
                >
                  <div className="flex min-w-0 gap-3">
                    <div className="mt-0.5 shrink-0">
                      {n.severity === 'action_required' ? (
                        <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden />
                      ) : (
                        <Info className="h-5 w-5 text-muted-foreground" aria-hidden />
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium leading-snug">{n.title}</p>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {n.kind.replace(/_/g, ' ')}
                        </Badge>
                        {n.source === 'computed' ? (
                          <Badge variant="secondary" className="text-[10px]">
                            Live feed
                          </Badge>
                        ) : null}
                        {n.source === 'db' && n.readAt ? (
                          <Badge variant="outline" className="text-[10px]">
                            Read
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{n.body}</p>
                      <p className="text-xs text-muted-foreground">{formatWhen(n.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                    {n.href ? (
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={n.href}>Open</Link>
                      </Button>
                    ) : null}
                    {n.source === 'db' && !n.readAt ? (
                      <form action={markNotificationRead}>
                        <input type="hidden" name="id" value={n.id} />
                        <Button type="submit" variant="ghost" size="sm">
                          Mark read
                        </Button>
                      </form>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
