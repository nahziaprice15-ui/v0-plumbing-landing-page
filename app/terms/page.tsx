'use client'

import Link from 'next/link'
import { SITE } from '@/lib/site'

export default function TermsPage() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-16 max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: February 22, 2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-muted-foreground">
          These Terms of Service govern your use of the MS &amp; P LLC website and plumbing services.
          By using our site or requesting service, you agree to these terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Services</h2>
        <p className="text-muted-foreground">
          We provide residential and commercial plumbing services in the New Orleans area. Service
          details, pricing, and availability may vary and will be confirmed at the time of booking.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">User Responsibilities</h2>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Provide accurate contact and property information</li>
          <li>Ensure safe access to the work area</li>
          <li>Comply with local regulations and permit requirements, if applicable</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Liability</h2>
        <p className="text-muted-foreground">
          To the fullest extent permitted by law, MS &amp; P LLC is not liable for indirect, incidental,
          or consequential damages arising from use of our website or services.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Governing Law</h2>
        <p className="text-muted-foreground">
          These terms are governed by the laws of the State of Louisiana, without regard to conflict of
          law principles.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="text-muted-foreground">
          For questions about these terms, please contact us at{' '}
          <a href={`mailto:${SITE.email}`} className="font-medium text-brand hover:underline">
            {SITE.email}
          </a>
          {' '}
          or call{' '}
          <a href={`tel:${SITE.phoneTel}`} className="font-medium text-brand hover:underline">
            {SITE.phoneDisplay}
          </a>
          .
        </p>
      </section>

      <footer className="pt-4">
        <a href="/" className="text-brand hover:underline">
          ← Back to home
        </a>
      </footer>
    </main>
  )
}

