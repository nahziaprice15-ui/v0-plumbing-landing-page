'use client'

import Image from 'next/image'

type BrandLogoSize = 'nav' | 'footer'

const innerHeights: Record<BrandLogoSize, string> = {
  /** Tuned for a single-row nav bar (~64px total height). */
  nav: 'h-12 sm:h-14',
  footer: 'h-16',
}

const LOGO_SRC = '/images/ms-p-logo.svg'

export function BrandLogo({
  size = 'nav',
  className = '',
}: {
  size?: BrandLogoSize
  className?: string
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-sm ring-1 ring-black/10 sm:p-2 ${className}`}
    >
      <Image
        src={LOGO_SRC}
        alt="MS & P LLC - Making Plumbing Great Again"
        width={220}
        height={72}
        className={`w-auto ${innerHeights[size]}`}
        priority
        unoptimized
      />
    </span>
  )
}
