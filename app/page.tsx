'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { TrustBar } from '@/components/TrustBar'
import { Features } from '@/components/Features'
import { QualityWorkGallery } from '@/components/QualityWorkGallery'
import { Testimonials } from '@/components/Testimonials'
import { FAQ } from '@/components/FAQ'
import { Guarantee } from '@/components/Guarantee'
import { Pricing } from '@/components/Pricing'
import { Footer } from '@/components/Footer'
import { LiveBadge } from '@/components/LiveBadge'
import { BookingModal } from '@/components/BookingModal'
import { StructuredData } from '@/components/StructuredData'

export default function HomePage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [lastActiveElement, setLastActiveElement] = useState<HTMLElement | null>(null)

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'MS & P LLC',
    description:
      'Fast, reliable plumbing services in New Orleans. 24/7 emergency repairs, drain cleaning, water heater installation.',
    url: 'https://msandpllc.com',
    telephone: '+1-504-555-1234',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New Orleans',
      addressRegion: 'LA',
      addressCountry: 'US',
    },
    priceRange: '$',
    areaServed: 'New Orleans, LA and surrounding areas',
    image: 'https://msandpllc.com/images/plumber-hero.svg',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
  } as const

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Plumbing',
    provider: {
      '@type': 'LocalBusiness',
      name: 'MS & P LLC',
    },
    areaServed: 'New Orleans, LA',
  } as const

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do you offer emergency plumbing services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we provide 24/7 emergency plumbing services with rapid response times in New Orleans.',
        },
      },
    ],
  } as const

  const structuredData = [localBusinessSchema, serviceSchema, faqSchema]

  const openBookingModal = () => {
    setLastActiveElement(document.activeElement as HTMLElement | null)
    setIsBookingModalOpen(true)
  }

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false)
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus()
    }
  }

  return (
    <>
      <StructuredData data={structuredData as unknown as Record<string, unknown>} />
      <main id="main-content" className="min-h-screen">
        <Navigation onBookingClick={openBookingModal} />
        <Hero onBookingClick={openBookingModal} />
        <TrustBar />
        <Features onBookingClick={openBookingModal} />
        <QualityWorkGallery />
        <Testimonials />
        <Guarantee onBookingClick={openBookingModal} />
        <Pricing onBookingClick={openBookingModal} />
        <FAQ />
        <Footer onBookingClick={openBookingModal} />
        <LiveBadge onBookingClick={openBookingModal} />
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
        />
      </main>
    </>
  )
}
