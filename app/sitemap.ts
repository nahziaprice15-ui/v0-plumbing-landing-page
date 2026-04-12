import type { MetadataRoute } from 'next'
import { articles } from '@/data/articles'
import { getAllServiceSlugs } from '@/data/services'
import { SITE_WIDE_LAST_UPDATED_ISO } from '@/lib/freshness'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mspllcs.com').replace(/\/$/, '')

  function absoluteUrl(path: string) {
    const normalized = path.startsWith('/') ? path : `/${path}`
    if (normalized === '/') return baseUrl
    return `${baseUrl}${normalized}`
  }

  const siteWide = new Date(SITE_WIDE_LAST_UPDATED_ISO)

  const serviceEntries: MetadataRoute.Sitemap = getAllServiceSlugs().map((slug) => ({
    url: absoluteUrl(`/services/${slug}`),
    lastModified: siteWide,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absoluteUrl(`/articles/${a.slug}`),
    lastModified: new Date(a.dateModified),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  return [
    {
      url: absoluteUrl('/'),
      lastModified: siteWide,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/services'),
      lastModified: siteWide,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...serviceEntries,
    {
      url: absoluteUrl('/book'),
      lastModified: siteWide,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
    {
      url: absoluteUrl('/articles'),
      lastModified: siteWide,
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    {
      url: absoluteUrl('/site-map'),
      lastModified: siteWide,
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    ...articleEntries,
    {
      url: absoluteUrl('/privacy'),
      lastModified: siteWide,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: absoluteUrl('/terms'),
      lastModified: siteWide,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
