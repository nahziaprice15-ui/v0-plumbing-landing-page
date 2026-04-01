import type { MetadataRoute } from 'next'
import { articles } from '@/data/articles'
import { getAllServiceSlugs } from '@/data/services'
import { SITE_WIDE_LAST_UPDATED_ISO } from '@/lib/freshness'
import { getSiteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteWide = new Date(SITE_WIDE_LAST_UPDATED_ISO)
  const siteUrl = getSiteUrl()

  const serviceEntries: MetadataRoute.Sitemap = getAllServiceSlugs().map((slug) => ({
    url: `${siteUrl}/services/${slug}`,
    lastModified: siteWide,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/articles/${a.slug}`,
    lastModified: new Date(a.dateModified),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  return [
    {
      url: `${siteUrl}/`,
      lastModified: siteWide,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: siteWide,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...serviceEntries,
    {
      url: `${siteUrl}/articles`,
      lastModified: siteWide,
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    {
      url: `${siteUrl}/site-map`,
      lastModified: siteWide,
      changeFrequency: 'monthly',
      priority: 0.55,
    },
    ...articleEntries,
    {
      url: `${siteUrl}/privacy`,
      lastModified: siteWide,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: siteWide,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}

