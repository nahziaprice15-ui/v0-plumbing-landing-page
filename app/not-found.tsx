'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center">
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Page not found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </main>
  )
}

import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-secondary text-secondary-foreground font-semibold hover:scale-105 transition-transform"
        >
          Back to homepage
        </Link>
      </div>
    </main>
  )
}

