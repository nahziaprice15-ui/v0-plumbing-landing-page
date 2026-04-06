# MS & P LLC — Plumbing marketing site

Public marketing and lead-generation site for **MS & P LLC** (plumbing services). It is a content-forward landing experience with service pages, legal pages, SEO metadata, and JSON-LD structured data. The booking API route is a **stub** today (logs the payload); wire it to email, CRM, or a database when you are ready.

## Stack

| Layer | Technology |
|--------|------------|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI | [React](https://react.dev/) 19 |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 4, PostCSS |
| Components | [Radix UI](https://www.radix-ui.com/) primitives, [class-variance-authority](https://cva.style/), `clsx` / `tailwind-merge` |
| Forms & validation | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), `@hookform/resolvers` |
| Icons & UX | [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/) (toasts), [next-themes](https://github.com/pacocoursey/next-themes) |
| Analytics | [Vercel Analytics](https://vercel.com/analytics) |
| Fonts | [Geist](https://vercel.com/font) (via `next/font`) |
| Other UI libs | [Embla Carousel](https://www.embla-carousel.com/), [Recharts](https://recharts.org/), [Vaul](https://github.com/emilkowalski/vaul) (drawer), [CMDK](https://cmdk.paco.me/), etc. (see `package.json`) |

**Linting:** ESLint is invoked via `pnpm run lint` (configuration lives in the repo alongside Next.js defaults).

## Prerequisites

- **Node.js** — use a current LTS release (the project targets modern Next/React; 20+ is a safe default).

## Getting started

This repo uses **pnpm** (`pnpm-lock.yaml`). Vercel installs with **frozen lockfile**—after changing `package.json`, run `pnpm install` and commit the updated lockfile.

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build:

```bash
pnpm run build
pnpm start
```

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm run dev` | Development server with hot reload |
| `pnpm run build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm run lint` | Run ESLint |

## Project layout (high level)

- `app/` — App Router routes, layouts, `globals.css`, and API routes (e.g. `app/api/booking/route.ts`)
- `components/` — Page sections, chrome, and shared UI
- `data/` — Static copy and structured content (e.g. FAQs)
- `lib/` — Shared utilities (site URL, NAP, JSON-LD helpers, etc.)
- `public/` — Static assets (images, icons)

Notable routes include the home page, `/services` and dynamic `/services/[slug]`, `/privacy`, and `/terms`.

The **`/issues`** route is a developer-facing landing page for reporting website bugs via GitHub. It is not linked from the main navigation or footer; use the URL directly or see below. It is excluded from the sitemap and set to `noindex` in metadata.

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin (no trailing slash). Used for metadata, sitemap, and structured data. Defaults to `https://msandpllc.com` in code if unset. |
| `NEXT_PUBLIC_GITHUB_ISSUES_URL` | Full URL to this repository’s GitHub Issues tab (e.g. `https://github.com/your-org/your-repo/issues`). When set, the `/issues` page shows a button to open it. If unset, that page falls back to the business email for feedback. |
| `NEXT_PUBLIC_CALENDLY_EVENT_URL` | Calendly event type URL used for booking embeds and popup flow. |
| `NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR` | Calendly embed `primary_color` in 6-digit hex without `#` (e.g. `0b3a62`). |
| `NEXT_PUBLIC_CALENDLY_TEXT_COLOR` | Calendly embed `text_color` in 6-digit hex without `#` (e.g. `0f172a`). |
| `NEXT_PUBLIC_CALENDLY_BACKGROUND_COLOR` | Calendly embed `background_color` in 6-digit hex without `#` (e.g. `eef2f8`). |
| `NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER` | `0` to show Calendly GDPR banner, `1` to hide (use per policy/legal guidance). |
| `NEXT_PUBLIC_CALENDLY_USE_POPUP_FLOW` | `0` keeps CTA behavior on onsite modal fallback; `1` enables Calendly popup for CTA entry points. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Browser key used for booking modal address autocomplete (Google Maps JavaScript API + Places). |
| `CALENDLY_WEBHOOK_TOKEN` | Optional shared token for `/api/calendly/webhook?token=...` so webhook ingestion can be authenticated. |

Set these in `.env.local` for local SEO checks and in your host’s environment for production.

### Google Maps key restrictions (recommended)

- Application restriction: **HTTP referrers** only.
- Allowed referrers:
  - `http://localhost:3000/*`
  - `https://msandpllc.com/*` (and any production aliases)
  - `https://*.vercel.app/*` (preview deployments)
- API restriction: allow only **Maps JavaScript API** and **Places API**.

### Address autocomplete QA checklist

- Booking modal address field shows suggestions after typing 3+ characters.
- Arrow up/down + enter + escape keyboard behavior works.
- Clicking a suggestion fills the full formatted address.
- Safari + Chrome behavior is consistent on desktop and mobile widths.
- If Google script fails or is blocked, manual address typing still works and form submits.

### Calendly prefill question mapping

When popup flow is enabled, pre-qualification answers are passed through Calendly `prefill.customAnswers`.
Match your Calendly invitee question order to avoid retyping:

- `a1`: service type
- `a2`: urgency
- `a3`: service address
- `a4`: customer type (new/returning)
- `a5`: optional notes
- `a6`: phone number

If these questions are absent or in a different order in Calendly, values may not prefill.

### Calendly -> Admin CRM sync (required)

Admin bookings only update from Calendly when webhook delivery is configured:

- Endpoint: `POST /api/calendly/webhook`
- Recommended: include token query string and set `CALENDLY_WEBHOOK_TOKEN`.
- Required events:
  - `invitee.created`
  - `invitee.canceled`

If webhook is not configured (or failing), bookings can still appear in Google Calendar but will not land in the admin CRM tables.

## Build note

`next.config.mjs` currently sets `typescript.ignoreBuildErrors: true`, so TypeScript errors will not fail `next build`. Prefer fixing types and turning this off when the codebase is clean.

## Deployment

The stack is a standard Next.js app and deploys cleanly on [Vercel](https://vercel.com/) (Analytics is already integrated). Any Node-compatible host that supports Next.js 16 works if configured appropriately.

Keep **`pnpm-lock.yaml` committed and in sync** with `package.json` (add or upgrade deps with `pnpm add` / `pnpm install`). CI uses a **frozen** install; an outdated lockfile makes `pnpm install` exit with code 1. Use the default Vercel install command (`pnpm install`—not a typo like `pnpm istall`), or leave the install command empty so Vercel infers it.

---

*Originally scaffolded from a v0-style UI kit; customized for MS & P LLC plumbing marketing.*
