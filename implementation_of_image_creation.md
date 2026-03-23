# Implementation Plan: Quality Work — Image Creation & Placement

**Status**: In progress (first residential underground assets live)  
**Last updated**: March 23, 2026  

## Purpose

This document defines how **project photos** for the **Quality Work** section ([`components/QualityWorkGallery.tsx`](components/QualityWorkGallery.tsx)) are produced, stored, named, and wired into the site. It complements [Implementation_quality_work_gallery_plan.md](Implementation_quality_work_gallery_plan.md), which covers the carousel UI itself.

## Goals

- Keep **one source of truth** for filenames under [`public/images/`](public/images/).
- Use **descriptive alt text** for accessibility and SEO.
- Prefer **consistent aspect** (landscape) so `object-cover` in the `aspect-[16/10]` hero crops predictably.
- Compress large PNGs/JPEGs before commit when file sizes hurt LCP (optional follow-up).

## Current Assets — Residential Underground Installation

| File | Use |
|------|-----|
| [`public/images/residential-underground-installation-1.png`](public/images/residential-underground-installation-1.png) | PVC rough-in: trenches in clay, multiple runs and vertical risers, formwork visible. Used on the **Residential underground installation** carousel slide. |
| [`public/images/residential-underground-installation-2.png`](public/images/residential-underground-installation-2.png) | Main drain trench, long PVC run, T/Y branch, string lines and slab formwork. **Staged for a second slide**—duplicate the first slide’s object in `projects`, point `image` here, and adjust `description` / `alt` (see checklist below). |

**Gallery copy** (editable in `QualityWorkGallery.tsx` → `projects` array):

- **Title**: `Residential underground installation` (replaces the former “Kitchen pipe replacement” placeholder slide).
- **Description / alt**: Match what is actually visible in `residential-underground-installation-1.png` (see component for current strings).

## Data Shape (reference)

Each carousel item in code:

```ts
{
  title: string
  image: string  // '/images/your-file.png' or .jpg / .webp
  description: string
  alt: string
}
```

## Workflow for Adding a New Photo

1. **Export** from camera or editor: landscape if possible; reasonable resolution (e.g. 1600–2400px wide).
2. **Name** the file: `kebab-case`, topic first, e.g. `residential-underground-installation-3.png` or `tankless-install-midcity.jpg`.
3. **Place** the file in `public/images/`.
4. **Edit** [`components/QualityWorkGallery.tsx`](components/QualityWorkGallery.tsx): append or replace an object in the `projects` array with `image`, `title`, `description`, and `alt`.
5. **Verify** locally: carousel, prev/next, dots, and first-slide `priority` if this slide should be first.
6. **Commit** image + component change together.

## Optional Optimizations

- [ ] Run images through compression (ImageOptim, Squoosh, or `sharp` CLI) and prefer **WebP** if you standardize on one format.
- [ ] If `next.config` adds `remotePatterns` later, document CDN URLs here instead of only `public/`.

## Checklist — Residential Underground Batch

- [x] Images copied to `public/images/` with stable names
- [x] `QualityWorkGallery` updated: one slide titled **Residential underground installation** using `residential-underground-installation-1.png`
- [ ] Optional: add a second `projects` entry (same title or a qualified title) using `residential-underground-installation-2.png`
- [ ] Optional: compress PNGs and/or convert to WebP
- [ ] Lighthouse: LCP for hero image acceptable on 3G Fast throttle

## Files Touched When Images Change

| File | Role |
|------|------|
| `public/images/*` | Static image assets |
| `components/QualityWorkGallery.tsx` | `projects` array: paths, titles, copy, alt |

## Success Criteria

- [ ] All `image` paths resolve (no 404 in Network tab).
- [ ] Each slide has a unique, accurate `alt`.
- [ ] Section still matches site frame (card, typography, controls).
