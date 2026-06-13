'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { LiveBadge } from '@/components/LiveBadge'

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />
      {children}
      <Footer />
      <LiveBadge />
    </main>
  )
}
