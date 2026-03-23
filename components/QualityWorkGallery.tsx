'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

type ProjectSlide = {
  title: string
  image: string
  description: string
  alt: string
}

const projects: ProjectSlide[] = [
  {
    title: 'Kitchen Pipe Replacement',
    image: '/images/before-after-1-after.svg',
    description: 'Replaced corroded pipes with modern PEX piping system',
    alt: 'Completed kitchen plumbing with new PEX piping installation',
  },
  {
    title: 'Bathroom Renovation',
    image: '/images/before-after-2-after.svg',
    description: 'Complete bathroom plumbing upgrade with new fixtures',
    alt: 'Finished bathroom plumbing renovation with updated fixtures',
  },
  {
    title: 'Water Heater Installation',
    image: '/images/before-after-3-after.svg',
    description: 'Installed energy-efficient tankless water heater',
    alt: 'Professional tankless water heater installation',
  },
]

export function QualityWorkGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
  }

  const current = projects[currentIndex]

  return (
    <section className="py-20 bg-card" aria-labelledby="quality-work-heading">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2
            id="quality-work-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            Quality Work, <span className="text-primary">Guaranteed Results</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Recent completed work from New Orleans homes and businesses.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
            <div className="relative aspect-[16/10] bg-gray-100">
              <Image
                src={current.image}
                alt={current.alt}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority={currentIndex === 0}
              />
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="sr-only" aria-live="polite" aria-atomic="true">
                    Slide {currentIndex + 1} of {projects.length}: {current.title}
                  </p>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{current.title}</h3>
                  <p className="text-muted-foreground">{current.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
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

              <div className="flex gap-2" aria-label="Project slides">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to project ${index + 1}`}
                    aria-current={index === currentIndex ? 'true' : undefined}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-8 bg-primary' : 'w-4 bg-border'
                    }`}
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
