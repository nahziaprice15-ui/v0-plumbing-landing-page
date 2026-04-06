import type { CalendlyPrefill } from '@/lib/calendly'

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string
        parentElement: HTMLElement
        prefill?: CalendlyPrefill
      }) => void
      initPopupWidget: (opts: { url: string; prefill?: CalendlyPrefill }) => void
      closePopupWidget: () => void
    }
  }
}

let calendlyScriptPromise: Promise<void> | null = null
let calendlyStylesPromise: Promise<void> | null = null

function loadCalendlyStyles(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Calendly styles can only be loaded in the browser'))
  }

  if (calendlyStylesPromise) return calendlyStylesPromise

  calendlyStylesPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLLinkElement>('link[data-calendly-widget-css="true"]')
    if (existing) {
      resolve()
      return
    }

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://assets.calendly.com/assets/external/widget.css'
    link.dataset.calendlyWidgetCss = 'true'
    link.onload = () => resolve()
    link.onerror = () => reject(new Error('Failed to load Calendly widget styles'))
    document.head.appendChild(link)
  })

  return calendlyStylesPromise
}

export function loadCalendlyScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Calendly can only be loaded in the browser'))
  }

  if (window.Calendly) return loadCalendlyStyles()
  if (calendlyScriptPromise) return calendlyScriptPromise

  calendlyScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-calendly-widget="true"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Calendly widget')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    script.defer = true
    script.dataset.calendlyWidget = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Calendly widget'))
    document.head.appendChild(script)
  })

  return Promise.all([calendlyScriptPromise, loadCalendlyStyles()]).then(() => undefined)
}

export async function openCalendlyPopup(url: string, prefill?: CalendlyPrefill): Promise<boolean> {
  if (typeof window === 'undefined') return false

  try {
    await loadCalendlyScript()
    if (!window.Calendly) return false
    window.Calendly.initPopupWidget({ url, prefill })
    return true
  } catch {
    return false
  }
}
