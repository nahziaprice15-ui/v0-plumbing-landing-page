# Updated Color Way — Implementation Record

**Status**: Implemented  
**Last updated**: March 23, 2026  
**Related**: [Implementation_color_plan.md](Implementation_color_plan.md) (original phased color work)

## Purpose

This document records the **logo visibility** and **semantic color token** work so the MS & P LLC mark reads clearly on Patriot Blue, charcoal, and white, and so accents on **light** sections use Patriot Blue instead of misusing **`primary`** (which is **white** for use on blue hero/nav).

## Problems addressed

### 1. Logo contrast

The circular brand asset uses **dark blue** lettering and outlines on a **dark** field. Placed directly on **`bg-background`** (Patriot Blue `#003D7A`) or **`bg-charcoal`**, the curved text and details disappeared.

**Solution**: [`components/BrandLogo.tsx`](components/BrandLogo.tsx) wraps the image in a **white circular pad** (`rounded-full bg-white`, light ring and shadow). The logo always sits on white, so navy text and artwork stay readable everywhere.

- **Primary asset path**: [`public/images/ms-p-logo.png`](public/images/ms-p-logo.png)  
- **Fallback**: On mount, a small preload probe requests the PNG; if it does not load, the visible `<img>` stays on [`public/images/ms-p-logo.svg`](public/images/ms-p-logo.svg). After you add a valid PNG, the next visit swaps to it automatically.

**Usage**

- [`components/Navigation.tsx`](components/Navigation.tsx) — `<BrandLogo size="nav" />`
- [`components/Footer.tsx`](components/Footer.tsx) — `<BrandLogo size="footer" />`

**To use your final circular PNG**: Replace or add `public/images/ms-p-logo.png` (recommended: square or circular export, transparent or opaque center; the white pad still helps edge contrast).

### 2. `primary` vs `brand` on light UI

In [`app/globals.css`](app/globals.css), **`--primary`** is **`#FFFFFF`** so headlines and CTAs on **Patriot Blue** sections stay white. Using `text-primary` on **`bg-card`** (white) made copy **invisible** (white on white).

**Solution**: New token:

| Token | Light (`:root`) | Dark (`.dark`) |
|-------|------------------|----------------|
| `--brand` | `var(--patriot-blue)` `#003D7A` | `#5BA3F5` (readable on dark cards) |

Exposed to Tailwind v4 as **`text-brand`**, **`bg-brand`**, **`bg-brand/10`**, etc. via `--color-brand` in `@theme inline`.

**Do not** use `text-primary` for accents on white cards. **Do** keep `text-primary` on blue sections (e.g. [`components/Hero.tsx`](components/Hero.tsx) “You Can Trust”).

## Files changed

| File | Change |
|------|--------|
| [`app/globals.css`](app/globals.css) | `--brand`, `.dark --brand`, `--color-brand` in `@theme` |
| [`components/BrandLogo.tsx`](components/BrandLogo.tsx) | New; white disc + PNG with SVG fallback |
| [`components/Navigation.tsx`](components/Navigation.tsx) | `BrandLogo` |
| [`components/Footer.tsx`](components/Footer.tsx) | `BrandLogo` |
| [`components/Pricing.tsx`](components/Pricing.tsx) | `text-brand` accent |
| [`components/QualityWorkGallery.tsx`](components/QualityWorkGallery.tsx) | `text-brand` headline accent; active dot `bg-brand` |
| [`components/TrustBar.tsx`](components/TrustBar.tsx) | `bg-brand/10`, `text-brand` icons |
| [`components/FAQ.tsx`](components/FAQ.tsx) | `hover:text-brand` |
| [`components/Testimonials.tsx`](components/Testimonials.tsx) | Quote icon `text-brand/25` |
| [`components/BookingModal.tsx`](components/BookingModal.tsx) | Step icons `text-brand` |
| [`app/privacy/page.tsx`](app/privacy/page.tsx) | Back link `text-brand` |
| [`app/terms/page.tsx`](app/terms/page.tsx) | Back link `text-brand` |
| [`public/images/ms-p-logo.png`](public/images/ms-p-logo.png) | **Optional**: add your final circular mark; until then SVG is used (preload probe avoids a broken image flash). |

## Verification checklist

- [ ] Nav: logo legible on Patriot Blue bar (white pad visible).
- [ ] Footer: logo legible on charcoal.
- [ ] Pricing / Quality Work / Trust Bar: accent text and icons clearly Patriot blue (or light blue in dark mode).
- [ ] FAQ: question row hover shows blue, not invisible white.
- [ ] Testimonial cards: quote glyph visible.
- [ ] Booking modal: User/Calendar icons visible on white.
- [ ] Privacy & Terms: “Back to home” link visible.
- [ ] Hero unchanged: still uses `text-primary` (white) on blue.

## Optional follow-ups

- [ ] Replace `ms-p-logo.png` with the final exported circular mark from design.
- [ ] Repo-wide search for `text-primary` on components that use `bg-card` and fix any stragglers.
- [ ] If you drop the white disc aesthetic, add a second logo export (light strokes) and a `BrandLogo` `variant` prop.

## Relationship to Implementation_color_plan.md

The original plan fixed nav, features, and footer **palette roles**. This update **does not undo** those choices; it adds **logo presentation** and a **`brand` token** so shadcn’s meaning of **`primary`** (white on brand blue) does not break white sections.
