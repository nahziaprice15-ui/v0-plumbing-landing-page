import { getSiteUrl, SITE } from '@/lib/site'

export function buildLocalBusinessJsonLd() {
  const url = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.businessName,
    description:
      'Fast, reliable plumbing services in New Orleans. 24/7 emergency repairs, drain cleaning, water heater installation.',
    url,
    telephone: SITE.phoneTel,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.city,
      addressRegion: SITE.state,
      addressCountry: SITE.country,
    },
    priceRange: '$',
    areaServed: `${SITE.city}, ${SITE.state} and surrounding areas`,
    image: `${url}/images/plumber-hero.svg`,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
  } as const
}

export function buildPlumbingServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Plumbing',
    provider: {
      '@type': 'LocalBusiness',
      name: SITE.businessName,
      telephone: SITE.phoneTel,
    },
    areaServed: {
      '@type': 'City',
      name: SITE.city,
      containedInPlace: {
        '@type': 'State',
        name: SITE.state,
      },
    },
  } as const
}

export function buildServicePageJsonLd(opts: {
  name: string
  description: string
  urlPath: string
}) {
  const base = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: `${base}${opts.urlPath}`,
    serviceType: opts.name,
    provider: {
      '@type': 'LocalBusiness',
      name: SITE.businessName,
      telephone: SITE.phoneTel,
      url: base,
    },
    areaServed: {
      '@type': 'City',
      name: SITE.city,
    },
  } as const
}

/** Merge multiple schema.org nodes into one script tag (recommended for multiple entities). */
export function combineJsonLd(entities: readonly object[]) {
  const graph = entities.map((entity) => {
    const node = { ...(entity as Record<string, unknown>) }
    delete node['@context']
    return node
  })
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  } as Record<string, unknown>
}
