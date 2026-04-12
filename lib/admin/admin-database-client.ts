import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getServiceRoleClient } from '@/lib/supabase/service-role'

export type LiveAdminDbMode = 'service_role' | 'user_session'

export type AdminDatabaseAccess =
  | { client: SupabaseClient; liveReadMode: LiveAdminDbMode }
  | { client: null; reason: 'not_signed_in' | 'not_staff' }

/**
 * Prefer service role (bypasses RLS; required for webhooks / background jobs).
 * If unset, use the signed-in admin/staff session so /admin can load live data when
 * POST /api/booking still works via the anon key.
 */
export async function getAdminDatabaseClient(): Promise<AdminDatabaseAccess> {
  const sr = getServiceRoleClient()
  if (sr) return { client: sr, liveReadMode: 'service_role' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { client: null, reason: 'not_signed_in' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    return { client: null, reason: 'not_staff' }
  }

  return { client: supabase, liveReadMode: 'user_session' }
}
