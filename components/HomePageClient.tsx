'use client'

import { Hero } from '@/components/Hero'
import { TrustBar } from '@/components/TrustBar'
import { Features } from '@/components/Features'
import { QualityWorkGallery } from '@/components/QualityWorkGallery'
import { Testimonials } from '@/components/Testimonials'
import { FAQ } from '@/components/FAQ'
import { Guarantee } from '@/components/Guarantee'

export function HomePageClient() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Features />
      <QualityWorkGallery />
      <Testimonials />
      <Guarantee />
      <FAQ />
    </>
  )
}
