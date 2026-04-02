import { subHours } from 'date-fns'
import { getAdminBookings, getAdminOperationalInsights, getRecentBookingActivity } from '@/lib/admin/queries'
import type { AdminNotificationFilter, AdminNotificationItem } from '@/lib/admin/notification-types'

function hrefBooking(id: string): string {
  return `/admin/bookings/${id}`
}

/** Server-built feed when mock mode or before DB rows exist (no migration / empty inbox). */
export async function getComputedAdminNotifications(
  filter: AdminNotificationFilter,
): Promise<AdminNotificationItem[]> {
  const [insights, bookings, activity] = await Promise.all([
    getAdminOperationalInsights(),
    getAdminBookings(),
    getRecentBookingActivity(25),
  ])

  const items: AdminNotificationItem[] = []
  const slaHours = insights.slaPendingThresholdHours
  const pendingOld = insights.pendingOlderThanThreshold

  if (pendingOld > 0) {
    items.push({
      id: 'computed-sla',
      source: 'computed',
      kind: 'sla',
      severity: 'action_required',
      title: `${pendingOld} booking${pendingOld === 1 ? '' : 's'} past ${slaHours}h SLA`,
      body: 'Pending confirmations are older than the threshold — review the queue.',
      createdAt: new Date().toISOString(),
      href: '/admin/bookings?status=pending',
      readAt: null,
    })
  }

  const threshold = subHours(new Date(), slaHours)
  const stalePending = bookings.filter(
    (b) => b.status === 'pending' && new Date(b.createdAt).getTime() < threshold.getTime(),
  )
  for (const b of stalePending.slice(0, 10)) {
    items.push({
      id: `computed-pending-${b.id}`,
      source: 'computed',
      kind: 'pending_stale',
      severity: 'action_required',
      title: `Stale pending: ${b.customerName}`,
      body: `${b.serviceType} · requested ${b.preferredDate} ${b.preferredTimeSlot}`,
      createdAt: b.createdAt,
      href: hrefBooking(b.id),
      readAt: null,
    })
  }

  const dayAgo = Date.now() - 86400000 * 2
  const recentNew = bookings
    .filter((b) => new Date(b.createdAt).getTime() >= dayAgo)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 15)

  for (const b of recentNew) {
    items.push({
      id: `computed-new-${b.id}`,
      source: 'computed',
      kind: 'new_booking',
      severity: 'info',
      title: `New request: ${b.customerName}`,
      body: `${b.serviceType} · ${b.preferredDate}`,
      createdAt: b.createdAt,
      href: hrefBooking(b.id),
      readAt: null,
    })
  }

  for (const ev of activity) {
    if (ev.eventType !== 'status_change') continue
    items.push({
      id: `computed-ev-${ev.id}`,
      source: 'computed',
      kind: 'status_change',
      severity: 'info',
      title: 'Status update',
      body: ev.label,
      createdAt: ev.createdAt,
      href: ev.bookingId ? hrefBooking(ev.bookingId) : '/admin/activity',
      readAt: null,
    })
  }

  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  const deduped: AdminNotificationItem[] = []
  const seen = new Set<string>()
  for (const row of items) {
    const key = `${row.kind}-${row.title}-${row.body}`
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(row)
  }

  return filterItems(deduped, filter)
}

function filterItems(items: AdminNotificationItem[], filter: AdminNotificationFilter): AdminNotificationItem[] {
  if (filter === 'all') return items
  if (filter === 'action_required') return items.filter((i) => i.severity === 'action_required')
  return items.filter((i) => i.severity === 'info')
}

export function countComputedActionRequired(items: AdminNotificationItem[]): number {
  return items.filter((i) => i.severity === 'action_required').length
}
