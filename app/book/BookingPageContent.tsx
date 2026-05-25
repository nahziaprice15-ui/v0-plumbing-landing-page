'use client'

import { useEffect } from 'react'
import { useOpenBooking } from '@/components/BookingOpenContext'
import { SITE } from '@/lib/site'
import { Button } from '@/components/ui/button'

export function BookingPageContent() {
  const openBooking = useOpenBooking()

  useEffect(() => {
    openBooking()
  }, [openBooking])

  return (
    <section className="min-h-[60vh] container mx-auto px-4 py-16 max-w-2xl flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-3xl font-bold text-[#0b3a62]">Book a Service</h1>
      <p className="text-muted-foreground">
        Fill out the form and we&apos;ll call you within 2 hours to confirm.
      </p>
      <Button
        onClick={() => openBooking()}
        className="bg-[#c81e2d] hover:bg-[#a8181f] text-white"
      >
        Open Booking Form
      </Button>
      <p className="text-sm text-muted-foreground">
        Or call us directly at{' '}
        <a href={`tel:${SITE.phoneTel}`} className="font-medium text-[#0b3a62] hover:underline">
          {SITE.phoneDisplay}
        </a>
      </p>
    </section>
  )
}
