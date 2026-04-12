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
    title: 'Residential bathroom renovation',
    image: '/images/before-after-1-before.svg',
    description:
      'Fixture and finish upgrades with coordinated tile work, careful rough-in, and protection of surrounding spaces.',
    alt: 'Bathroom renovation in progress showing updated wall tile, tub and shower area, and plumbing fixtures',
  },
  {
    layout: 'single',
    title: 'Completed bathroom transformation',
    image: '/images/before-after-1-after.svg',
    description:
      'The same space finished—walk-in shower, modern vanity, and polished details ready for daily use.',
    alt: 'Completed modern bathroom with walk-in shower, vanity, and updated tile finishes',
  },
  {
    layout: 'gallery',
    title: 'Full bathroom fit-out',
    description:
      'Multiple views from one project: tub and shower zones, vanity wall, and coordinated fixtures and tile.',
    a11yPhotoLabels: 'tub and shower area, shower and tile detail, vanity and toilet wall',
    images: [
      {
        src: '/images/before-after-2-before.svg',
        alt: 'Bathroom showing tub and shower wall with tile and fixtures',
      },
      {
        src: '/images/before-after-2-after.svg',
        alt: 'Updated shower area with glass enclosure, tile, and modern fixtures',
      },
      {
        src: '/images/before-after-3-before.svg',
        alt: 'Vanity wall with toilet and sink area during renovation',
      },
    ],
  },
  {
    layout: 'gallery',
    title: 'Commercial and large-scale projects',
    description:
      'Coordinated installs across homes and businesses—same attention to detail on bigger jobs and tighter schedules.',
    a11yPhotoLabels: 'finished bath renovation, MS & P branding',
    images: [
      {
        src: '/images/before-after-3-after.svg',
        alt: 'Completed bathroom renovation with walk-in shower and premium finishes',
      },
      {
        src: '/images/plumber-hero.svg',
        alt: 'MS & P LLC professional plumber illustration',
      },
    ],
  },
]

function SlideHero({ project, slideIndex }: { project: ProjectSlide; slideIndex: number }) {
  if (project.layout === 'gallery') {
    const galleryCols =
      project.images.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
    return (
      <div className="bg-gray-100 p-2 md:p-3">
        <div
          className={`grid grid-cols-1 gap-2 ${galleryCols} md:gap-3`}
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
      ? `Slide ${currentIndex + 1} of ${projects.length}: ${current.title}. ${current.images.length} photos shown together: ${current.a11yPhotoLabels}.`
      : `Slide ${currentIndex + 1} of ${projects.length}: ${current.title}`

  return (
    <section className="py-20 bg-muted/25 border-y border-border/50" aria-labelledby="quality-work-heading">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2
            id="quality-work-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance"
          >
            Quality Work, <span className="text-brand">Guaranteed Results</span>
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
                      index === currentIndex ? 'w-8 bg-brand' : 'w-4 bg-border'
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
