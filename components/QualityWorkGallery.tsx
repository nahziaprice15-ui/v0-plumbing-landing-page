'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

type GalleryImage = {
  src: string
  alt: string
}

type ProjectSlideSingle = {
  layout: 'single'
  title: string
  description: string
  image: string
  alt: string
}

type ProjectSlideGallery = {
  layout: 'gallery'
  title: string
  description: string
  images: GalleryImage[]
  /** Short labels for screen reader summary when multiple photos are visible */
  a11yPhotoLabels: string
}

type ProjectSlide = ProjectSlideSingle | ProjectSlideGallery

const projects: ProjectSlide[] = [
  {
    layout: 'single',
    title: 'Residential underground installation',
    image: '/images/residential-underground-installation-1.png',
    description:
      'PVC drain and vent rough-in in trenches with vertical risers, ready for slab—clean layout in compacted clay.',
    alt: 'White PVC plumbing rough-in in dug trenches with multiple pipe runs and vertical risers at a residential site',
  },
  {
    layout: 'single',
    title: 'Sewer line installation',
    image: '/images/sewer-line-installation-1.png',
    description:
      'New sewer run in a straight yard trench from the home—proper depth, bedding, and alignment before backfill.',
    alt: 'Residential backyard trench with white PVC sewer pipe running from a modern two-story house toward the lawn',
  },
  {
    layout: 'gallery',
    title: 'Bathroom installation',
    description:
      'Full bathroom fit-out: freestanding tub and floor-mounted filler, walk-in shower with rain and handheld fixtures, and marble vanity with vessel sink and toilet—all coordinated tile and trim.',
    a11yPhotoLabels: 'freestanding tub area, walk-in shower, vanity and toilet',
    images: [
      {
        src: '/images/bathroom-installation-tub.png',
        alt: 'Modern bathroom with freestanding white tub, floor-mounted chrome faucet, large grey wall tiles, and blue geometric floor tile with recessed niche',
      },
      {
        src: '/images/bathroom-installation-shower.png',
        alt: 'Walk-in shower with light marble-look wall tile, square rain showerhead, handheld on slide bar, chrome valves, and dark geometric accent tile in niche and on floor',
      },
      {
        src: '/images/bathroom-installation-vanity.png',
        alt: 'White bathroom vanity with marble countertop, scalloped white vessel sink, waterfall faucet, and modern white toilet on a white wall',
      },
    ],
  },
  {
    layout: 'single',
    title: 'Water Heater Installation',
    image: '/images/before-after-3-after.svg',
    description: 'Installed energy-efficient tankless water heater',
    alt: 'Professional tankless water heater installation',
  },
]

function SlideHero({ project, slideIndex }: { project: ProjectSlide; slideIndex: number }) {
  if (project.layout === 'gallery') {
    return (
      <div className="bg-gray-100 p-2 md:p-3">
        <div
          className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-3"
          role="group"
          aria-label={`${project.title}: ${project.images.length} photos`}
        >
          {project.images.map((img, i) => (
            <div
              key={img.src}
              className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-200"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 280px"
                priority={slideIndex === 0 && i === 0}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-[16/10] bg-gray-100">
      <Image
        src={project.image}
        alt={project.alt}
        fill
        className="object-cover"
        sizes="(max-width: 896px) 100vw, 896px"
        priority={slideIndex === 0}
      />
    </div>
  )
}

export function QualityWorkGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
  }

  const current = projects[currentIndex]

  const liveMessage =
    current.layout === 'gallery'
      ? `Slide ${currentIndex + 1} of ${projects.length}: ${current.title}. Three photos shown together: ${current.a11yPhotoLabels}.`
      : `Slide ${currentIndex + 1} of ${projects.length}: ${current.title}`

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
            <SlideHero project={current} slideIndex={currentIndex} />

            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <p className="sr-only" aria-live="polite" aria-atomic="true">
                    {liveMessage}
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
