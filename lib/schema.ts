import { getSiteUrl, SITE } from '@/lib/site'

/** Approximate centroid for service area / map pin (New Orleans). */
const NOLA_GEO = {
  '@type': 'GeoCoordinates' as const,
  latitude: 29.9511,
  longitude: -90.0715,
}

export function buildLocalBusinessJsonLd() {
  const url = getSiteUrl()
  const mapsQuery = encodeURIComponent(`${SITE.businessName} ${SITE.city} ${SITE.state}`)
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Plumber'],
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
    geo: NOLA_GEO,
    hasMap: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Orleans Parish, Louisiana' },
      { '@type': 'AdministrativeArea', name: 'Jefferson Parish, Louisiana' },
      { '@type': 'AdministrativeArea', name: 'St. Tammany Parish, Louisiana' },
      { '@type': 'AdministrativeArea', name: 'St. Bernard Parish, Louisiana' },
      { '@type': 'AdministrativeArea', name: 'St. Charles Parish, Louisiana' },
      { '@type': 'AdministrativeArea', name: 'Plaquemines Parish, Louisiana' },
      { '@type': 'AdministrativeArea', name: 'St. John the Baptist Parish, Louisiana' },
      { '@type': 'AdministrativeArea', name: 'Tangipahoa Parish, Louisiana' },
    ],
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

export function buildBreadcrumbListJsonLd(items: readonly { name: string; path: string }[]) {
  const base = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${base}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  } as const
}

export function buildArticleJsonLd(opts: {
  headline: string
  description: string
  urlPath: string
  datePublished: string
  dateModified: string
  imagePath?: string
}) {
  const base = getSiteUrl()
  const pageUrl = `${base}${opts.urlPath}`
  const imageUrl = opts.imagePath ? `${base}${opts.imagePath}` : `${base}/images/plumber-hero.svg`
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    url: pageUrl,
    image: [imageUrl],
    author: {
      '@type': 'Organization',
      name: SITE.businessName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.businessName,
      logo: {
        '@type': 'ImageObject',
        url: `${base}/icon.svg`,
      },
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
