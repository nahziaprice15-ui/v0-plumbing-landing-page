import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-only client that bypasses RLS. Set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
 * (never expose this key to the browser or `NEXT_PUBLIC_*`).
 */
export function getServiceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
