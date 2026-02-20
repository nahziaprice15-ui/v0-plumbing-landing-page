'use client'

import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer({ onBookingClick }: { onBookingClick: () => void }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              New Orleans' trusted plumbing experts. Serving the community with excellence since 2009.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-white/80 hover:text-white transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-white/80 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#faq" className="text-white/80 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-white/80">Emergency Repairs</li>
              <li className="text-white/80">Drain Cleaning</li>
              <li className="text-white/80">Water Heater Service</li>
              <li className="text-white/80">Leak Detection</li>
              <li className="text-white/80">Fixture Installation</li>
              <li className="text-white/80">Pipe Repair</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <a href="mailto:info@msandp.com" className="text-white hover:text-secondary transition-colors">
                  info@msandp.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="text-white/80">
                  New Orleans, LA<br />
                  Serving all neighborhoods
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="text-white/80">
                  24/7 Emergency<br />
                  <span className="text-xs text-white/60">Mon-Fri 8AM-6PM Regular</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-primary via-primary to-primary/90 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 shadow-2xl shadow-primary/20 border border-white/10">
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">Need Plumbing Help Right Now?</h3>
            <p className="text-white/90 text-lg">We&apos;re available 24/7 for emergencies. Get help in 2 hours or less.</p>
          </div>
          <Button
            onClick={onBookingClick}
            size="lg"
            className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:shadow-2xl hover:shadow-secondary/50 hover:scale-110 transition-all duration-300 font-bold text-lg px-10 whitespace-nowrap relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Schedule Now
              <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          {/* Phone Number Section */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Phone className="w-6 h-6 text-secondary" />
            <div className="text-center">
              <a 
                href="tel:+15045551234" 
                className="text-2xl font-bold text-white hover:text-secondary transition-colors"
              >
                (504) 555-1234
              </a>
              <div className="text-sm text-white/60 mt-1">24/7 Emergency Line</div>
            </div>
          </div>

          {/* Company Name & Legal */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M&P</span>
              </div>
              <div>
                <div className="font-bold text-lg text-white">MS & P LLC</div>
                <div className="text-xs text-white/60">Licensed & Insured</div>
              </div>
            </div>
          </div>

          {/* Copyright & Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <div>
              © {currentYear} MS & P LLC. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
