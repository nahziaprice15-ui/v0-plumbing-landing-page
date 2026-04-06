'use client'

import { CalendlyInlineEmbed } from '@/components/calendly/CalendlyInlineEmbed'
import { Button } from '@/components/ui/button'
import { getCalendlyConfig } from '@/lib/calendly'
import { SITE } from '@/lib/site'

export default function BookingPage() {
  const calendlyConfig = getCalendlyConfig()

  if (!calendlyConfig) {
    return (
      <main className="min-h-screen container mx-auto px-4 py-16 max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold">Book a service</h1>
        <p className="text-muted-foreground">
          Online booking is temporarily unavailable. Please call us and we&apos;ll schedule your service
          right away.
        </p>
        <Button asChild>
          <a href={`tel:${SITE.phoneTel}`}>Call {SITE.phoneDisplay}</a>
        </Button>
      </main>
    )
  }

  return (
    <main className="min-h-screen container mx-auto px-4 py-16 max-w-5xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Book a service</h1>
        <p className="text-muted-foreground">
          Choose a time that works for you. Service details and intake questions are included in the
          scheduler.
        </p>
      </header>

      <CalendlyInlineEmbed
        eventUrl={calendlyConfig.eventUrl}
        primaryColor={calendlyConfig.primaryColor}
        textColor={calendlyConfig.textColor}
        backgroundColor={calendlyConfig.backgroundColor}
        hideGdprBanner={calendlyConfig.hideGdprBanner}
      />

      <p className="text-sm text-muted-foreground">
        If the scheduler doesn&apos;t load, call{' '}
        <a href={`tel:${SITE.phoneTel}`} className="font-medium text-brand hover:underline">
          {SITE.phoneDisplay}
        </a>
        .
      </p>
    </main>
  )
}
