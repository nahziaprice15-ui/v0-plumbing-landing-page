'use client'

import { createContext, useContext } from 'react'
import type { BookingServiceTypeId } from '@/lib/bookingServiceType'

export type OpenBookingOptions = { serviceType?: BookingServiceTypeId }

const BookingOpenContext = createContext<((opts?: OpenBookingOptions) => void) | null>(null)

export function useOpenBooking() {
  const open = useContext(BookingOpenContext)
  if (!open) {
    throw new Error('useOpenBooking must be used within SiteChrome')
  }
  return open
}

export function BookingOpenProvider({
  openBooking,
  children,
}: {
  openBooking: (opts?: OpenBookingOptions) => void
  children: React.ReactNode
}) {
  return <BookingOpenContext.Provider value={openBooking}>{children}</BookingOpenContext.Provider>
}
