import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteChrome } from '@/components/SiteChrome'
import { articles } from '@/data/articles'
import { formatDisplayDate } from '@/lib/freshness'
import { getSiteUrl } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Plumbing tips & articles | New Orleans | MS & P LLC',
  description:
    'Practical plumbing guidance for New Orleans homeowners—emergencies, water heaters, drains, and more from MS & P LLC.',
  alternates: {
    canonical: '/articles',
  },
  openGraph: {
    title: 'Plumbing tips & articles | MS & P LLC',
    description:
      'Practical plumbing guidance for New Orleans homeowners—emergencies, water heaters, drains, and more.',
    url: `${siteUrl}/articles`,
    type: 'website',
  },
  twitter: {
    title: 'Plumbing tips & articles | MS & P LLC',
    description:
      'Practical plumbing guidance for New Orleans homeowners—emergencies, water heaters, drains, and more.',
  },
}

export default function ArticlesIndexPage() {
  return (
    <SiteChrome>
      <article className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Articles</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Articles</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
          Short answers to common questions and practical tips for homes in New Orleans. Updated dates reflect the last
          time we revised each piece.
        </p>

        <ul className="space-y-8">
          {articles.map((a) => (
            <li key={a.slug} className="border-b border-border pb-8 last:border-0">
              <Link href={`/articles/${a.slug}`} className="group block">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {a.title}
                </h2>
                <p className="text-muted-foreground mb-3">{a.description}</p>
                <p className="text-sm text-muted-foreground">
                  Last updated {formatDisplayDate(a.dateModified)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </SiteChrome>
  )
}
