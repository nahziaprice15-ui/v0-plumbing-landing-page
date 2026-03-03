import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://msandpllc.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'MS & P LLC - Expert Plumbing Services in New Orleans',
  description: 'Fast, reliable plumbing services in New Orleans. 24/7 emergency repairs, drain cleaning, water heater installation. Licensed & insured. Book online today!',
  keywords: ['plumbing', 'New Orleans', 'emergency plumbing', 'drain cleaning', 'water heater', 'plumber', 'MS & P LLC'],
  authors: [{ name: 'MS & P LLC', url: siteUrl }],
  creator: 'MS & P LLC',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'MS & P LLC Plumbing',
    title: 'MS & P LLC - Expert Plumbing Services in New Orleans',
    description: 'Fast, reliable plumbing services in New Orleans. 24/7 emergency repairs, drain cleaning, water heater installation. Licensed & insured. Book online today!',
    images: [{ url: '/placeholder.svg', width: 1200, height: 630, alt: 'MS & P LLC Plumbing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MS & P LLC - Expert Plumbing Services in New Orleans',
    description: 'Fast, reliable plumbing services in New Orleans. 24/7 emergency repairs. Licensed & insured.',
    images: ['/placeholder.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
        <Analytics />
      </body>
    </html>
  )
}
