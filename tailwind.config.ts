import type { Config } from 'tailwindcss'

/**
 * Explicit content globs for class detection. Tailwind v4 also scans the repo by
 * default; this file documents paths and is loaded via `@config` in app/globals.css.
 */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
} satisfies Config
