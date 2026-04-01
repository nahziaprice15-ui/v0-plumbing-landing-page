import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteChrome } from '@/components/SiteChrome'
import { StructuredData } from '@/components/StructuredData'
import { getAllArticleSlugs, getArticleBySlug } from '@/data/articles'
import { formatDisplayDate } from '@/lib/freshness'
import { combineJsonLd, buildArticleJsonLd, buildBreadcrumbListJsonLd } from '@/lib/schema'
import { getSiteUrl } from '@/lib/site'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = getArticleBySlug(slug)
  if (!a) return {}
  const siteUrl = getSiteUrl()
  return {
    title: `${a.title} | MS & P LLC`,
    description: a.description,
    alternates: {
      canonical: `/articles/${slug}`,
    },
    openGraph: {
      title: a.title,
      description: a.description,
      url: `${siteUrl}/articles/${slug}`,
      type: 'article',
      publishedTime: a.datePublished,
      modifiedTime: a.dateModified,
    },
    twitter: {
      title: a.title,
      description: a.description,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const a = getArticleBySlug(slug)
  if (!a) notFound()

  const path = `/articles/${slug}`
  const structuredData = combineJsonLd([
    buildBreadcrumbListJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Articles', path: '/articles' },
      { name: a.title, path },
    ]),
    buildArticleJsonLd({
      headline: a.title,
      description: a.description,
      urlPath: path,
      datePublished: a.datePublished,
      dateModified: a.dateModified,
    }),
  ])

  return (
    <>
      <StructuredData data={structuredData} />
      <SiteChrome>
        <article className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
          <nav className="text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/articles" className="hover:text-foreground">
              Articles
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground line-clamp-1">{a.title}</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">{a.title}</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Published {formatDisplayDate(a.datePublished)} · Last updated {formatDisplayDate(a.dateModified)}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">{a.intro}</p>
          </header>

          {a.sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2 className="text-2xl font-semibold text-foreground mb-4">{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      </SiteChrome>
    </>
  )
}
