# Quality Work Gallery — Implementation Plan

**Status**: Not started  
**Last updated**: March 23, 2026  

## Overview

Replace the homepage **before/after comparison slider** with an **after-only project photo carousel** inside the same section frame. The business has finished-work photos only; the UI and copy should showcase quality without implying side-by-side “before” comparisons.

## Goals

- Keep visual continuity: same section heading tone, `bg-card` section, centered framed card (`rounded-2xl`, `border`, shadow).
- Remove misleading patterns: no split slider, no “Before / After” labels, no second image per slide.
- Present one **hero image per slide** with title, short description, prev/next controls, and dot indicators.
- Align copy with “recent completed work” rather than “see the difference.”
- Use `next/image` and files under `public/images/` per [next.config.mjs](next.config.mjs) (AVIF/WebP).

## Current State

| Item | Location |
|------|----------|
| Component | [components/BeforeAfterSlider.tsx](components/BeforeAfterSlider.tsx) |
| Page usage | [app/page.tsx](app/page.tsx) — `<BeforeAfterSlider />` |
| Data | `transformations[]` with `before`, `after`, `title`, `description` (SVG placeholders) |

## Target State

| Item | Detail |
|------|--------|
| Component name | `QualityWorkGallery` (new file recommended: `components/QualityWorkGallery.tsx`) |
| Page usage | `<QualityWorkGallery />` with updated import |
| Data shape | `projects[]`: `{ title, image, description?, alt }` — `image` is a single public path |
| Hero area | One `Image` per slide, `fill` + `object-cover`, container `aspect-[16/10]` (or `aspect-[4/3]` if photos are consistently portrait) |
| Controls | Reuse outline icon buttons + dot indicators; remove `sliderPosition` state and drag handlers |

## Copy Changes

- **Keep** main H2: “Quality Work, **Guaranteed Results**” (primary span styling unchanged).
- **Replace** subheading. Example: *“Recent completed work from New Orleans homes and businesses.”*  
  Avoid language that implies before/after comparison.

## Pre-Implementation Checklist

- [ ] Git commit or branch for the change set
- [ ] Source photos gathered (landscape preferred; consistent framing helps `object-cover`)
- [ ] File names decided (e.g. `work-kitchen-pex.jpg` in `public/images/`)

---

## Phase 1: Component Refactor

### Task 1.1 — Create `QualityWorkGallery` component

**File**: `components/QualityWorkGallery.tsx` (new)  
**Priority**: High  

1. Copy structure from [components/BeforeAfterSlider.tsx](components/BeforeAfterSlider.tsx): outer `<section>`, header block, inner card, bottom panel.
2. Replace the comparison block with a single `relative aspect-[16/10]` (or chosen ratio) wrapper and one `next/image` using `current.image` and `current.alt`.
3. Delete: second image, `clipPath`, slider handle, mousemove listeners, Before/After badges, `sliderPosition` state.
4. Keep: `currentIndex`, prev/next handlers, dot buttons, title + description row.

#### Progress checklist

- [ ] New file exports `QualityWorkGallery`
- [ ] No before/after UI or state remains
- [ ] Arrows and dots still advance slides
- [ ] `alt` on each slide comes from data (not generic “photo”)

### Task 1.2 — Data model and sample entries

**File**: `components/QualityWorkGallery.tsx` (or `data/` module if you prefer centralizing content)

Define:

```ts
type ProjectSlide = {
  title: string
  image: string // e.g. '/images/work-example-1.jpg'
  description?: string
  alt: string
}
```

- Point `image` to real assets as you add them; until then, valid placeholders keep the build green.
- **Optional**: move the array to [data/mockData.ts](data/mockData.ts) for consistency with other site copy.

#### Progress checklist

- [ ] Array uses only single `image` per entry
- [ ] Each entry has a unique, descriptive `alt`

### Task 1.3 — Wire the homepage

**File**: [app/page.tsx](app/page.tsx)

1. Replace import: `QualityWorkGallery` instead of `BeforeAfterSlider`.
2. Replace JSX: `<QualityWorkGallery />` in the same position in the main flow.

#### Progress checklist

- [ ] Import path correct
- [ ] Section order unchanged relative to Trust/Features/Testimonials

### Task 1.4 — Remove old component

**File**: [components/BeforeAfterSlider.tsx](components/BeforeAfterSlider.tsx)

- Delete the file after `QualityWorkGallery` is verified, **or** keep a one-line re-export temporarily during migration (prefer delete for clarity).

#### Progress checklist

- [ ] No remaining imports of `BeforeAfterSlider` (grep the repo)

---

## Phase 2: Assets and Polish

### Task 2.1 — Add images

**Directory**: `public/images/`

- Prefer compressed JPEG or WebP; Next.js will serve modern formats via `next/image`.
- Naming: predictable prefixes, e.g. `work-<short-slug>.jpg`.
- If aspect ratios vary a lot, consider standardizing crop in an editor **or** switching the hero container to `aspect-[4/3]` for less aggressive vertical crop.

#### Progress checklist

- [ ] All `image` paths in data match real files
- [ ] Lighthouse / manual check: LCP image acceptable weight

### Task 2.2 — Accessibility and keyboard (recommended)

- Ensure prev/next buttons keep `aria-label` values.
- Consider `aria-live="polite"` on the title or a visually hidden “Slide X of Y” for screen readers.

#### Progress checklist

- [ ] Keyboard focus visible on controls
- [ ] Meaningful `alt` for each slide

---

## Phase 3 — Optional Follow-Ups

| Enhancement | When to use |
|-------------|-------------|
| Thumbnail strip under hero | Many slides; dots feel cramped |
| Responsive grid instead of carousel | 6+ photos, emphasis on density |
| Lightbox (enlarge on click) | Detail shots; phase 3 |

---

## Files Summary

| Action | Path |
|--------|------|
| Add | `components/QualityWorkGallery.tsx` |
| Update | `app/page.tsx` |
| Delete | `components/BeforeAfterSlider.tsx` (after cutover) |
| Add | `public/images/work-*.jpg` (or `.webp`) as you receive photos |

---

## Success Criteria

- [ ] Homepage shows a single finished-work image per slide in the existing framed card style.
- [ ] No “Before,” “After,” or comparison slider remains.
- [ ] Section copy does not imply before/after comparisons.
- [ ] All project images load with correct paths and descriptive `alt` text.
- [ ] No broken imports; production build succeeds.

---

## Quick reference: content to supply per photo

For each slide, maintain in your data:

1. **Image file** in `public/images/`
2. **Title** — short project label (e.g. “Tankless install — Mid-City”)
3. **Description** (optional) — one line about scope or outcome
4. **Alt** — plain description of what appears in the photo for accessibility and SEO
