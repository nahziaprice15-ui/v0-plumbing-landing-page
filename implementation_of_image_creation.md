# Implementation Plan: Quality Work — Image Creation & Placement

**Status**: In progress (real project photos rolling in)  
**Last updated**: March 23, 2026  

## Purpose

This document is the **single catalog** for **Quality Work** photos: where files live, how they map to carousel slides, and how to add more. The UI lives in [`components/QualityWorkGallery.tsx`](components/QualityWorkGallery.tsx); structure and behavior are described in [Implementation_quality_work_gallery_plan.md](Implementation_quality_work_gallery_plan.md).

## Goals

- One **naming convention** under [`public/images/`](public/images/) (`kebab-case`, topic + optional index).
- Use **descriptive alt text** for accessibility and SEO.
- Prefer **landscape-first** shots where possible so single-image slides use `aspect-[16/10]` + `object-cover` cleanly; **gallery slides** use a fixed cell aspect (`4/3`) per image.
- Optional: compress PNGs or standardize on WebP before production if LCP suffers.

---

## Master asset list → carousel

Order matches the `projects` array in `QualityWorkGallery.tsx` (one dot = one array entry).

| Order | Carousel title | Files | Notes |
|------:|----------------|--------|--------|
| 1 | Residential underground installation | [`residential-underground-installation-1.png`](public/images/residential-underground-installation-1.png) | Single-image slide (`layout: 'single'`). |
| 2 | Sewer line installation | [`sewer-line-installation-1.png`](public/images/sewer-line-installation-1.png) | Single-image slide. |
| 3 | Bathroom installation | [`bathroom-installation-tub.png`](public/images/bathroom-installation-tub.png), [`bathroom-installation-shower.png`](public/images/bathroom-installation-shower.png), [`bathroom-installation-vanity.png`](public/images/bathroom-installation-vanity.png) | **Multi-image slide** (`layout: 'gallery'`): all three show together—stacked on mobile, three columns from `md` up. |
| 4 | Water Heater Installation | [`before-after-3-after.svg`](public/images/before-after-3-after.svg) | Placeholder SVG until a real water heater photo replaces it. |

### Staged (not yet on a slide)

| File | Intended use |
|------|----------------|
| [`residential-underground-installation-2.png`](public/images/residential-underground-installation-2.png) | Second view: main drain trench, branch fittings, string lines, slab formwork. Add a new `layout: 'single'` entry or duplicate the first residential entry with this `image`. |

---

## Batch notes (source content)

### Residential underground installation

- **Slide title**: `Residential underground installation`
- **Image**: `residential-underground-installation-1.png`
- **Scene**: Underground rough-in phase—white PVC in red clay trenches, junctions and risers, wooden formwork for slab edge.

### Sewer line installation

- **Slide title**: `Sewer line installation`
- **Image**: `sewer-line-installation-1.png`
- **Scene**: Rear of a modern home; long trench in sandy soil with PVC sewer line; stairs, lawn, and equipment visible—documents exterior lateral / yard run work.

### Bathroom installation (gallery slide)

- **Slide title**: `Bathroom installation`
- **Files** (order left-to-right on desktop, top-to-bottom on mobile):
  1. **`bathroom-installation-tub.png`** — Freestanding tub, floor-mounted filler, large-format wall tile, geometric floor tile, recessed niche.
  2. **`bathroom-installation-shower.png`** — Walk-in shower: rain head, wall head, handheld on bar, stacked valves, niche with accent tile.
  3. **`bathroom-installation-vanity.png`** — Vanity with marble top, vessel sink, waterfall faucet, toilet; trim-out stage.

---

## Data shape (code reference)

Projects are a **discriminated union** by `layout`:

**Single image** (one hero photo, full width):

```ts
{
  layout: 'single'
  title: string
  description: string
  image: string   // '/images/...'
  alt: string
}
```

**Gallery** (multiple photos in one carousel step):

```ts
{
  layout: 'gallery'
  title: string
  description: string
  a11yPhotoLabels: string  // short phrase for aria-live, e.g. "tub, shower, vanity"
  images: { src: string; alt: string }[]
}
```

## Workflow for adding a new photo

### Single-image project

1. Export at usable width (e.g. 1600–2400px), landscape if you can.
2. Name: `service-or-job-type-1.png` (increment per job).
3. Copy into `public/images/`.
4. Append a `{ layout: 'single', ... }` object to `projects` in [`components/QualityWorkGallery.tsx`](components/QualityWorkGallery.tsx).
5. Commit asset + component together.

### Multi-image project (one dot, several photos visible)

1. Add all files to `public/images/` with a shared prefix (e.g. `bathroom-installation-*.png`).
2. Add one `{ layout: 'gallery', images: [...], a11yPhotoLabels: '...' }` entry—**one** carousel dot for the whole set.
3. Order `images[]` to match the story you want (e.g. tub → shower → vanity).

## Optional optimizations

- [ ] Compress PNGs or serve WebP copies and update paths.
- [ ] Document CDN / `remotePatterns` here if you move off `public/`.

## Checklists

### Residential underground batch

- [x] `residential-underground-installation-1.png` in `public/images/`
- [x] Slide wired in `QualityWorkGallery`
- [ ] Optional: second slide using `residential-underground-installation-2.png`

### Sewer line batch

- [x] `sewer-line-installation-1.png` in `public/images/`
- [x] Slide wired in `QualityWorkGallery`

### Bathroom batch

- [x] `bathroom-installation-tub.png`, `bathroom-installation-shower.png`, `bathroom-installation-vanity.png` in `public/images/`
- [x] One **gallery** slide wired in `QualityWorkGallery` (three images visible together)

### Global

- [ ] Optional: compress / WebP for all Quality Work PNGs
- [ ] Lighthouse: LCP acceptable on throttled connection

## Files touched when images change

| File | Role |
|------|------|
| `public/images/*` | Static assets |
| `components/QualityWorkGallery.tsx` | `projects`: `layout`, paths, titles, descriptions, `alt`, `a11yPhotoLabels` for galleries |

## Success criteria

- [x] No 404s for paths listed in the master table (SVG placeholder for water heater until replaced).
- [x] Each image has accurate, non-generic `alt`; gallery slide exposes a clear screen-reader summary.
- [x] Section frame unchanged (card, prev/next, dots); bathroom uses one dot for three photos.
