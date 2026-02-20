'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/Hero'
import { TrustBar } from '@/components/TrustBar'
import { Features } from '@/components/Features'
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider'
import { Testimonials } from '@/components/Testimonials'
import { FAQ } from '@/components/FAQ'
import { Guarantee } from '@/components/Guarantee'
import { Pricing } from '@/components/Pricing'
import { Footer } from '@/components/Footer'
import { LiveBadge } from '@/components/LiveBadge'
import { BookingModal } from '@/components/BookingModal'

export default function HomePage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <Navigation onBookingClick={() => setIsBookingModalOpen(true)} />
      <Hero onBookingClick={() => setIsBookingModalOpen(true)} />
      <TrustBar />
      <Features onBookingClick={() => setIsBookingModalOpen(true)} />
      <BeforeAfterSlider />
      <Testimonials />
      <Guarantee onBookingClick={() => setIsBookingModalOpen(true)} />
      <Pricing onBookingClick={() => setIsBookingModalOpen(true)} />
      <FAQ />
      <Footer onBookingClick={() => setIsBookingModalOpen(true)} />
      <LiveBadge onBookingClick={() => setIsBookingModalOpen(true)} />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </main>
  )
}
