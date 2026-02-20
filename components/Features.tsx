'use client'

import { Droplets, Wrench, Zap, Wind, Thermometer, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const services = [
  {
    icon: Zap,
    title: 'Emergency Repairs',
    description: '24/7 rapid response for urgent plumbing issues. We arrive within 2 hours.',
    features: ['Burst pipes', 'Major leaks', 'No water', 'Flooding'],
  },
  {
    icon: Droplets,
    title: 'Drain Cleaning',
    description: 'Professional drain and sewer line cleaning with advanced equipment.',
    features: ['Clogged drains', 'Sewer backups', 'Slow drainage', 'Root removal'],
  },
  {
    icon: Thermometer,
    title: 'Water Heater Service',
    description: 'Installation, repair, and maintenance of all water heater types.',
    features: ['Tank & tankless', 'Repairs', 'Installation', 'Maintenance'],
  },
  {
    icon: Wind,
    title: 'Leak Detection',
    description: 'Advanced technology to find and fix hidden leaks before they cause damage.',
    features: ['Hidden leaks', 'Slab leaks', 'Wall leaks', 'Prevention'],
  },
  {
    icon: Wrench,
    title: 'Fixture Installation',
    description: 'Expert installation of faucets, toilets, sinks, and all plumbing fixtures.',
    features: ['Faucets', 'Toilets', 'Sinks', 'Showers'],
  },
  {
    icon: Shield,
    title: 'Pipe Repair',
    description: 'Comprehensive pipe repair and replacement services for all pipe types.',
    features: ['Repiping', 'Pipe bursts', 'Corrosion', 'Upgrades'],
  },
]

export function Features({ onBookingClick }: { onBookingClick: () => void }) {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Comprehensive Plumbing Services
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            From emergency repairs to routine maintenance, we handle all your plumbing needs
            with expertise and care.
          </p>
        </div>

        {/* Service Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center animate-in fade-in duration-700 delay-700">
          <Button
            onClick={onBookingClick}
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg px-8"
          >
            Book Your Service Now
          </Button>
        </div>
      </div>
    </section>
  )
}
