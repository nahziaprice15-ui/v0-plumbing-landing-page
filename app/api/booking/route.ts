import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  // In a real implementation you would:
  // - Validate the payload with Zod
  // - Send an email via your provider
  // - Optionally store the booking in a database

  console.log('[booking] received booking request', body)

  return NextResponse.json({ success: true }, { status: 200 })
}

