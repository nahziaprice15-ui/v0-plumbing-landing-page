# Calendly Embed Integration Plan (No Scheduling API)

## Scope and constraints

- Use **Calendly Embed only** (no Scheduling API, no paid API dependency).
- Admins continue managing event types and invitee questions directly in Calendly.
- Website adds:
  - **Primary flow:** inline embed for booking.
  - **Optional flow:** popup/modal booking from CTA.
- Deploy target is **Vercel**.
- Keep the existing site admin portal; do **not** build new onsite admin controls for Calendly settings.

---

## Current repo context (tailored to this codebase)

- Framework: `Next.js 16` App Router (`app/` routes).
- UI: React + Tailwind 4 + Radix/shadcn-style components.
- Existing booking UX:
  - Full booking page at `app/book/page.tsx`.
  - Global booking modal wired through:
    - `components/SiteChrome.tsx`
    - `components/BookingOpenContext.tsx`
    - `components/BookingModal.tsx`
  - Booking CTAs already exist in navigation and service pages.
- Brand/theme tokens already live in `app/globals.css` and can map cleanly to Calendly color params.

---

## A) Recommended embed approach (Advanced JS Embed vs iframe)

## Recommendation: **Advanced JS Embed (Calendly widget script)**

Use Calendly’s JS embed (`https://assets.calendly.com/assets/external/widget.js`) with `InlineWidget` for the primary experience and `initPopupWidget` for optional CTA popup.

### Why this is the best fit here

- Supports both required flows with one integration model:
  - inline in-page booking
  - popup/modal from button
- Supports embed customization parameters (brand alignment) in a consistent way.
- Supports optional `prefill` and `utm` payloads for future upgrades without changing architecture.
- Better control over lifecycle in a client component (mount/unmount on route transitions).

### Why not iframe-first

- iframe is simpler but less flexible for popup flow and future prefill/UTM patterns.
- JS embed gives cleaner path for route-aware initialization and fallback behavior.

### Known limitations to document

- Calendly content is rendered in Calendly-owned DOM/iframe, so **no full CSS control**.
- You can influence appearance using embed params only (e.g., `primary_color`, `text_color`, `background_color`, `hide_gdpr_banner` where appropriate).
- Typography/layout details inside the scheduling UI remain Calendly-controlled.

---

## B) Step-by-step task list (small, clickable)

- [ ] **Define config contract**
  - Add public env vars for event URL + embed colors + optional GDPR toggle.
  - Add a typed helper in `lib/` to normalize/validate these values.

- [ ] **Create Calendly client utilities**
  - Add a client-safe script loader (idempotent, promise-cached).
  - Guard against SSR (`window` checks) and duplicate script injection.

- [ ] **Implement primary inline booking component**
  - Build reusable inline component that reserves height to avoid layout shift.
  - Initialize inline widget only after script load and on mounted client.
  - Render local fallback CTA if Calendly fails to load.

- [ ] **Implement optional popup flow component**
  - Build popup trigger wrapper using `Calendly.initPopupWidget`.
  - Keep this behind a simple prop/flag so inline remains primary.

- [ ] **Integrate into booking route**
  - Replace/augment current `app/book/page.tsx` with Calendly-first “Book a service” experience.
  - Keep page-level explanatory copy + backup “Call us” fallback.

- [ ] **Integrate optional CTA popup in site chrome**
  - Wire CTA paths currently opening `BookingModal` to optionally open Calendly popup.
  - Preserve current UX as fallback until rollout completes.

- [ ] **Brand alignment pass**
  - Map site brand tokens to Calendly params (`primary_color`, `text_color`, `background_color`).
  - Decide where `hide_gdpr_banner` is legally acceptable (default conservative).

- [ ] **Data capture + invitee questions validation**
  - Validate that required “invitee questions” are configured in Calendly event type.
  - Confirm fields appear in embed with no onsite duplication.

- [ ] **Add optional prefill hooks (not required for launch)**
  - Design interface for `prefill: { name, email }` from a future pre-step form.
  - Keep disabled by default for v1.

- [ ] **Performance/reliability hardening**
  - Prevent CLS with fixed min-height/skeleton.
  - Initialize on client-only mount; cleanly re-init on route transitions.
  - Ensure minimal Lighthouse impact (load script only where needed).

- [ ] **Privacy/security pass**
  - Document data passed to Calendly, cookies/consent implications, GDPR banner behavior.
  - Update privacy policy copy if needed.

- [ ] **QA + staged rollout**
  - Execute browser/device/adblock/timezone checklist.
  - Roll out with optional feature flag and production fallback strategy.

---

## C) Files/components to add or modify (repo-specific)

## New files (proposed)

- `components/calendly/CalendlyInlineEmbed.tsx`
  - Client component for inline embed container and initialization.
- `components/calendly/CalendlyPopupButton.tsx`
  - Optional popup launcher component.
- `lib/calendly.ts`
  - Centralized config parsing + URL builder + color param shaping.
- `lib/calendly-script.ts` (or colocate in component folder)
  - Safe one-time script loader for widget.js.
- `types/calendly.d.ts` (optional)
  - Window typing for `window.Calendly`.

## Existing files likely to modify

- `app/book/page.tsx`
  - Move from custom form-first to Calendly inline-first booking page.
- `components/SiteChrome.tsx`
  - Add switch path for optional Calendly popup flow from global CTA.
- `components/Navigation.tsx`
  - Ensure CTA label/behavior remains coherent when using popup mode.
- `components/ServicePageCtas.tsx`
  - Route “Book online” CTA to popup flow when enabled.
- `lib/site.ts`
  - Add helper exports for fallback contact/canonical booking URL usage.
- `README.md`
  - Document new env vars and embed behavior.
- `app/privacy/page.tsx` (if policy text needs update)
  - Add third-party scheduling embed/cookie disclosure.

## Existing files intentionally not changed

- `app/admin/*`
  - No new onsite admin panel for Calendly settings; admins manage in Calendly directly.

---

## D) Environment/config needed

Store these in Vercel project env and local `.env.local`:

- `NEXT_PUBLIC_CALENDLY_EVENT_URL`
  - Example placeholder: `https://calendly.com/your-org/consultation`
- `NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR`
  - Hex without `#` (Calendly format), e.g. `0b3a62`
- `NEXT_PUBLIC_CALENDLY_TEXT_COLOR`
  - e.g. `0f172a`
- `NEXT_PUBLIC_CALENDLY_BACKGROUND_COLOR`
  - e.g. `eef2f8`
- `NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER`
  - `0`/`1` (default `0` recommended unless legal approves hide)
- `NEXT_PUBLIC_CALENDLY_USE_POPUP_FLOW` (optional rollout flag)
  - `0` inline-first only, `1` enable popup trigger behavior for selected CTAs

### Brand icon/source of truth

- Keep logo/brand asset in existing static path: `public/icon.svg` (already used by metadata).
- Use existing theme tokens in `app/globals.css` as the source for mapping Calendly colors.

---

## Embed parameter mapping and branding alignment

Use Calendly URL params / init options:

- `primary_color` -> `NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR`
- `text_color` -> `NEXT_PUBLIC_CALENDLY_TEXT_COLOR`
- `background_color` -> `NEXT_PUBLIC_CALENDLY_BACKGROUND_COLOR`
- `hide_gdpr_banner` -> `NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER`

Brand expectations:

- Match overall palette and section framing outside the widget (heading, spacing, card shell, fallback CTAs).
- Do not promise pixel-perfect widget internals due to Calendly rendering limits.

---

## Data capture approach (invitee questions + optional prefill)

## v1 (required)

- Invitee fields/questions are managed in Calendly Event Type settings.
- Website embed displays those fields automatically.
- No duplicate onsite form fields for booking intake.

## v1.1 (optional, future-ready)

- Add optional pre-step onsite form (name/email only), then pass:
  - `prefill: { name, email }`
- Keep prefill optional and non-blocking; user can still book without it.

## Data-routing rules

- Pass only minimal data from site to Calendly in v1 (event URL + visual params; optional prefill later).
- Avoid sending internal IDs or sensitive metadata unless explicitly needed.

---

## E) QA checklist

- [ ] **Desktop browsers:** latest Chrome, Safari, Firefox, Edge.
- [ ] **Mobile:** iOS Safari + Chrome Android, portrait/landscape checks.
- [ ] **Responsive layout:** inline embed height, no clipped content, no overlap with sticky nav.
- [ ] **Popup flow:** open/close behavior, focus return, background scroll behavior.
- [ ] **Adblockers/privacy extensions:** verify graceful fallback when widget script is blocked.
- [ ] **Cookie/GDPR behavior:** banner visible/hidden per config and policy decision.
- [ ] **Timezone correctness:** available slots reflect visitor timezone and event settings.
- [ ] **Route changes:** navigate between pages and back; widget mounts cleanly without duplication.
- [ ] **Performance:** check Lighthouse impact (especially JS execution and CLS).
- [ ] **Failure mode:** if Calendly fails, confirm “Call us” fallback is prominent and functional.

---

## F) Rollout plan

## Phase 1 - Staging

- Enable inline embed on `/book` with a real staging/test Calendly event URL.
- Keep existing modal booking flow available as operational fallback during validation.
- Run full QA checklist on Vercel preview/staging domains.

## Phase 2 - Controlled production release

- Roll out with `NEXT_PUBLIC_CALENDLY_USE_POPUP_FLOW=0` first (inline as primary only).
- Monitor user behavior and errors (script load failures, adblock impact, bounce at book step).

## Phase 3 - Optional popup activation

- Enable popup CTA path (`NEXT_PUBLIC_CALENDLY_USE_POPUP_FLOW=1`) for selected entry points.
- Compare conversion/engagement vs inline-only baseline.

## Fallback strategy

- If widget load fails or is blocked:
  - Show error-safe booking block with business phone CTA (`SITE.phoneTel`/`SITE.phoneDisplay`).
  - Keep static link to `NEXT_PUBLIC_CALENDLY_EVENT_URL` in a new tab as a secondary fallback.

---

## Security and privacy notes

- Calendly embed is third-party content; user interactions may set Calendly/related cookies.
- Treat this as third-party processing in privacy disclosures.
- `hide_gdpr_banner` should default to visible unless legal/compliance approves hiding.
- Do not pass sensitive fields via query params; use minimal config and optional basic prefill only.
- Ensure CSP (if later tightened) allows Calendly domains required for widget assets.

---

## G) Future upgrades

- **Prefill enhancement:** add small pre-step form for name/email and pass via `prefill`.
- **Attribution tracking:** pass UTM context into Calendly embed where supported; map to campaign analytics.
- **Calendly event callbacks:** capture booking-complete signal client-side for conversion events.
- **Webhook integration (if plan upgraded):**
  - Receive booking/cancellation events server-side for CRM, notifications, and admin timeline sync.
- **Service-specific routing:** support multiple event URLs per service slug while still managed in Calendly.
- **Experimentation:** A/B test inline-only vs popup-first CTA entry points.

---

## Implementation acceptance criteria

- `/book` renders a stable, branded Calendly inline experience without SSR errors.
- Existing CTA ecosystem can optionally open Calendly popup flow.
- Embed styling params are configurable via env and mapped to current brand palette.
- Invitee questions configured in Calendly appear in embed as expected.
- Clear privacy/cookie behavior is documented and validated.
- Fallback booking path remains available if Calendly is blocked/unavailable.
