'use client'

import { Shield, CheckCircle2, Clock, ThumbsUp, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

const guaranteePoints = [
  {
    icon: CheckCircle2,
    title: '100% Satisfaction',
    description: 'We don\'t consider the job done until you\'re completely satisfied',
  },
  {
    icon: Clock,
    title: '2-Hour Response',
    description: 'Emergency calls answered and serviced within 2 hours',
  },
  {
    icon: Award,
    title: '1-Year Warranty',
    description: 'All labor guaranteed for a full year after completion',
  },
  {
    icon: ThumbsUp,
    title: 'No Hidden Fees',
    description: 'Transparent pricing with detailed estimates before we start',
  },
]

export function Guarantee({ onBookingClick }: { onBookingClick: () => void }) {
  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/10 mb-6">
              <Shield className="w-10 h-10" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              Our Ironclad Guarantee
            </h2>
            <p className="text-lg text-primary-foreground/80 text-pretty max-w-2xl mx-auto">
              Your satisfaction is our priority. We back every job with our comprehensive service guarantee.
            </p>
          </div>

          {/* Guarantee Points */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {guaranteePoints.map((point, index) => {
              const Icon = point.icon
              return (
                <div
                  key={index}
                  className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{point.title}</h3>
                      <p className="text-primary-foreground/80 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="text-center animate-in fade-in duration-700 delay-500">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold mb-2">Ready to Experience the Difference?</h3>
                <p className="text-primary-foreground/80">
                  Join 2,000+ satisfied customers in New Orleans
                </p>
              </div>
              <Button
                onClick={onBookingClick}
                size="lg"
                className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:shadow-2xl hover:shadow-secondary/50 hover:scale-110 transition-all duration-300 font-bold text-lg px-8 whitespace-nowrap relative overflow-hidden group"
              >
                <span className="relative z-10">Lock in Your Guarantee</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
