'use client'

import { createContext, useContext } from 'react'
import type { BookingServiceTypeId } from '@/lib/bookingServiceType'

export type OpenBookingOptions = { serviceType?: BookingServiceTypeId }

type OpenBookingHandler = (opts?: OpenBookingOptions) => void | Promise<void>

const BookingOpenContext = createContext<OpenBookingHandler | null>(null)

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
  openBooking: OpenBookingHandler
  children: React.ReactNode
}) {
  return <BookingOpenContext.Provider value={openBooking}>{children}</BookingOpenContext.Provider>
}
