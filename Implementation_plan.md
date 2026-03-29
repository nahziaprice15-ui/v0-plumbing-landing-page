# Implementation plan (MS & P LLC Plumbing)

This file is the **entry point** for backend and dashboard work. Everything below is framed for **this** site: a **New Orleans plumbing** business (MS & P LLC), **service visits and appointments**, and the existing **Patriot Blue / Liberty Red** brand—not generic “sessions” or unrelated SaaS patterns.

Detailed schema, routes, and security notes remain in the canonical doc linked at the bottom.

---

## Execution order (what we do first)

Follow these phases in order. Later phases assume the database and auth from earlier ones.

### Phase 1 — Supabase setup and **all** tables

- Create the Supabase project and wire **environment variables** (see **§11.1** in the canonical plan for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
- Add the Supabase client for **Next.js** (SSR/cookies): `middleware` session refresh, server and browser clients.
- Ship **SQL migrations** that create the **full** schema from the canonical plan in one coherent pass: `profiles` (with `role` / `status`), service catalog, locations, availability, slots, bookings, audit/history tables, and any enums or helper functions you already know you need. It is easier to add **RLS** and triggers when the tables exist together than to grow the schema piecemeal.
- **Profiles:** new signups get `role = 'user'` via a trigger on `auth.users` → `profiles` insert (or equivalent). Roles to support: at least `user`, `client`, `admin` (and `staff` later if needed), aligned with the full roadmap.
- **RLS:** define policies incrementally but **from the start** so anon/authenticated access is never wide open by mistake.

### Phase 2 — Signup and login (customer-facing auth)

- Build **`/signup`** and **`/login`** (and **`/logout`** as a server action or route). Add **`/forgot-password`** / **`/update-password`** when the core loop is stable.
- Use existing **shadcn/ui** forms and **site branding**: navy/red accents, Geist, copy that says **plumbing** and **MS & P LLC** (e.g. “Sign in to manage your visits,” not “sessions” or “calls”). Link back to the marketing home page in the auth layout.
- No feature work beyond auth until sign-in is reliable.

### Phase 3 — Roles and **manual** admin bootstrap

- **Do not** expose a UI to grant admin. After Phase 1 tables exist, **create the first admin manually in Supabase**: e.g. sign up once through the app, then in the SQL editor set `profiles.role = 'admin'` for that user’s `id` (or use your team’s preferred one-off seed). Document the exact steps in the repo (e.g. README or a short `docs/` note) so it is repeatable and safe.
- Confirm RLS or server checks: only `admin` can hit `/admin/*`; normal users cannot read admin data.

### Phase 4 — **Mockup** dashboards (test harness)

Build **minimal** UIs to prove **signup → login → role-based experience** before real booking logic:

| Area | Route (example) | Purpose |
|------|------------------|---------|
| **Customer** | `/account` (or `/dashboard`) | Mockup shell: welcome copy for MS & P LLC customers, placeholder sections for “Upcoming service visits” and profile—enough to show **logged-in `user` / `client`** experience. |
| **Admin** | `/admin` | Mockup shell: placeholder cards/sections for “Bookings,” “Service types,” etc.—**only visible if `profiles.role = 'admin'`**. |

Redirects: after login, send **admin** users to `/admin`, others to `/account` (adjust if you prefer a single `/login` destination with a role check).

This phase is **intentionally thin**: no real slot booking yet—only **auth + roles + navigation shell** so you can test end-to-end.

### Phase 5+ — Full product

- Implement **slot-based booking**, real **client** and **admin** features, reporting, login history, Storage, and Edge Functions per the canonical document below.

---

## Canonical technical specification

**Full roadmap (schema, routes, env template, booking rules):** [`implementation/backend_dashboards_supabase_70a94e24.plan.md`](implementation/backend_dashboards_supabase_70a94e24.plan.md)

- **Environment variables:** **§11.1** in that file (copy/paste `.env` template).

---

## Other reference plans

| Topic | Document |
|--------|----------|
| Site build / landing structure | [`implementation/implementation_plan.md`](implementation/implementation_plan.md) |
| Website enhancements | [`implementation/website_enhancement_plan_f6c2dc95.plan.md`](implementation/website_enhancement_plan_f6c2dc95.plan.md) |
| Color system | [`implementation/Implementation_color_plan.md`](implementation/Implementation_color_plan.md) |

---

## Issue tracking

Use **[`GitHub_issue_Guide.md`](GitHub_issue_Guide.md)** when opening or updating GitHub issues for this work.
