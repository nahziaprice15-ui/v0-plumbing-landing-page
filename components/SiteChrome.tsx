'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { LiveBadge } from '@/components/LiveBadge'
import { BookingModal } from '@/components/BookingModal'
import { BookingOpenProvider } from '@/components/BookingOpenContext'

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [lastActiveElement, setLastActiveElement] = useState<HTMLElement | null>(null)

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
    <BookingOpenProvider openBooking={openBookingModal}>
      <main id="main-content" className="min-h-screen">
        <Navigation onBookingClick={openBookingModal} />
        {children}
        <Footer onBookingClick={openBookingModal} />
        <LiveBadge onBookingClick={openBookingModal} />
        <BookingModal isOpen={isBookingModalOpen} onClose={handleCloseBookingModal} />
      </main>
    </BookingOpenProvider>
  )
}
