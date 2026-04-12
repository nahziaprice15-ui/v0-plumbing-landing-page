import type { Metadata } from 'next'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Sentry verification',
  robots: { index: false, follow: false },
  alternates: {
    canonical: absoluteUrl('/sentry-example-page'),
  },
  openGraph: {
    url: absoluteUrl('/sentry-example-page'),
  },
}

export default function SentryExampleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
