'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { LiveBadge } from '@/components/LiveBadge'
import { BookingModal } from '@/components/BookingModal'
import { CalendlyPrequalifyModal } from '@/components/calendly/CalendlyPrequalifyModal'
import { BookingOpenProvider, type OpenBookingOptions } from '@/components/BookingOpenContext'
import { buildCalendlyUrl, getCalendlyConfig, type CalendlyPrefill } from '@/lib/calendly'
import { openCalendlyPopup } from '@/lib/calendly-script'
import type { BookingServiceTypeId } from '@/lib/bookingServiceType'

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [bookingPresetServiceType, setBookingPresetServiceType] = useState<BookingServiceTypeId | null>(
    null,
  )
  const [isCalendlyPrequalifyOpen, setIsCalendlyPrequalifyOpen] = useState(false)
  const [lastActiveElement, setLastActiveElement] = useState<HTMLElement | null>(null)
  const calendlyConfig = getCalendlyConfig()

  const openBookingModal = async (opts?: OpenBookingOptions) => {
    setLastActiveElement(document.activeElement as HTMLElement | null)

    if (calendlyConfig?.usePopupFlow) {
      setIsCalendlyPrequalifyOpen(true)
      return
    }

    setBookingPresetServiceType(opts?.serviceType ?? null)
    setIsBookingModalOpen(true)
  }

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false)
    setBookingPresetServiceType(null)
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus()
    }
  }

  const handleOpenCalendlyFromPrefill = async (prefill: CalendlyPrefill) => {
    if (!calendlyConfig) {
      setIsCalendlyPrequalifyOpen(false)
      setIsBookingModalOpen(true)
      return
    }
    const calendlyUrl = buildCalendlyUrl(calendlyConfig)
    const opened = await openCalendlyPopup(calendlyUrl, prefill)
    setIsCalendlyPrequalifyOpen(false)
    if (!opened) {
      setIsBookingModalOpen(true)
    }
  }

  return (
    <BookingOpenProvider openBooking={openBookingModal}>
      <main id="main-content" className="min-h-screen">
        <Navigation onBookingClick={() => openBookingModal()} />
        {children}
        <Footer onBookingClick={() => openBookingModal()} />
        <LiveBadge onBookingClick={() => openBookingModal()} />
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          presetServiceType={bookingPresetServiceType}
        />
        <CalendlyPrequalifyModal
          isOpen={isCalendlyPrequalifyOpen}
          onClose={() => setIsCalendlyPrequalifyOpen(false)}
          onContinue={handleOpenCalendlyFromPrefill}
        />
      </main>
    </BookingOpenProvider>
  )
}
