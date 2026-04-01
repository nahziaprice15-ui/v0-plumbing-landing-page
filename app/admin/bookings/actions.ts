'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const allowedStatuses = new Set([
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
])

export async function updateBookingStatus(formData: FormData) {
  const bookingId = String(formData.get('bookingId') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!bookingId || !allowedStatuses.has(status)) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') return

  const { data: before } = await supabase.from('bookings').select('status').eq('id', bookingId).maybeSingle()
  const previous = before?.status

  const { error: updateError } = await supabase.from('bookings').update({ status }).eq('id', bookingId)
  if (updateError) return

  if (String(previous ?? '') !== status) {
    await supabase.from('booking_events').insert({
      booking_id: bookingId,
      actor_user_id: user.id,
      event_type: 'status_change',
      payload: { from: previous ?? null, to: status },
    })
  }

  revalidatePath('/admin/bookings')
  revalidatePath('/admin/dashboard')
  revalidatePath(`/admin/bookings/${bookingId}`)
}
