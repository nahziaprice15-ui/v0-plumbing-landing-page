'use client'

import { useState, useEffect } from 'react'

type BrandLogoSize = 'nav' | 'footer'

const innerHeights: Record<BrandLogoSize, string> = {
  /** Tuned for a single-row nav bar (~64px total height). */
  nav: 'h-12 sm:h-14',
  footer: 'h-16',
}

const PNG = '/images/ms-p-logo.png'
const SVG = '/images/ms-p-logo.svg'

export function BrandLogo({
  size = 'nav',
  className = '',
}: {
  size?: BrandLogoSize
  className?: string
}) {
  const [src, setSrc] = useState(SVG)

  useEffect(() => {
    const probe = new Image()
    probe.onload = () => setSrc(PNG)
    probe.src = PNG
  }, [])

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/10 sm:p-2 ${className}`}
    >
      <img
        src={src}
        alt="MS & P LLC - Making Plumbing Great Again"
        className={`w-auto ${innerHeights[size]}`}
        decoding="async"
      />
    </span>
  )
}
