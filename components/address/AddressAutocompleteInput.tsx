'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { loadGoogleMapsPlacesScript } from '@/lib/google-maps-script'

type Prediction = {
  description: string
  place_id: string
  structured_formatting?: {
    main_text?: string
    secondary_text?: string
  }
}

type AddressAutocompleteInputProps = {
  id: string
  value?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  onChange: (value: string) => void
  onBlur?: () => void
  onAddressSelect?: (value: string) => void
}

const BIAS_BOUNDS = {
  south: 29.75,
  west: -90.25,
  north: 30.15,
  east: -89.85,
}

export function AddressAutocompleteInput({
  id,
  value,
  placeholder,
  className,
  disabled,
  onChange,
  onBlur,
  onAddressSelect,
}: AddressAutocompleteInputProps) {
  const safeValue = value ?? ''
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [serviceReady, setServiceReady] = useState(false)
  const [hasServiceError, setHasServiceError] = useState(false)
  const serviceRef = useRef<{
    getPlacePredictions: (
      request: {
        input: string
        componentRestrictions?: { country: string | string[] }
        locationBias?: { south: number; west: number; north: number; east: number }
        types?: string[]
      },
      callback: (predictions: Prediction[] | null, status: string) => void,
    ) => void
  } | null>(null)
  const placesServiceRef = useRef<{
    getDetails: (
      request: { placeId: string; fields: string[] },
      callback: (place: { formatted_address?: string } | null, status: string) => void,
    ) => void
  } | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<number | null>(null)

  const listboxId = useMemo(() => `${id}-suggestions`, [id])

  useEffect(() => {
    let active = true

    void loadGoogleMapsPlacesScript()
      .then(() => {
        if (!active || !window.google?.maps?.places) return
        serviceRef.current = new window.google.maps.places.AutocompleteService()
        placesServiceRef.current = new window.google.maps.places.PlacesService(document.createElement('div'))
        setServiceReady(true)
      })
      .catch(() => {
        if (active) setHasServiceError(true)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const onClickAway = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickAway)
    return () => document.removeEventListener('mousedown', onClickAway)
  }, [])

  useEffect(() => {
    if (!serviceReady || hasServiceError || disabled) return

    if (!safeValue.trim() || safeValue.trim().length < 3) {
      setPredictions([])
      setIsOpen(false)
      setActiveIndex(-1)
      return
    }

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }

    debounceRef.current = window.setTimeout(() => {
      serviceRef.current?.getPlacePredictions(
        {
          input: safeValue,
          componentRestrictions: { country: 'us' },
          locationBias: BIAS_BOUNDS,
          types: ['address'],
        },
        (results, status) => {
          const ok = status === window.google?.maps?.places?.PlacesServiceStatus.OK
          const next = ok && results ? results.slice(0, 6) : []
          setPredictions(next)
          setIsOpen(next.length > 0)
          setActiveIndex(-1)
        },
      )
    }, 220)

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [safeValue, serviceReady, hasServiceError, disabled])

  const pickPrediction = (prediction: Prediction) => {
    const placeId = prediction.place_id
    if (!placeId || !placesServiceRef.current || !window.google?.maps?.places) {
      onChange(prediction.description)
      onAddressSelect?.(prediction.description)
      setIsOpen(false)
      setPredictions([])
      setActiveIndex(-1)
      return
    }

    placesServiceRef.current.getDetails(
      { placeId, fields: ['formatted_address'] },
      (place, status) => {
        const ok = status === window.google?.maps?.places?.PlacesServiceStatus.OK
        const selected = ok && place?.formatted_address ? place.formatted_address : prediction.description
        onChange(selected)
        onAddressSelect?.(selected)
      },
    )
    setIsOpen(false)
    setPredictions([])
    setActiveIndex(-1)
  }

  return (
    <div ref={rootRef} className="relative">
      <Input
        id={id}
        value={safeValue}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={() => {
          if (predictions.length > 0) setIsOpen(true)
        }}
        onKeyDown={(e) => {
          if (!isOpen || predictions.length === 0) return
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((prev) => (prev + 1) % predictions.length)
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((prev) => (prev <= 0 ? predictions.length - 1 : prev - 1))
          } else if (e.key === 'Enter' && activeIndex >= 0 && predictions[activeIndex]) {
            e.preventDefault()
            pickPrediction(predictions[activeIndex])
          } else if (e.key === 'Escape') {
            setIsOpen(false)
          }
        }}
        disabled={disabled}
        className={className}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        autoComplete="street-address"
      />

      {isOpen && predictions.length > 0 ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-popover shadow-lg"
        >
          {predictions.map((prediction, idx) => (
            <li key={prediction.place_id}>
              <button
                type="button"
                role="option"
                aria-selected={idx === activeIndex}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-accent ${
                  idx === activeIndex ? 'bg-accent' : ''
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickPrediction(prediction)}
              >
                <span className="font-medium">{prediction.structured_formatting?.main_text ?? prediction.description}</span>
                {prediction.structured_formatting?.secondary_text ? (
                  <span className="block text-xs text-muted-foreground">
                    {prediction.structured_formatting.secondary_text}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {hasServiceError ? (
        <p className="mt-1 text-xs text-muted-foreground">
          Address suggestions unavailable. You can still enter your address manually.
        </p>
      ) : null}
    </div>
  )
}
