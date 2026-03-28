import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Mail } from 'lucide-react'
import { SiteChrome } from '@/components/SiteChrome'
import { Button } from '@/components/ui/button'
import { getGithubIssuesUrl, getSiteUrl, SITE } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Report a website issue | MS & P LLC',
  description:
    'Report bugs or suggest improvements for this website. Issues are tracked on GitHub when configured.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: '/issues',
  },
  openGraph: {
    title: 'Report a website issue | MS & P LLC',
    description: 'Report bugs or suggest improvements for this website.',
    url: `${siteUrl}/issues`,
  },
}

export default function IssuesPage() {
  const githubIssuesUrl = getGithubIssuesUrl()

  return (
    <SiteChrome>
      <article className="container mx-auto px-4 pt-28 pb-20 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Report an issue</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
          Report a website issue
        </h1>

        {githubIssuesUrl ? (
          <>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Bugs and improvements for this site are tracked on GitHub. Open the issues list to file a
              new report or browse existing ones.
            </p>
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground font-semibold">
              <a href={githubIssuesUrl} target="_blank" rel="noopener noreferrer">
                Open GitHub Issues
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </>
        ) : (
          <>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              The GitHub issues link is not configured for this deployment. For website feedback or
              problems using this page, email us and we&apos;ll route it to the right place.
            </p>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <a href={`mailto:${SITE.email}?subject=${encodeURIComponent('Website feedback')}`}>
                <Mail className="h-4 w-4" aria-hidden />
                Email {SITE.email}
              </a>
            </Button>
          </>
        )}
      </article>
    </SiteChrome>
  )
}
