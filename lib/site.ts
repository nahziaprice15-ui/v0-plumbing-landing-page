/** Single source for NAP and site URL (use env in production). */
export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mspllcs.com').replace(/\/$/, '')
}

/** Absolute HTTPS URL for metadata and sitemap entries (home has no trailing slash; paths are /path). */
export function absoluteUrl(path: string) {
  const base = getSiteUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (normalized === '/') return base
  return `${base}${normalized}`
}

/** GitHub Issues tab URL for this repo; unset until configured in the host environment. */
export function getGithubIssuesUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_GITHUB_ISSUES_URL?.trim()
  if (!raw) return undefined
  return raw.replace(/\/$/, '')
}

export const SITE = {
  businessName: 'MS & P LLC',
  /** E.164 without spaces */
  phoneTel: '+16015690211',
  phoneDisplay: '(601) 569-0211',
  email: 'mspllc@gmail.com',
  city: 'New Orleans',
  state: 'LA',
  country: 'US',
} as const
