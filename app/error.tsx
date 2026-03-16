'use client'

import { useEffect } from 'react'
import Link from 'next/link'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[app-error]', error)
  }, [error])

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center">
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Something went wrong</h1>
        <p className="text-lg text-muted-foreground mb-8">
          An unexpected error occurred. You can try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full border border-border font-semibold hover:bg-card transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}

