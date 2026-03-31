#!/usr/bin/env node
/**
 * Verifies required tables exist on the Supabase project used by the app.
 * Run from repo root with env vars set (e.g. source .env.local in your shell, or export manually):
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/verify-supabase-schema.mjs
 *
 * Exit code 0 when all checks pass; 1 when a table is missing or the client fails.
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

const required = [
  'customers',
  'bookings',
  'profiles',
  'service_types',
  'service_categories',
  'booking_funnel_events',
  'booking_events',
]

async function main() {
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
    process.exit(1)
  }
  const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  let failed = false
  for (const table of required) {
    const { error } = await db.from(table).select('id').limit(1)
    if (error) {
      console.error(`[verify] ${table}:`, error.message)
      failed = true
    } else {
      console.log(`[verify] ${table}: ok`)
    }
  }
  if (failed) {
    console.error(
      '\nApply repo migrations in order (customers/bookings → phase1 → booking_funnel_events → service_categories).',
    )
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
