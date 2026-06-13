'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { serviceDetailSlugToBookingType } from '@/lib/bookingServiceType'
import { SITE } from '@/lib/site'

export function ServicePageCtas() {
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : undefined
  const serviceType = serviceDetailSlugToBookingType(slug)
  const bookHref = serviceType ? `/book?service=${serviceType}` : '/book'

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
      <Button asChild className="bg-secondary text-secondary-foreground font-semibold">
        <Link href={bookHref}>Book online</Link>
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
