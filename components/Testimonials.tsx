'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Garden District',
    rating: 5,
    text: 'MS & P saved us during a plumbing emergency at 2 AM. They arrived within an hour and fixed our burst pipe professionally. Highly recommend!',
    date: '2 weeks ago',
  },
  {
    name: 'Michael Chen',
    location: 'French Quarter',
    rating: 5,
    text: 'Outstanding service! They replaced our water heater quickly and at a fair price. The technician was knowledgeable and cleaned up perfectly.',
    date: '1 month ago',
  },
  {
    name: 'Lisa Martinez',
    location: 'Uptown',
    rating: 5,
    text: 'Best plumbers in New Orleans! They fixed a complex drainage issue that two other companies couldn\'t solve. True professionals.',
    date: '3 weeks ago',
  },
  {
    name: 'David Brown',
    location: 'Bywater',
    rating: 5,
    text: 'Great communication and quality work. They upgraded all our fixtures during our renovation and it looks amazing. Worth every penny!',
    date: '1 week ago',
  },
  {
    name: 'Jennifer Wilson',
    location: 'Mid-City',
    rating: 5,
    text: 'Called them for a leak detection and they found issues I didn\'t even know existed. Honest, reliable, and fair pricing. Will use again!',
    date: '2 months ago',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Don't just take our word for it. See what New Orleans homeowners say about our service.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-8 h-8 text-primary/20" />
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
              </div>
              <p className="text-foreground leading-relaxed mb-6">{testimonial.text}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
                <div className="text-xs text-muted-foreground">{testimonial.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center animate-in fade-in duration-700 delay-500">
          <div className="inline-flex items-center gap-3 bg-muted px-6 py-4 rounded-xl">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
              ))}
            </div>
            <div className="text-left">
              <div className="font-bold text-foreground">4.9 out of 5</div>
              <div className="text-sm text-muted-foreground">Based on 500+ reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
