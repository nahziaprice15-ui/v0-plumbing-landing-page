# Removal of public pricing (landing & services)

This document records what was removed or reworded so the marketing site does **not** display dollar amounts, rate tables, or tiered “plans” for services.

## Goals

- Remove the home page **Pricing** section (`#pricing`) and all navigation/footer links to it.
- Remove **per-segment pricing guides** on `/services` (residential, commercial, emergency).
- Strip **structured data** hints that implied a generic price tier (`priceRange` on LocalBusiness JSON-LD).
- Replace copy that advertised “transparent pricing,” “upfront pricing,” or listed rates with **estimate- and scope-focused** language.

## Code and content changes

| Area | Change |
|------|--------|
| `components/Pricing.tsx` | **Deleted** — tier cards with dollar amounts removed from the home page. |
| `components/HomePageClient.tsx` | Removed `<Pricing />` from the render order. |
| `components/Navigation.tsx` | Removed “Pricing” nav item pointing to `/#pricing`. |
| `components/Footer.tsx` | Removed “Pricing” quick link. |
| `components/ServicesHub.tsx` | Removed the “Pricing guide” panel under each segment tab. |
| `data/serviceSegments.ts` | Removed `pricing`, `pricingDisclaimer`, and the `SegmentPricingRow` type from segment definitions. |
| `data/faqs.ts` | Rewrote the “How much do your services cost?” answer to describe estimates and scope without rates. |
| `data/services.ts` | Reworded emergency copy to avoid “pricing” / “cost ranges” where it implied published rates. |
| `components/Guarantee.tsx` | “No hidden fees” bullet now references written estimates/scope, not “transparent pricing.” |
| `components/Features.tsx` | Removed references to “pricing guides”; CTA label is category browsing only. |
| `components/Testimonials.tsx` | Adjusted quotes that mentioned “fair price” / “fair pricing.” |
| `app/page.tsx`, `app/layout.tsx`, `app/services/page.tsx` | Metadata descriptions no longer say “upfront pricing” or “pricing guides.” |
| `app/terms/page.tsx` | Services paragraph: “pricing” → “scope” in the variance list. |
| `lib/schema.ts` | Removed `priceRange` from LocalBusiness JSON-LD. |
| `data/mockData.ts` | Removed unused `pricingTiers` export; neutralized leftover FAQ/testimonial/guarantee strings that cited dollars or “rates.” |

## What was intentionally left unchanged

- **Admin**, **booking APIs**, and **Calendly** flows are unrelated to public marketing copy; no change was required for this goal.
- **Terms of service** still describe commercial relationship; only the single “pricing” word in the overview was replaced with “scope” for consistency.

## Verification

After deployment, confirm:

1. Home page has no `#pricing` section and no “Pricing” in nav/footer.
2. `/services` shows offerings only—no rate tables under each tab.
3. Site-wide search for `$` + digits in `*.tsx` / `*.ts` under `app/`, `components/`, and `data/` returns no user-facing price lists (spot-check if new copy is added later).
