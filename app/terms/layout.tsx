import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Terms of Service | MS & P LLC',
  description:
    'Terms of service for using the MS & P LLC website and requesting plumbing services in New Orleans.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | MS & P LLC Plumbing',
    url: `${siteUrl}/terms`,
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
