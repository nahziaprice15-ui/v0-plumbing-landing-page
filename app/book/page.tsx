import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteChrome } from '@/components/SiteChrome'
import { BookingPageContent } from './BookingPageContent'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Book a Service | MS & P LLC',
  description: 'Schedule plumbing service with MS & P LLC — New Orleans. We respond within 2 hours.',
  alternates: { canonical: absoluteUrl('/book') },
}

export default function BookPage() {
  return (
    <SiteChrome>
      <Suspense>
        <BookingPageContent />
      </Suspense>
    </SiteChrome>
  )
}
