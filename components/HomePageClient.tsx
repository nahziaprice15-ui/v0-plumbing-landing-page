'use client'

import { Hero } from '@/components/Hero'
import { TrustBar } from '@/components/TrustBar'
import { Features } from '@/components/Features'
import { QualityWorkGallery } from '@/components/QualityWorkGallery'
import { Testimonials } from '@/components/Testimonials'
import { FAQ } from '@/components/FAQ'
import { Guarantee } from '@/components/Guarantee'
import { useOpenBooking } from '@/components/BookingOpenContext'

export function HomePageClient() {
  const onBookingClick = useOpenBooking()
  return (
    <>
      <Hero onBookingClick={onBookingClick} />
      <TrustBar />
      <Features onBookingClick={onBookingClick} />
      <QualityWorkGallery />
      <Testimonials />
      <Guarantee onBookingClick={onBookingClick} />
      <FAQ />
    </>
  )
}
