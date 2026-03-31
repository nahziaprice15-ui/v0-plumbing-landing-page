'use server'

import { revalidatePath } from 'next/cache'
import { getServiceRoleClient } from '@/lib/supabase/service-role'

const allowedStatuses = new Set(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])

export async function updateBookingStatus(formData: FormData) {
  const bookingId = String(formData.get('bookingId') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!bookingId || !allowedStatuses.has(status)) return

  const db = getServiceRoleClient()
  if (!db) return

  await db.from('bookings').update({ status }).eq('id', bookingId)
  revalidatePath('/admin/bookings')
  revalidatePath('/admin/dashboard')
}

