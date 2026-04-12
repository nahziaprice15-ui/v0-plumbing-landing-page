'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BrandLogo } from '@/components/BrandLogo'
import { services } from '@/data/services'
import { formatDisplayDate, SITE_WIDE_LAST_UPDATED_ISO } from '@/lib/freshness'
import { SITE } from '@/lib/site'

const footerMuted = 'text-[color:var(--footer-muted)]'

export function Footer({ onBookingClick }: { onBookingClick: () => void }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Band 1: brand + contact | quick links | services */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8 mb-12 md:mb-14">
          {/* Column 1 — brand + primary contact */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <BrandLogo size="footer" />
              <span className="font-semibold text-white tracking-tight">MS &amp; P LLC</span>
            </Link>
            <p className={`text-sm leading-relaxed max-w-md ${footerMuted}`}>
              New Orleans&apos; trusted plumbing experts. Serving the community with excellence since 2009.
            </p>
            <div className="space-y-4 pt-1 border-t border-white/10">
              <a
                href={`tel:${SITE.phoneTel}`}
                className="flex items-center gap-3 text-lg font-semibold text-white hover:text-secondary transition-colors"
              >
                <Phone className="w-5 h-5 text-secondary shrink-0" aria-hidden />
                {SITE.phoneDisplay}
              </a>
              <p className="text-xs uppercase tracking-wide text-white/45">24/7 emergency line</p>
              <a
                href={`mailto:${SITE.email}`}
                className={`flex items-start gap-3 text-sm ${footerMuted} hover:text-white transition-colors`}
              >
                <Mail className="w-5 h-5 text-secondary shrink-0 mt-0.5" aria-hidden />
                {SITE.email}
              </a>
              <div className={`flex items-start gap-3 text-sm ${footerMuted}`}>
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" aria-hidden />
                <span>
                  {SITE.city}, {SITE.state}
                  <span className="block mt-1 text-white/55">Serving all neighborhoods</span>
                </span>
              </div>
              <div className={`flex items-start gap-3 text-sm ${footerMuted}`}>
                <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" aria-hidden />
                <span>
                  24/7 emergency response
                  <span className="block mt-1 text-white/55">Mon–Fri 8am–6pm regular service</span>
                </span>
              </div>
            </div>
          </div>

          {/* Column 2 — quick links */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">Explore</h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="/services"
                  className={`${footerMuted} hover:text-white transition-colors text-[15px] leading-snug`}
                >
                  All services
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className={`${footerMuted} hover:text-white transition-colors text-[15px]`}>
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/#faq" className={`${footerMuted} hover:text-white transition-colors text-[15px]`}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/articles" className={`${footerMuted} hover:text-white transition-colors text-[15px]`}>
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/site-map" className={`${footerMuted} hover:text-white transition-colors text-[15px]`}>
                  Site map
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — service pages */}
          <div className="md:col-span-2 lg:col-span-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">Services</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm leading-relaxed">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className={`${footerMuted} hover:text-white transition-colors`}
                  >
                    {s.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Band 2 — emergency CTA */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-8 md:px-10 md:py-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 md:mb-12">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
              Need a plumber right now?
            </h3>
            <p className={`text-base ${footerMuted}`}>
              We&apos;re available 24/7 for emergencies—typical response within two hours.
            </p>
          </div>
          <Button
            onClick={onBookingClick}
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md font-semibold px-8 h-12 shrink-0 transition-colors"
          >
            <span className="flex items-center gap-2">
              Schedule service
              <Phone className="w-4 h-4" aria-hidden />
            </span>
          </Button>
        </div>

        {/* Band 3 — legal */}
        <div className="border-t border-white/10 pt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8 text-sm">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-white/80">© {currentYear} MS &amp; P LLC. All rights reserved.</p>
            <p className="text-xs text-white/45">Site content last updated {formatDisplayDate(SITE_WIDE_LAST_UPDATED_ISO)}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2 text-white/80">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/site-map" className="hover:text-white transition-colors">
              Site map
            </Link>
            <Link
              href="/admin-login"
              className="text-white/35 hover:text-white/55 text-xs transition-colors"
            >
              Staff login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
