import type { AdminBookingRow } from '@/lib/admin/queries'

export type BookingStatus = AdminBookingRow['status']

/** All statuses shown in filters and allowed in transitions (aligned with DB enum). */
export const BOOKING_STATUS_ORDER: BookingStatus[] = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
]

export function bookingStatusLabel(status: BookingStatus): string {
  return status.replace(/_/g, ' ')
}

/** Badge variant used across dashboard, bookings list, and booking detail. */
export function bookingStatusVariant(
  status: BookingStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'completed') return 'secondary'
  if (status === 'cancelled' || status === 'no_show') return 'destructive'
  if (status === 'pending') return 'outline'
  return 'default'
}
