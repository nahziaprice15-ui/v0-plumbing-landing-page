'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navigation({ onBookingClick }: { onBookingClick: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Services', href: '#services' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background shadow-md' : 'bg-background/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">M&P</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg text-foreground">MS & P LLC</div>
              <div className="text-xs text-muted-foreground">Licensed & Insured</div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+15045551234"
              className="hidden sm:flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-semibold">(504) 555-1234</span>
            </a>
            <Button
              onClick={onBookingClick}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-6"
            >
              Book Service
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-foreground p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+15045551234"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors py-2 sm:hidden"
            >
              <Phone className="w-4 h-4" />
              <span className="font-semibold">(504) 555-1234</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
