'use client'

import { CheckCircle2, Clock, Shield, Star } from 'lucide-react'

const trustMetrics = [
  {
    icon: Star,
    value: '4.9/5',
    label: 'Customer Rating',
  },
  {
    icon: CheckCircle2,
    value: '2,000+',
    label: 'Jobs Completed',
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'Emergency Service',
  },
  {
    icon: Shield,
    value: '15+',
    label: 'Years Experience',
  },
]

export function TrustBar() {
  return (
    <section className="py-12 bg-muted border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{metric.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
