'use client'

import Link from 'next/link'
import { SITE } from '@/lib/site'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen container mx-auto px-4 py-16 max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: February 22, 2026</p>
      </header>

      <section className="space-y-4">
        <p className="text-muted-foreground">
          This privacy policy explains how MS &amp; P LLC collects, uses, and protects information when
          you use this website or request our plumbing services.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <p className="text-muted-foreground">
          We may collect personal information that you provide directly, such as your name, phone
          number, email address, service address, and details about your plumbing needs when you submit
          a booking or contact form.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>To respond to your inquiries and service requests</li>
          <li>To schedule and perform plumbing services</li>
          <li>To improve our website and customer experience</li>
          <li>To comply with legal and regulatory requirements</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Data Sharing</h2>
        <p className="text-muted-foreground">
          We do not sell your personal information. We may share it with trusted service providers who
          help us operate our business (such as email or analytics providers) or as required by law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Third-Party Services</h2>
        <p className="text-muted-foreground">
          Our booking form stores appointment data securely via Airtable. Information you submit is used
          solely to schedule and fulfill your service request. We use Vercel Analytics (cookieless) to
          understand general site usage. No personal data is sold to advertisers or third parties.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Your Rights</h2>
        <p className="text-muted-foreground">
          Depending on your location, you may have rights to access, correct, or request deletion of
          your personal information. To exercise these rights, please contact us using the details
          below.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contact Us</h2>
        <p className="text-muted-foreground">
          If you have questions about this policy or how we handle your data, please contact us at{' '}
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

