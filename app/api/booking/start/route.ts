import { createClient } from '@supabase/supabase-js'
import { getServiceRoleClient } from '@/lib/supabase/service-role'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const db =
    getServiceRoleClient() ??
    createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  let body: Record<string, unknown> = {}
  try {
    body = await request.json()
  } catch {
    // Ignore parse errors and fall back to defaults.
  }

  const sourcePath = typeof body.sourcePath === 'string' && body.sourcePath.length > 0 ? body.sourcePath : '/'
  const formVariant =
    typeof body.formVariant === 'string' && body.formVariant.length > 0 ? body.formVariant : 'unknown'

  const { error } = await db.from('booking_funnel_events').insert({
    event_type: 'start',
    source_path: sourcePath,
    form_variant: formVariant,
  })

  if (error) {
    if (error.code === 'PGRST205') {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ success: false }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}

