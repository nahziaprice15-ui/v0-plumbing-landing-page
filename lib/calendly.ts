export type CalendlyPrefill = {
  name?: string
  email?: string
  customAnswers?: {
    a1?: string
    a2?: string
    a3?: string
    a4?: string
    a5?: string
    a6?: string
    a7?: string
    a8?: string
    a9?: string
    a10?: string
  }
}

export type CalendlyConfig = {
  eventUrl: string
  primaryColor?: string
  textColor?: string
  backgroundColor?: string
  hideGdprBanner?: boolean
  usePopupFlow: boolean
}

function sanitizeHex(value: string | undefined): string | undefined {
  const normalized = value?.trim().replace(/^#/, '').toLowerCase()
  if (!normalized) return undefined
  return /^[0-9a-f]{6}$/.test(normalized) ? normalized : undefined
}

export function getCalendlyConfig(): CalendlyConfig | null {
  const eventUrl = process.env.NEXT_PUBLIC_CALENDLY_EVENT_URL?.trim()
  if (!eventUrl) return null

  return {
    eventUrl,
    primaryColor: sanitizeHex(process.env.NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR),
    textColor: sanitizeHex(process.env.NEXT_PUBLIC_CALENDLY_TEXT_COLOR),
    backgroundColor: sanitizeHex(process.env.NEXT_PUBLIC_CALENDLY_BACKGROUND_COLOR),
    hideGdprBanner: process.env.NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER === '1',
    usePopupFlow: process.env.NEXT_PUBLIC_CALENDLY_USE_POPUP_FLOW === '1',
  }
}

export function buildCalendlyUrl(
  config: Pick<
    CalendlyConfig,
    'eventUrl' | 'primaryColor' | 'textColor' | 'backgroundColor' | 'hideGdprBanner'
  >,
): string {
  const url = new URL(config.eventUrl)

  if (config.primaryColor) url.searchParams.set('primary_color', config.primaryColor)
  if (config.textColor) url.searchParams.set('text_color', config.textColor)
  if (config.backgroundColor) url.searchParams.set('background_color', config.backgroundColor)
  if (typeof config.hideGdprBanner === 'boolean') {
    url.searchParams.set('hide_gdpr_banner', config.hideGdprBanner ? '1' : '0')
  }

  return url.toString()
}
