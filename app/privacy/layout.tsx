import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy | MS & P LLC',
  description:
    'How MS & P LLC collects, uses, and protects your information when you use our website or plumbing services in New Orleans.',
  alternates: {
    canonical: absoluteUrl('/privacy'),
  },
  openGraph: {
    title: 'Privacy Policy | MS & P LLC Plumbing',
    url: absoluteUrl('/privacy'),
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
