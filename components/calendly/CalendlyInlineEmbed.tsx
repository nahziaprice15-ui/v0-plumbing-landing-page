'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { buildCalendlyUrl, type CalendlyPrefill } from '@/lib/calendly'
import { loadCalendlyScript } from '@/lib/calendly-script'

type CalendlyInlineEmbedProps = {
  eventUrl: string
  primaryColor?: string
  textColor?: string
  backgroundColor?: string
  hideGdprBanner?: boolean
  prefill?: CalendlyPrefill
  minHeightClassName?: string
}

export function CalendlyInlineEmbed({
  eventUrl,
  primaryColor,
  textColor,
  backgroundColor,
  hideGdprBanner,
  prefill,
  minHeightClassName = 'min-h-[760px]',
}: CalendlyInlineEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const calendlyUrl = useMemo(
    () =>
      buildCalendlyUrl({
        eventUrl,
        primaryColor,
        textColor,
        backgroundColor,
        hideGdprBanner,
      }),
    [eventUrl, primaryColor, textColor, backgroundColor, hideGdprBanner],
  )

  useEffect(() => {
    let isCancelled = false

    const init = async () => {
      const host = containerRef.current
      if (!host) return

      setHasError(false)
      setIsLoading(true)
      host.innerHTML = ''

      try {
        await loadCalendlyScript()
        if (isCancelled || !window.Calendly) return
        window.Calendly.initInlineWidget({
          url: calendlyUrl,
          parentElement: host,
          prefill,
        })
      } catch {
        if (!isCancelled) setHasError(true)
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    void init()

    return () => {
      isCancelled = true
    }
  }, [calendlyUrl, prefill])

  return (
    <section className="space-y-3" aria-label="Book a service with Calendly">
      <div
        ref={containerRef}
        className={`w-full overflow-hidden rounded-2xl border border-border bg-card ${minHeightClassName}`}
      />
      {isLoading ? <p className="text-sm text-muted-foreground">Loading booking calendar…</p> : null}
      {hasError ? (
        <p className="text-sm text-destructive">
          We couldn&apos;t load the booking calendar right now. Please call us to schedule service.
        </p>
      ) : null}
    </section>
  )
}
