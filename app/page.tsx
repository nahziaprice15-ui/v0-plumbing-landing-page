import type { Metadata } from 'next'
import { StructuredData } from '@/components/StructuredData'
import { HomePageEntry } from '@/components/HomePageEntry'
import { homeFaqs, buildFaqPageJsonLd } from '@/data/faqs'
import { getSiteUrl } from '@/lib/site'
import {
  buildLocalBusinessJsonLd,
  buildPlumbingServiceJsonLd,
  combineJsonLd,
} from '@/lib/schema'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'New Orleans Plumber | 24/7 Emergency Plumbing | MS & P LLC',
  description:
    'Licensed New Orleans plumber for emergencies, drain cleaning, water heaters, leaks, and repipes. Fast response and clear estimates. Book online or call MS & P LLC.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'MS & P LLC Plumbing',
    title: 'New Orleans Plumber | 24/7 Emergency | MS & P LLC',
    description:
      'Licensed New Orleans plumber: emergencies, drains, water heaters, leak detection, fixtures, and pipe repair. Book online today.',
    images: [{ url: '/images/plumber-hero.svg', width: 1200, height: 800, alt: 'MS & P LLC Professional Plumber' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Orleans Plumber | MS & P LLC',
    description:
      '24/7 emergency plumbing, drain cleaning, and water heaters in New Orleans. Licensed and insured.',
    images: ['/images/plumber-hero.svg'],
  },
}

export default function HomePage() {
  const structuredData = combineJsonLd([
    buildLocalBusinessJsonLd(),
    buildPlumbingServiceJsonLd(),
    buildFaqPageJsonLd(homeFaqs),
  ])

  return (
    <>
      <StructuredData data={structuredData} />
      <HomePageEntry />
    </>
  )
}
