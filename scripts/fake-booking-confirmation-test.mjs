#!/usr/bin/env node
/**
 * Repeatable fake-booking verification for UI/API/admin data connectivity.
 *
 * Usage:
 *   BOOKING_TEST_BASE_URL=http://localhost:3000 \
 *   NEXT_PUBLIC_SUPABASE_URL=... \
 *   SUPABASE_SERVICE_ROLE_KEY=... \
 *   node scripts/fake-booking-confirmation-test.mjs
 *
 * Notes:
 * - Start the app locally before running (`pnpm dev`).
 * - The script creates a fake booking and verifies it was persisted.
 */
import { createClient } from '@supabase/supabase-js'

const baseUrl = (process.env.BOOKING_TEST_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function fakeBookingPayload() {
  const stamp = `${Date.now()}-${Math.floor(Math.random() * 10000)}`
  return {
    full_name: `Fake Test ${stamp}`,
    email: `fake-${stamp}@example.com`,
    phone: '555-555-1212',
    address: `123 Test Lane #${stamp}`,
    city: 'Austin',
    zip_code: '78701',
    service_type: 'drain-cleaning',
    description: `Automation fake booking ${stamp}`,
    preferred_date: new Date().toISOString().slice(0, 10),
    preferred_time_slot: 'Morning',
    urgency: 'standard',
    sourcePath: '/book',
    formVariant: 'automation-test',
  }
}

async function postBooking(payload, extraHeaders = {}) {
  const response = await fetch(`${baseUrl}/api/booking`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...extraHeaders },
    body: JSON.stringify(payload),
  })
  const json = await response.json()
  return { response, json }
}

async function verifyPersistedBooking(confirmationCode) {
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('[skip] Persistence check skipped: missing Supabase service-role env vars.')
    return null
  }
  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data, error } = await db
    .from('bookings')
    .select('id,confirmation_code,status,created_at')
    .eq('confirmation_code', confirmationCode)
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(`[supabase] booking lookup failed: ${error.message}`)
  assert(data?.id, `No booking found for confirmation code ${confirmationCode}`)
  return data
}

async function verifyAdminDataPath() {
  const mode =
    process.env.ADMIN_DATA_SOURCE === 'mock' || process.env.NEXT_PUBLIC_ADMIN_MOCK === '1' ? 'mock' : 'live'
  if (mode === 'mock') {
    console.log('[admin] mock mode enabled; live booking visibility in admin UI is intentionally disabled.')
    return
  }
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for admin live-data check.')
  }
  const db = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { error } = await db.from('bookings').select('id').limit(1)
  if (error) throw new Error(`[admin] live data query failed: ${error.message}`)
  console.log('[admin] live data query ok.')
}

async function run() {
  const payload = fakeBookingPayload()
  const forcedFailureEnabled = process.env.BOOKING_API_ALLOW_TEST_FAILURE === '1'

  console.log('[case A] valid fake booking returns success + identifiers')
  const success = await postBooking(payload)
  assert(success.response.ok, `Expected 2xx, received ${success.response.status}`)
  assert(success.json?.success === true, 'Expected success=true from booking API')
  assert(typeof success.json?.confirmation_code === 'string', 'Missing confirmation_code')
  assert(typeof success.json?.booking_id === 'string', 'Missing booking_id')
  assert(typeof success.json?.trace_id === 'string', 'Missing trace_id')
  console.log(
    `[pass] booking accepted: confirmation_code=${success.json.confirmation_code} booking_id=${success.json.booking_id}`,
  )

  if (forcedFailureEnabled) {
    console.log('[case B] forced failure returns error with trace id')
    const forcedFailure = await postBooking(payload, { 'x-test-force-db-failure': '1' })
    assert(forcedFailure.response.status >= 400, 'Expected non-2xx for forced failure test')
    assert(forcedFailure.json?.success === false, 'Expected success=false for forced failure test')
    assert(typeof forcedFailure.json?.trace_id === 'string', 'Expected trace_id on forced failure response')
    console.log(`[pass] forced failure produced trace_id=${forcedFailure.json.trace_id}`)
  } else {
    console.log('[case B] skipped (set BOOKING_API_ALLOW_TEST_FAILURE=1 on server to enable)')
  }

  console.log('[case C] successful response corresponds to durable booking row')
  const persisted = await verifyPersistedBooking(success.json.confirmation_code)
  if (persisted?.id) {
    console.log(`[pass] confirmed persisted booking id=${persisted.id} status=${persisted.status}`)
  }

  console.log('[admin check] verify admin data path mode/query state')
  await verifyAdminDataPath()

  console.log('\nAll fake-booking confirmation checks passed.')
}

run().catch((error) => {
  console.error('\nFake-booking confirmation test failed:')
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
