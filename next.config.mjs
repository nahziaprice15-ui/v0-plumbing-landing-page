import { withSentryConfig } from '@sentry/nextjs'

/**
 * Calendly UI reads `NEXT_PUBLIC_*` at build time. Hosts often set `CALENDLY_*`
 * without the prefix; those are not exposed to the browser unless we map them here.
 */
function calendlyClientEnv() {
  const pick = (pub, legacy) =>
    (process.env[pub]?.trim() || process.env[legacy]?.trim() || '').trim()

  return {
    NEXT_PUBLIC_CALENDLY_EVENT_URL: pick(
      'NEXT_PUBLIC_CALENDLY_EVENT_URL',
      'CALENDLY_EVENT_URL',
    ),
    NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR: pick(
      'NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR',
      'CALENDLY_PRIMARY_COLOR',
    ),
    NEXT_PUBLIC_CALENDLY_TEXT_COLOR: pick(
      'NEXT_PUBLIC_CALENDLY_TEXT_COLOR',
      'CALENDLY_TEXT_COLOR',
    ),
    NEXT_PUBLIC_CALENDLY_BACKGROUND_COLOR: pick(
      'NEXT_PUBLIC_CALENDLY_BACKGROUND_COLOR',
      'CALENDLY_BACKGROUND_COLOR',
    ),
    NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER: pick(
      'NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER',
      'CALENDLY_HIDE_GDPR_BANNER',
    ),
    NEXT_PUBLIC_CALENDLY_USE_POPUP_FLOW: pick(
      'NEXT_PUBLIC_CALENDLY_USE_POPUP_FLOW',
      'CALENDLY_USE_POPUP_FLOW',
    ),
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: calendlyClientEnv(),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default withSentryConfig(nextConfig, {
  org: 'the-coalition-y2',
  project: 'v0-plumbing-landing-page',

  authToken: process.env.SENTRY_AUTH_TOKEN,

  widenClientFileUpload: true,

  tunnelRoute: '/monitoring',

  silent: !process.env.CI,
})
