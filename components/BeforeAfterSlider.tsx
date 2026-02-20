'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const transformations = [
  {
    title: 'Kitchen Pipe Replacement',
    before: '/images/plumber-hero.jpg',
    after: '/images/plumber-hero.jpg',
    description: 'Replaced corroded pipes with modern PEX piping system',
  },
  {
    title: 'Bathroom Renovation',
    before: '/images/plumber-hero.jpg',
    after: '/images/plumber-hero.jpg',
    description: 'Complete bathroom plumbing upgrade with new fixtures',
  },
  {
    title: 'Water Heater Installation',
    before: '/images/plumber-hero.jpg',
    after: '/images/plumber-hero.jpg',
    description: 'Installed energy-efficient tankless water heater',
  },
]

export function BeforeAfterSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? transformations.length - 1 : prev - 1))
    setSliderPosition(50)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === transformations.length - 1 ? 0 : prev + 1))
    setSliderPosition(50)
  }

  const current = transformations[currentIndex]

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Quality Work, <span className="text-primary">Guaranteed Results</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            See the difference professional plumbing makes. Real projects from our New Orleans customers.
          </p>
        </div>

        {/* Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
            {/* Image Comparison */}
            <div className="relative aspect-[16/10] bg-muted">
              <div className="absolute inset-0 select-none">
                {/* After Image */}
                <Image
                  src={current.after}
                  alt={`${current.title} - After`}
                  fill
                  className="object-cover"
                />
                {/* Before Image with Clip */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <Image
                    src={current.before}
                    alt={`${current.title} - Before`}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                  style={{ left: `${sliderPosition}%` }}
                  onMouseDown={(e) => {
                    const rect = e.currentTarget.parentElement!.getBoundingClientRect()
                    const handleMove = (moveEvent: MouseEvent) => {
                      const x = moveEvent.clientX - rect.left
                      const percent = (x / rect.width) * 100
                      setSliderPosition(Math.max(0, Math.min(100, percent)))
                    }
                    const handleUp = () => {
                      document.removeEventListener('mousemove', handleMove)
                      document.removeEventListener('mouseup', handleUp)
                    }
                    document.addEventListener('mousemove', handleMove)
                    document.addEventListener('mouseup', handleUp)
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <ChevronLeft className="w-4 h-4 text-primary" />
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/75 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                  Before
                </div>
                <div className="absolute top-4 right-4 bg-black/75 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                  After
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{current.title}</h3>
                  <p className="text-muted-foreground">{current.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrev}
                    aria-label="Previous project"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    aria-label="Next project"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Indicators */}
              <div className="flex gap-2">
                {transformations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index)
                      setSliderPosition(50)
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-8 bg-primary' : 'w-4 bg-border'
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
