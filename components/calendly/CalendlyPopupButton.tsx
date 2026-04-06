'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { buildCalendlyUrl, type CalendlyPrefill } from '@/lib/calendly'
import { openCalendlyPopup } from '@/lib/calendly-script'

type CalendlyPopupButtonProps = {
  eventUrl: string
  label: string
  primaryColor?: string
  textColor?: string
  backgroundColor?: string
  hideGdprBanner?: boolean
  prefill?: CalendlyPrefill
  onFallback?: () => void
}

export function CalendlyPopupButton({
  eventUrl,
  label,
  primaryColor,
  textColor,
  backgroundColor,
  hideGdprBanner,
  prefill,
  onFallback,
}: CalendlyPopupButtonProps) {
  const [isOpening, setIsOpening] = useState(false)

  const onClick = async () => {
    setIsOpening(true)
    const calendlyUrl = buildCalendlyUrl({
      eventUrl,
      primaryColor,
      textColor,
      backgroundColor,
      hideGdprBanner,
    })
    const opened = await openCalendlyPopup(calendlyUrl, prefill)
    setIsOpening(false)
    if (!opened) onFallback?.()
  }

  return (
    <Button type="button" onClick={() => void onClick()} disabled={isOpening}>
      {isOpening ? 'Opening…' : label}
    </Button>
  )
}
