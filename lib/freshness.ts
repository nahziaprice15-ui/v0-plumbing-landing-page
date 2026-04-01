/**
 * Freshness strategy
 * -----------------
 * - Sitewide: `SITE_WIDE_LAST_UPDATED_ISO` — bump when you change global copy, home FAQs,
 *   shared components, or service definitions that affect many pages. Shown in the footer and
 *   used as `lastModified` for non-article URLs in the sitemap.
 * - Articles: each entry in `data/articles.ts` has its own `datePublished` and `dateModified`.
 *   Article pages show the modified date in the UI and pass it to Article JSON-LD and the sitemap.
 */
export const SITE_WIDE_LAST_UPDATED_ISO = '2026-03-31T12:00:00.000Z'

export function formatDisplayDate(iso: string, locale: string = 'en-US') {
  return new Date(iso).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
