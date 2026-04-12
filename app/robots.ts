import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin',
        '/admin-login',
        '/sentry-example-page',
        '/issues',
        '/monitoring',
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

