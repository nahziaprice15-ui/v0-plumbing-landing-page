export type AdminNotificationSeverity = 'action_required' | 'info'

export type AdminNotificationSource = 'computed' | 'db'

/** Unified row for the notifications page (computed and/or persisted). */
export type AdminNotificationItem = {
  id: string
  source: AdminNotificationSource
  kind: string
  severity: AdminNotificationSeverity
  title: string
  body: string
  createdAt: string
  href: string | null
  readAt: string | null
}

export type AdminNotificationFilter = 'all' | 'action_required' | 'info'
