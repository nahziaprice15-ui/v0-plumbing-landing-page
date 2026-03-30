import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sentry verification',
  robots: { index: false, follow: false },
}

export default function SentryExampleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
