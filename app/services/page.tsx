import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteChrome } from '@/components/SiteChrome'
import { ServicesHub, ServicesHubFallback } from '@/components/ServicesHub'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Residential, Commercial & Emergency Plumbing | New Orleans | MS & P LLC',
  description:
    'Browse home, commercial, and 24/7 emergency plumbing in New Orleans—clear services by property type and one-tap call or book with MS & P LLC.',
  alternates: {
    canonical: absoluteUrl('/services'),
  },
  openGraph: {
    title: 'Plumbing services — residential, commercial & emergencies | MS & P LLC',
    description:
      'Residential, commercial, and emergency plumbing across New Orleans. Licensed & insured.',
    url: absoluteUrl('/services'),
  },
}

export default function ServicesIndexPage() {
  return (
    <SiteChrome>
      <Suspense fallback={<ServicesHubFallback />}>
        <ServicesHub />
      </Suspense>
    </SiteChrome>
  )
}
