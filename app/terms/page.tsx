'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: March 16, 2026
        </p>

        <div className="space-y-6 text-sm md:text-base leading-relaxed">
          <p>
            These Terms of Service govern your use of this website and any plumbing
            services provided by MS &amp; P LLC.
          </p>
          <p>
            This page is a general template and does not constitute legal advice. You
            should review and update it with your actual service terms and consult with
            a qualified attorney to ensure compliance with applicable laws.
          </p>
        </div>

        <div className="mt-10">
          <Link href="/" className="text-secondary hover:underline">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  )
}

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
          For questions about these terms, please contact us at
          <span className="font-medium"> info@msandp.com</span>.
        </p>
      </section>

      <footer className="pt-4">
        <a href="/" className="text-primary hover:underline">
          ← Back to home
        </a>
      </footer>
    </main>
  )
}

