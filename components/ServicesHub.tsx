'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Home,
  Building2,
  Zap,
  Droplets,
  Thermometer,
  Wrench,
  Shield,
  Wind,
  Flame,
  Gauge,
  Users,
  Utensils,
  Network,
  CircleAlert,
  Phone,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  type OfferingIconKey,
  type SegmentId,
  type SegmentOffering,
  type ServiceSegment,
  isSegmentId,
  serviceSegments,
} from '@/data/serviceSegments'
import { useOpenBooking, type OpenBookingOptions } from '@/components/BookingOpenContext'
import { offeringToBookingType, segmentIdToBookingType } from '@/lib/bookingServiceType'
import { SITE } from '@/lib/site'
import { cn } from '@/lib/utils'

const offeringIcons: Record<OfferingIconKey, LucideIcon> = {
  home: Home,
  building2: Building2,
  zap: Zap,
  droplets: Droplets,
  thermometer: Thermometer,
  wrench: Wrench,
  shield: Shield,
  wind: Wind,
  flame: Flame,
  gauge: Gauge,
  users: Users,
  utensils: Utensils,
  network: Network,
  alertCircle: CircleAlert,
}

function SegmentPanel({ segment }: { segment: ServiceSegment }) {
  const openBooking = useOpenBooking()

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <p className="text-muted-foreground leading-relaxed max-w-2xl">{segment.intro}</p>

      <div className="grid sm:grid-cols-2 gap-5">
        {segment.offerings.map((offering) => (
          <OfferingCard key={offering.title} offering={offering} onBook={openBooking} />
        ))}
      </div>
    </div>
  )
}

function OfferingCard({
  offering,
  onBook,
}: {
  offering: SegmentOffering
  onBook: (opts?: OpenBookingOptions) => void
}) {
  const Icon = offeringIcons[offering.iconKey]

  return (
    <div className="group flex flex-col rounded-xl border-2 border-brand/20 bg-card p-5 shadow-sm transition-all duration-300 hover:border-brand hover:shadow-lg hover:shadow-brand/10">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-foreground leading-snug">{offering.title}</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-1">{offering.summary}</p>
      {offering.bullets && offering.bullets.length > 0 ? (
        <ul className="flex flex-wrap gap-2 mb-4">
          {offering.bullets.map((b) => (
            <li
              key={b}
              className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {b}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mb-4" />
      )}
      <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          className="bg-secondary text-secondary-foreground font-semibold w-full sm:w-auto"
          asChild
        >
          <a
            href={`tel:${SITE.phoneTel}`}
            className="gap-2"
            aria-label={`Call ${SITE.phoneDisplay} about ${offering.title}`}
          >
            <Phone className="h-4 w-4 shrink-0" />
            Call now
          </a>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => onBook({ serviceType: offeringToBookingType(offering) })}
        >
          Book online
        </Button>
        {offering.detailSlug ? (
          <Button variant="ghost" className="w-full sm:w-auto text-muted-foreground" asChild>
            <Link href={`/services/${offering.detailSlug}`}>Learn more</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function HubHero({ onBook }: { onBook: (opts?: OpenBookingOptions) => void }) {
  return (
    <div className="mb-10 md:mb-12 text-center max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
        Plumbing services for every property
      </h1>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-pretty">
        Residential homes, commercial buildings, or a true emergency—pick your category, see what we
        do, and call or book in one tap.
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
        <Button className="bg-secondary text-secondary-foreground font-semibold text-base px-8" asChild>
          <a href={`tel:${SITE.phoneTel}`} className="gap-2">
            <Phone className="h-5 w-5" />
            Call {SITE.phoneDisplay}
          </a>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="font-semibold text-base px-8 border-brand text-brand hover:bg-brand/10"
          onClick={() => onBook()}
        >
          Book online
        </Button>
      </div>
    </div>
  )
}

function ServicesMobileDock({ onBook }: { onBook: (opts?: OpenBookingOptions) => void }) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden',
      )}
    >
      <Button className="flex-1 bg-secondary text-secondary-foreground font-semibold" asChild>
        <a href={`tel:${SITE.phoneTel}`} className="gap-2">
          <Phone className="h-4 w-4" />
          Call
        </a>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex-1 font-semibold border-brand text-brand"
        onClick={() => onBook()}
      >
        Book
      </Button>
    </div>
  )
}

export function ServicesHub() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const openBooking = useOpenBooking()

  const tabFromUrl = searchParams.get('tab')
  const initialTab = useMemo((): SegmentId => {
    if (isSegmentId(tabFromUrl)) return tabFromUrl
    return 'residential'
  }, [tabFromUrl])

  const [tab, setTab] = useState<SegmentId>(initialTab)

  useEffect(() => {
    setTab(initialTab)
  }, [initialTab])

  const setTabAndUrl = useCallback(
    (value: string) => {
      if (!isSegmentId(value)) return
      setTab(value)
      const params = new URLSearchParams(searchParams.toString())
      params.set('tab', value)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  return (
    <>
      <article className="container mx-auto px-4 pt-24 pb-24 md:pb-20 max-w-5xl">
        <HubHero onBook={openBooking} />

        <Tabs value={tab} onValueChange={setTabAndUrl} className="w-full gap-8">
          <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-xl bg-muted p-1 sm:w-full sm:max-w-xl sm:mx-auto">
            {serviceSegments.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="rounded-lg py-2.5 text-xs sm:text-sm font-semibold data-[state=active]:shadow-md"
              >
                {s.tabLabel}
              </TabsTrigger>
            ))}
          </TabsList>

          {serviceSegments.map((segment) => (
            <TabsContent key={segment.id} value={segment.id} className="mt-8">
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
                  {segment.headline}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0">{segment.subhead}</p>
                <div className="mt-5 hidden md:flex flex-wrap gap-3">
                  <Button className="bg-secondary text-secondary-foreground font-semibold" asChild>
                    <a href={`tel:${SITE.phoneTel}`} className="gap-2">
                      <Phone className="h-4 w-4" />
                      Call {SITE.phoneDisplay}
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const st = segmentIdToBookingType(segment.id)
                      openBooking(st ? { serviceType: st } : undefined)
                    }}
                  >
                    Book this category
                  </Button>
                </div>
              </div>
              <SegmentPanel segment={segment} />
            </TabsContent>
          ))}
        </Tabs>

        <p className="mt-14 text-center text-muted-foreground">
          <Link href="/" className="text-secondary font-medium hover:underline">
            Back to home
          </Link>
        </p>
      </article>

      <ServicesMobileDock onBook={openBooking} />
    </>
  )
}

export function ServicesHubFallback() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-24 max-w-5xl animate-pulse">
      <div className="h-12 bg-muted rounded-lg max-w-md mx-auto mb-4" />
      <div className="h-6 bg-muted rounded max-w-2xl mx-auto mb-10" />
      <div className="h-11 bg-muted rounded-xl max-w-xl mx-auto mb-10" />
      <div className="grid sm:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}
