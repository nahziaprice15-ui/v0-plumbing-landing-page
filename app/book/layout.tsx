import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Book a service | MS & P LLC',
  description:
    'Schedule plumbing service online with MS & P LLC in New Orleans. Pick a time that works for you.',
  alternates: {
    canonical: absoluteUrl('/book'),
  },
  openGraph: {
    title: 'Book a service | MS & P LLC',
    description:
      'Schedule plumbing service online with MS & P LLC in New Orleans. Pick a time that works for you.',
    url: absoluteUrl('/book'),
    type: 'website',
  },
}

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return children
}
