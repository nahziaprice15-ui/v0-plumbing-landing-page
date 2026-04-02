import { getServiceRoleClient } from '@/lib/supabase/service-role'
import type { AdminNotificationFilter, AdminNotificationItem } from '@/lib/admin/notification-types'

type DbRow = {
  id: string
  user_id: string
  kind: string
  title: string
  body: string | null
  booking_id: string | null
  read_at: string | null
  created_at: string
}

function mapRow(r: DbRow): AdminNotificationItem {
  const href = r.booking_id ? `/admin/bookings/${r.booking_id}` : null
  const severity =
    r.kind === 'sla' || r.kind === 'pending_stale' || r.kind === 'digest_action' ? 'action_required' : 'info'
  return {
    id: r.id,
    source: 'db',
    kind: r.kind,
    severity,
    title: r.title,
    body: r.body ?? '',
    createdAt: r.created_at,
    href,
    readAt: r.read_at,
  }
}

function filterDb(items: AdminNotificationItem[], f: AdminNotificationFilter): AdminNotificationItem[] {
  if (f === 'all') return items
  if (f === 'action_required') return items.filter((i) => i.severity === 'action_required')
  return items.filter((i) => i.severity === 'info')
}

export async function fetchDbNotificationsForUser(
  userId: string,
  filter: AdminNotificationFilter,
): Promise<AdminNotificationItem[]> {
  const db = getServiceRoleClient()
  if (!db) return []

  const { data, error } = await db
    .from('admin_notifications')
    .select('id,user_id,kind,title,body,booking_id,read_at,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error || !data) return []

  const mapped = (data as DbRow[]).map(mapRow)
  return filterDb(mapped, filter)
}

export async function countUnreadDbNotifications(userId: string): Promise<number> {
  const db = getServiceRoleClient()
  if (!db) return 0

  const { count, error } = await db
    .from('admin_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('read_at', null)

  if (error) return 0
  return count ?? 0
}

export type NotifyPayload = {
  kind: string
  title: string
  body?: string
  bookingId?: string
  /** When set, skips insert if this user already has this dedupe key. */
  dedupeKey?: string
}

/** Insert one row per admin/staff profile (service role). */
export async function notifyAllStaff(payload: NotifyPayload): Promise<void> {
  const db = getServiceRoleClient()
  if (!db) return

  const { data: staff, error: staffError } = await db.from('profiles').select('id').in('role', ['admin', 'staff'])

  if (staffError || !staff?.length) return

  let userIds = staff.map((s) => String(s.id))

  if (payload.dedupeKey) {
    const { data: dupRows } = await db.from('admin_notifications').select('user_id').eq('dedupe_key', payload.dedupeKey)
    const dup = new Set((dupRows ?? []).map((r) => String((r as { user_id: string }).user_id)))
    userIds = userIds.filter((id) => !dup.has(id))
  }

  if (userIds.length === 0) return

  const rows = userIds.map((user_id) => ({
    user_id,
    kind: payload.kind,
    title: payload.title,
    body: payload.body ?? null,
    booking_id: payload.bookingId ?? null,
    dedupe_key: payload.dedupeKey ?? null,
  }))

  const { error } = await db.from('admin_notifications').insert(rows)
  if (error) console.error('[notifyAllStaff]', error.message)
}
