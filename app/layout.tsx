import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { getSiteUrl } from '@/lib/site'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'New Orleans Plumber | 24/7 Emergency Plumbing | MS & P LLC',
  description:
    'Licensed New Orleans plumber for emergencies, drain cleaning, water heaters, leaks, and repipes. MS & P LLC—fast response and clear estimates.',
  keywords: ['plumbing', 'New Orleans', 'emergency plumbing', 'drain cleaning', 'water heater', 'plumber', 'MS & P LLC'],
  authors: [{ name: 'MS & P LLC', url: siteUrl }],
  creator: 'MS & P LLC',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'MS & P LLC Plumbing',
    images: [{ url: '/images/plumber-hero.jpg', width: 1200, height: 800, alt: 'MS & P LLC Professional Plumber' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/plumber-hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', sizes: '180x180', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {children}
          <Toaster theme="light" position="top-center" richColors closeButton />
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  )
}
