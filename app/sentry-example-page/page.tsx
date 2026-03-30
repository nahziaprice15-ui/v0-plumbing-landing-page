'use client'

import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

/**
 * Matches Sentry’s Next.js guide: visit this route in dev and use the button
 * to send a test event (same behavior as the floating “Test Sentry” control).
 */
export default function SentryExamplePage() {
  const sendTestEvent = () => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
    if (!dsn) {
      toast.error('Set NEXT_PUBLIC_SENTRY_DSN in .env and restart the dev server.')
      return
    }
    const err = new Error('[Sentry verify] Example page — safe to delete this issue')
    Sentry.captureException(err, {
      tags: { source: 'sentry-example-page' },
      level: 'warning',
    })
    toast.success('Sent test event. Check Sentry → Issues for this title.', {
      duration: 8000,
    })
  }

  return (
    <main className="container mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Sentry verification</h1>
      <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
        Use the button below to send a test event to your Sentry project. Ensure{' '}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_SENTRY_DSN</code>{' '}
        is set and you restarted <code className="rounded bg-muted px-1 py-0.5 text-xs">npm run dev</code>{' '}
        after changing <code className="rounded bg-muted px-1 py-0.5 text-xs">.env</code>.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={sendTestEvent}>
          Send test event
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  )
}
