'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOpenBooking } from '@/components/BookingOpenContext'
import { serviceDetailSlugToBookingType } from '@/lib/bookingServiceType'
import { SITE } from '@/lib/site'

export function ServicePageCtas() {
  const openBooking = useOpenBooking()
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : undefined

  const handleBookOnline = () => {
    const serviceType = serviceDetailSlugToBookingType(slug)
    openBooking(serviceType ? { serviceType } : undefined)
  }

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
      <Button
        type="button"
        onClick={handleBookOnline}
        className="bg-secondary text-secondary-foreground font-semibold"
      >
        Book online
      </Button>
      <Button variant="outline" asChild>
        <a href={`tel:${SITE.phoneTel}`} className="gap-2">
          <Phone className="h-4 w-4" />
          Call {SITE.phoneDisplay}
        </a>
      </Button>
      <Button variant="ghost" asChild className="text-muted-foreground">
        <Link href="/services">All services</Link>
      </Button>
    </div>
  )
}
