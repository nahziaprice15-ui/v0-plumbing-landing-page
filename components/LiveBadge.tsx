'use client'

import { useEffect, useState } from 'react'
import { Wrench } from 'lucide-react'

const serviceAreas = [
  'French Quarter',
  'Garden District',
  'Uptown',
  'Mid-City',
  'Bywater',
  'Marigny',
  'Lakeview',
  'Algiers',
]

export function LiveBadge({ onBookingClick }: { onBookingClick: () => void }) {
  const [currentArea, setCurrentArea] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentArea((prev) => (prev + 1) % serviceAreas.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-in fade-in slide-in-from-left-8 duration-500">
      <div className="bg-background border-2 border-secondary shadow-2xl rounded-2xl p-4 max-w-xs hover:scale-105 transition-transform duration-300">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-charcoal text-white rounded-full flex items-center justify-center text-xs hover:bg-charcoal/80 transition-colors"
          aria-label="Close notification"
        >
          ×
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
            <Wrench className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground text-sm mb-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Service Active Now
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Our team is currently in{' '}
              <span className="font-semibold text-foreground transition-all duration-300">
                {serviceAreas[currentArea]}
              </span>
            </p>
            <button
              onClick={onBookingClick}
              className="text-xs text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              Book your service →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
