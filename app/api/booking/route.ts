import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  try {
    // Step 1 - Insert customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        full_name: body.full_name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        zip_code: body.zip_code,
      })
      .select()
      .single()

    if (customerError) throw customerError

    // Step 2 - Insert booking
    const confirmationCode = `PLM-${Math.floor(Math.random() * 90000) + 10000}`

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id: customer.id,
        confirmation_code: confirmationCode,
        service_type: body.service_type,
        description: body.description,
        preferred_date: body.preferred_date,
        preferred_time_slot: body.preferred_time_slot,
        urgency: body.urgency,
        status: 'pending',
      })
      .select()
      .single()

    if (bookingError) throw bookingError

    return NextResponse.json({
      success: true,
      confirmation_code: confirmationCode,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
