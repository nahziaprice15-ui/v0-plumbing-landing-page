'use client'

import { ArrowRight, Clock, Shield, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Hero({ onBookingClick }: { onBookingClick: () => void }) {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 bg-gradient-to-br from-brand via-brand to-brand-deep text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
              <Shield className="w-4 h-4" />
              Licensed & Insured in New Orleans
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance drop-shadow-sm">
              Expert Plumbing Services{' '}
              <span className="text-secondary">You Can Trust</span>
            </h1>

            <p className="text-lg md:text-xl text-white/85 leading-relaxed text-pretty">
              Fast, reliable plumbing solutions for New Orleans homes and businesses. 
              Available 24/7 for emergencies with same-day service guaranteed.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">24/7 Available</div>
                  <div className="text-sm text-white/75">Same-day service</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-white">15+ Years</div>
                  <div className="text-sm text-white/75">Experience</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={onBookingClick}
                size="lg"
                className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:shadow-2xl hover:shadow-secondary/50 hover:scale-105 transition-all duration-300 font-bold text-lg px-8 py-6 h-auto relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  Get Service Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="font-semibold text-lg px-8 py-6 h-auto border-2 border-white/90 text-white bg-white/5 hover:bg-white hover:text-brand hover:scale-105 transition-all duration-300"
              >
                <a href="#services">View Services</a>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/25">
              <div>
                <div className="text-2xl font-bold text-white">4.9/5</div>
                <div className="text-sm text-white/75">500+ reviews</div>
              </div>
              <div className="h-12 w-px bg-white/25" />
              <div>
                <div className="text-2xl font-bold text-white">2,000+</div>
                <div className="text-sm text-white/75">Jobs completed</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/plumber-hero.svg"
                alt="Professional plumber from MS & P LLC"
                width={600}
                height={700}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-border">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-card-foreground">Same-Day Service</div>
                    <div className="text-sm text-muted-foreground">Book within 2 hours</div>
                  </div>
                  <Button
                    onClick={onBookingClick}
                    size="sm"
                    className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:shadow-lg hover:shadow-secondary/40 hover:scale-110 transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Book Now</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
