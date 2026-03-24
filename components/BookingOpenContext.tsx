'use client'

import { createContext, useContext } from 'react'

const BookingOpenContext = createContext<(() => void) | null>(null)

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
  openBooking: () => void
  children: React.ReactNode
}) {
  return <BookingOpenContext.Provider value={openBooking}>{children}</BookingOpenContext.Provider>
}
