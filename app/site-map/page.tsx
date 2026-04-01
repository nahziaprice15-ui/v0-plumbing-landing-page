import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteChrome } from '@/components/SiteChrome'
import { articles } from '@/data/articles'
import { services } from '@/data/services'
import { formatDisplayDate, SITE_WIDE_LAST_UPDATED_ISO } from '@/lib/freshness'
import { getSiteUrl } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Site map | MS & P LLC Plumbing',
  description:
    'Every public page we list for search engines, plus the XML sitemap for crawlers. MS & P LLC — New Orleans plumbing.',
  alternates: {
    canonical: '/site-map',
  },
  openGraph: {
    title: 'Site map | MS & P LLC',
    description: 'Browse all indexable pages and access the XML sitemap.',
    url: `${siteUrl}/site-map`,
    type: 'website',
  },
}

export default function SiteMapPage() {
  return (
    <SiteChrome>
      <article className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Site map</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Site map</h1>
        <p className="text-muted-foreground mb-2 max-w-2xl">
          These URLs match what we expose in our XML sitemap for search engines. Last reviewed against the sitemap on{' '}
          {formatDisplayDate(SITE_WIDE_LAST_UPDATED_ISO)}.
        </p>
        <p className="text-sm text-muted-foreground mb-10">
          <span className="font-medium text-foreground">For crawlers: </span>
          <a href="/sitemap.xml" className="text-primary underline underline-offset-4 hover:no-underline">
            sitemap.xml
          </a>{' '}
          (machine-readable). Declared in{' '}
          <a href="/robots.txt" className="text-primary underline underline-offset-4 hover:no-underline">
            robots.txt
          </a>
          .
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Main pages</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/" className="text-primary hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-primary hover:underline">
                All services
              </Link>
            </li>
            <li>
              <Link href="/articles" className="text-primary hover:underline">
                Articles
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Service pages</h2>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-primary hover:underline">
                  {s.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Articles</h2>
          <ul className="space-y-2">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link href={`/articles/${a.slug}`} className="text-primary hover:underline">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Legal</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-primary hover:underline">
                Terms of service
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </SiteChrome>
  )
}
