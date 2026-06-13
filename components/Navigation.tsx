'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BrandLogo } from '@/components/BrandLogo'

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobile = useCallback(() => setIsMobileMenuOpen(false), [])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMobileMenuOpen, closeMobile])

  const navLinks = [
    { label: 'All services', href: '/services' },
    { label: 'Articles', href: '/articles' },
    { label: 'Testimonials', href: '/#testimonials' },
    { label: 'FAQ', href: '/#faq' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 transition-all duration-300 ${
        isScrolled ? 'bg-brand/95 shadow-md backdrop-blur-md' : 'bg-brand/90 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 md:gap-4 min-h-[4rem] md:min-h-[4.25rem] py-2.5">
          {/* Zone 1: Logo */}
          <Link href="/" className="flex items-center gap-3 sm:gap-3.5 shrink-0">
            <BrandLogo size="nav" />
            <div className="hidden sm:block space-y-0.5">
              <div className="font-bold text-base sm:text-lg text-white leading-tight">MS & P LLC</div>
              <div className="text-[11px] sm:text-xs text-white/75">Licensed &amp; insured</div>
            </div>
          </Link>

          {/* Zone 2: Nav links (centered cluster) */}
          <div className="hidden md:flex flex-1 items-center justify-center min-w-0 px-2">
            <div className="flex flex-wrap items-center justify-center gap-x-5 lg:gap-x-8 gap-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm lg:text-[0.95rem] text-white/90 hover:text-white font-medium py-2 underline decoration-transparent decoration-2 underline-offset-[10px] hover:decoration-white/40 transition-colors shrink-0"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Zone 3a: Desktop CTA */}
          <div className="hidden md:flex items-center justify-end gap-3 shrink-0 md:pl-4 md:border-l md:border-white/15">
            <Button
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm font-semibold text-sm h-10 px-5 transition-colors"
            >
              <Link href="/book">Book service</Link>
            </Button>
          </div>

          {/* Zone 3b: Mobile CTA + toggle */}
          <div className="md:hidden ml-auto flex items-center justify-end gap-2 shrink-0">
            <Button
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm font-semibold text-sm h-11 px-3.5 transition-colors"
            >
              <Link href="/book">Book service</Link>
            </Button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="text-white h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-deep/98 border-t border-white/15 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 py-2 divide-y divide-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="block text-white/95 hover:text-white font-medium py-3.5 first:pt-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
