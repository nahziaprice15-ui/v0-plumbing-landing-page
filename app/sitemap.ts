import type { MetadataRoute } from 'next'
import { getAllServiceSlugs } from '@/data/services'
import { getSiteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const siteUrl = getSiteUrl()

  const serviceEntries: MetadataRoute.Sitemap = getAllServiceSlugs().map((slug) => ({
    url: `${siteUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...serviceEntries,
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}

