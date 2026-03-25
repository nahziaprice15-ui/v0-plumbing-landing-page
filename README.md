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

**Linting:** ESLint is invoked via `npm run lint` (configuration lives in the repo alongside Next.js defaults).

## Prerequisites

- **Node.js** — use a current LTS release (the project targets modern Next/React; 20+ is a safe default).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Production build:

```bash
npm run build
npm start
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project layout (high level)

- `app/` — App Router routes, layouts, `globals.css`, and API routes (e.g. `app/api/booking/route.ts`)
- `components/` — Page sections, chrome, and shared UI
- `data/` — Static copy and structured content (e.g. FAQs)
- `lib/` — Shared utilities (site URL, NAP, JSON-LD helpers, etc.)
- `public/` — Static assets (images, icons)

Notable routes include the home page, `/services` and dynamic `/services/[slug]`, `/privacy`, and `/terms`.

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin (no trailing slash). Used for metadata, sitemap, and structured data. Defaults to `https://msandpllc.com` in code if unset. |

Set this in `.env.local` for local SEO checks and in your host’s environment for production.

## Build note

`next.config.mjs` currently sets `typescript.ignoreBuildErrors: true`, so TypeScript errors will not fail `next build`. Prefer fixing types and turning this off when the codebase is clean.

## Deployment

The stack is a standard Next.js app and deploys cleanly on [Vercel](https://vercel.com/) (Analytics is already integrated). Any Node-compatible host that supports Next.js 16 works if configured appropriately.

---

*Originally scaffolded from a v0-style UI kit; customized for MS & P LLC plumbing marketing.*
