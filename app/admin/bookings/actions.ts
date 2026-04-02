'use server'

import { revalidatePath } from 'next/cache'
import { isAdminMockDataSource } from '@/lib/admin/data-source'
import { applyMockBookingStatus } from '@/lib/admin/mock-repository'
import { notifyAllStaff } from '@/lib/admin/staff-notifications'
import { createClient } from '@/lib/supabase/server'
import { getServiceRoleClient } from '@/lib/supabase/service-role'

const allowedStatuses = new Set([
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
])

type AllowedStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'

async function requireAdminStaff(): Promise<{ userId: string } | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') return null

  return { userId: user.id }
}

export async function updateBookingStatus(formData: FormData) {
  const bookingId = String(formData.get('bookingId') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!bookingId || !allowedStatuses.has(status)) return

  const auth = await requireAdminStaff()
  if (!auth) return

  const nextStatus = status as AllowedStatus

  if (isAdminMockDataSource()) {
    if (!applyMockBookingStatus(bookingId, nextStatus)) return
    revalidatePath('/admin/bookings')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/today')
    revalidatePath('/admin/insights')
    revalidatePath('/admin/notifications')
    revalidatePath('/admin/activity')
    revalidatePath(`/admin/bookings/${bookingId}`)
    return
  }

  const db = getServiceRoleClient()
  const supabase = await createClient()

  if (db) {
    const { data: before, error: fetchError } = await db
      .from('bookings')
      .select('status')
      .eq('id', bookingId)
      .maybeSingle()

    if (fetchError || !before) return

    const previous = before.status as string | null
    const { error: updateError } = await db.from('bookings').update({ status: nextStatus }).eq('id', bookingId)
    if (updateError) return

    if (String(previous ?? '') !== nextStatus) {
      const { error: eventError } = await db.from('booking_events').insert({
        booking_id: bookingId,
        actor_user_id: auth.userId,
        event_type: 'status_change',
        payload: { from: previous ?? null, to: nextStatus },
      })
      if (eventError) return

      await notifyAllStaff({
        kind: 'status_change',
        title: `Booking ${bookingId.slice(0, 8)} → ${nextStatus}`,
        body: `Was: ${String(previous ?? '—')}`,
        bookingId,
      })
    }
  } else {
    const { data: before } = await supabase.from('bookings').select('status').eq('id', bookingId).maybeSingle()
    if (!before) return

    const previous = before.status as string | null
    const { error: updateError } = await supabase.from('bookings').update({ status: nextStatus }).eq('id', bookingId)
    if (updateError) return

    if (String(previous ?? '') !== nextStatus) {
      const { error: eventError } = await supabase.from('booking_events').insert({
        booking_id: bookingId,
        actor_user_id: auth.userId,
        event_type: 'status_change',
        payload: { from: previous ?? null, to: nextStatus },
      })
      if (eventError) return

      await notifyAllStaff({
        kind: 'status_change',
        title: `Booking ${bookingId.slice(0, 8)} → ${nextStatus}`,
        body: `Was: ${String(previous ?? '—')}`,
        bookingId,
      })
    }
  }

  revalidatePath('/admin/bookings')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/today')
  revalidatePath('/admin/insights')
  revalidatePath('/admin/notifications')
  revalidatePath('/admin/activity')
  revalidatePath(`/admin/bookings/${bookingId}`)
}
