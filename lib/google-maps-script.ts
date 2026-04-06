type GoogleMapsNamespace = {
  maps: {
    places: {
      AutocompleteService: new () => {
        getPlacePredictions: (
          request: {
            input: string
            componentRestrictions?: { country: string | string[] }
            locationBias?:
              | { center: { lat: number; lng: number }; radius: number }
              | { south: number; west: number; north: number; east: number }
            types?: string[]
          },
          callback: (
            predictions: Array<{
              description: string
              place_id: string
              structured_formatting?: {
                main_text?: string
                secondary_text?: string
              }
            }> | null,
            status: string,
          ) => void,
        ) => void
      }
      PlacesService: new (div: HTMLDivElement) => {
        getDetails: (
          request: { placeId: string; fields: string[] },
          callback: (place: { formatted_address?: string } | null, status: string) => void,
        ) => void
      }
      PlacesServiceStatus: {
        OK: string
      }
    }
  }
}

declare global {
  interface Window {
    google?: GoogleMapsNamespace
  }
}

let mapsScriptPromise: Promise<void> | null = null

export function loadGoogleMapsPlacesScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps script can only be loaded in the browser'))
  }

  if (window.google?.maps?.places) return Promise.resolve()
  if (mapsScriptPromise) return mapsScriptPromise

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()
  if (!apiKey) {
    return Promise.reject(new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set'))
  }

  mapsScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps-places="true"]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps script')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}` +
      '&libraries=places&loading=async'
    script.async = true
    script.defer = true
    script.dataset.googleMapsPlaces = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps script'))
    document.head.appendChild(script)
  })

  return mapsScriptPromise
}
