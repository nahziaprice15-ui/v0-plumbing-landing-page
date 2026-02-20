'use client'

import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const pricingTiers = [
  {
    name: 'Basic Service',
    price: '$89',
    description: 'Perfect for simple fixes and minor repairs',
    features: [
      'Service call fee waived with repair',
      'Standard business hours',
      'Basic diagnostics',
      '30-day warranty',
      'Email support',
    ],
    popular: false,
  },
  {
    name: 'Standard Service',
    price: '$149',
    description: 'Most popular for typical plumbing needs',
    features: [
      'All Basic features',
      'Extended business hours',
      'Advanced diagnostics',
      '90-day warranty',
      'Priority phone support',
      'Free estimates',
    ],
    popular: true,
  },
  {
    name: 'Premium Service',
    price: '$249',
    description: 'Comprehensive service for complex projects',
    features: [
      'All Standard features',
      'Weekend availability',
      'Complete system inspection',
      '1-year warranty',
      '24/7 support line',
      'Preventive maintenance plan',
    ],
    popular: false,
  },
  {
    name: 'Emergency Service',
    price: '$350',
    description: 'Immediate 24/7 response for urgent issues',
    features: [
      'Guaranteed 2-hour response',
      'Available 24/7/365',
      'Any complexity level',
      '1-year warranty',
      'Direct technician line',
      'Same-day resolution',
    ],
    popular: false,
  },
]

export function Pricing({ onBookingClick }: { onBookingClick: () => void }) {
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Transparent <span className="text-primary">Pricing</span> for Every Need
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            No hidden fees, no surprises. Choose the service level that fits your needs.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-card border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 duration-700 ${
                tier.popular
                  ? 'border-secondary shadow-lg scale-105'
                  : 'border-border'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold text-primary">{tier.price}</span>
                  <span className="text-muted-foreground">starting</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onBookingClick}
                className={`w-full font-semibold ${
                  tier.popular
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                Book {tier.name}
              </Button>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-500">
          <p>
            * Final pricing depends on job complexity and materials. Free estimates provided before work begins.
          </p>
        </div>
      </div>
    </section>
  )
}
