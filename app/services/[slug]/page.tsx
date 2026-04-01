import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteChrome } from '@/components/SiteChrome'
import { ServiceDetailExpandable } from '@/components/ServiceDetailExpandable'
import { ServicePageCtas } from '@/components/ServicePageCtas'
import { StructuredData } from '@/components/StructuredData'
import { getAllServiceSlugs, getServiceBySlug } from '@/data/services'
import { buildFaqPageJsonLd } from '@/data/faqs'
import {
  combineJsonLd,
  buildBreadcrumbListJsonLd,
  buildServicePageJsonLd,
} from '@/lib/schema'
import { getSiteUrl } from '@/lib/site'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const s = getServiceBySlug(slug)
  if (!s) return {}
  const siteUrl = getSiteUrl()
  return {
    title: s.title,
    description: s.description,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: s.title,
      description: s.description,
      url: `${siteUrl}/services/${slug}`,
      type: 'article',
    },
    twitter: {
      title: s.title,
      description: s.description,
    },
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const s = getServiceBySlug(slug)
  if (!s) notFound()

  const path = `/services/${slug}`
  const structuredData = combineJsonLd([
    buildBreadcrumbListJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: s.h1, path },
    ]),
    buildServicePageJsonLd({
      name: s.h1,
      description: s.description,
      urlPath: path,
    }),
    buildFaqPageJsonLd(s.faqs),
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
            <Link href="/services" className="hover:text-foreground">
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{s.h1}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">{s.h1}</h1>

          <div className="mb-10">
            <ServicePageCtas />
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10">{s.intro}</p>

          <ServiceDetailExpandable sections={s.sections} faqs={s.faqs} />

          <ServicePageCtas />
        </article>
      </SiteChrome>
    </>
  )
}
