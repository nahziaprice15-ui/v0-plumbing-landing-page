import { isAdminMockDataSource } from '@/lib/admin/data-source'
import { getComputedAdminNotifications } from '@/lib/admin/computed-notifications'
import type { AdminNotificationFilter, AdminNotificationItem } from '@/lib/admin/notification-types'
import { countUnreadDbNotifications, fetchDbNotificationsForUser } from '@/lib/admin/staff-notifications'

/**
 * Merged feed: mock mode uses computed only. Live mode uses DB rows when present,
 * otherwise falls back to computed (empty inbox / pre-migration).
 */
export async function getAdminNotificationsFeed(
  userId: string,
  filter: AdminNotificationFilter,
): Promise<AdminNotificationItem[]> {
  if (isAdminMockDataSource()) {
    return getComputedAdminNotifications(filter)
  }

  const dbRows = await fetchDbNotificationsForUser(userId, filter)
  if (dbRows.length > 0) return dbRows

  return getComputedAdminNotifications(filter)
}

export async function getNotificationBadgeCount(userId: string): Promise<number> {
  try {
    if (isAdminMockDataSource()) {
      const all = await getComputedAdminNotifications('all')
      return all.filter((n) => n.severity === 'action_required').length
    }

    return countUnreadDbNotifications(userId)
  } catch (err) {
    console.error('[admin/notifications-feed] getNotificationBadgeCount failed', err)
    return 0
  }
}
