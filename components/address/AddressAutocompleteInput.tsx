'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { loadGoogleMapsPlacesScript } from '@/lib/google-maps-script'

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
  const [hasServiceError, setHasServiceError] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    let active = true

    void loadGoogleMapsPlacesScript()
      .then(() => {
        if (!active || !window.google?.maps?.places || !inputRef.current) return
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address'],
          componentRestrictions: { country: 'us' },
          bounds: BIAS_BOUNDS,
          strictBounds: false,
          types: ['address'],
        })

        const placeListener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace() as { formatted_address?: string } | undefined
          const selected = place?.formatted_address?.trim() || inputRef.current?.value.trim() || ''
          if (!selected) return
          onChange(selected)
          onAddressSelect?.(selected)
        })

        const nativeInputHandler = () => {
          if (!inputRef.current) return
          onChange(inputRef.current.value)
        }
        inputRef.current.addEventListener('input', nativeInputHandler)

        return () => {
          placeListener.remove()
          inputRef.current?.removeEventListener('input', nativeInputHandler)
        }
      })
      .catch(() => {
        if (active) setHasServiceError(true)
      })

    return () => {
      active = false
    }
  }, [onAddressSelect, onChange])

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        value={safeValue}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={className}
        autoComplete="street-address"
      />
      {hasServiceError ? (
        <p className="mt-1 text-xs text-muted-foreground">
          Address suggestions unavailable. You can still enter your address manually.
        </p>
      ) : null}
    </div>
  )
}
