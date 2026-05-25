# Admin Portal & Booking System — Implementation Plan

## Overview
Full teardown of the broken Supabase auth + admin portal, replaced with a clean,
structured system a plumbing business owner can actually use and maintain.

**What stays untouched:** Public landing page, hero, gallery, logo, photos, nav, footer, all styling.
**What gets rebuilt:** Admin auth, booking form, email notifications, admin dashboard.

---

## Phase 1 — Cleanup (Remove Old Broken System)

### Files to delete





1
- `app/admin/` — entire directory (all broken admin portal pages)
- `app/admin-login/` — entire directory (broken login page + actions)
- `lib/admin/` — entire directory (all admin utilities, queries, mock data)
- `lib/supabase/` — entire directory (client, server, service-role files)
- `middleware.ts` — replace with clean version (no Supabase auth)
- `app/api/calendly/` — remove Calendly webhook
- `app/api/booking/` — remove old booking API routes (will be replaced)
- `supabase/migrations/` — wipe all migrations (confirmed: all test data, start fresh)

### Packages to remove
- `@supabase/ssr`
- `@supabase/supabase-js`
- Calendly-related packages

### Packages to add
- `resend` — email delivery
- `iron-session` — secure cookie-based admin session
- `@supabase/supabase-js` — re-add clean (database only, no auth)
- `recharts` — charts for admin dashboard

### Environment variables (new clean set)
```
# Admin auth (simple password — no user tables)
ADMIN_PASSWORD=MDavis81**
ADMIN_SESSION_SECRET=<random 32-char string>

# Supabase (database only)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Email (Resend)
RESEND_API_KEY=
OWNER_EMAIL=nahziap@kammechanicalllc.com

# Site
NEXT_PUBLIC_SITE_URL=https://mspllcs.com
```

---

## Phase 2 — Simple Admin Authentication

### How it works
- Single password stored in `ADMIN_PASSWORD` env var
- On login: password checked server-side, encrypted session cookie set via `iron-session`
- All `/admin/*` routes check for valid session cookie via middleware
- No Supabase, no user tables, no profile role checks
- Logout clears the cookie

### Files to create
- `lib/session.ts` — iron-session config and helpers
- `app/admin-login/page.tsx` — login form (matches site navy/red color scheme)
- `app/admin-login/actions.ts` — server action: check password, set cookie
- `app/admin/logout/route.ts` — clears session cookie
- `middleware.ts` — lightweight: protect `/admin/*`, redirect to `/admin-login` if no session

### Login page design
- Navy header matching site nav
- White card centered on light gray background
- MS&P LLC logo at top
- Email + password fields
- Red "Sign In" button
- No forgot password (not needed — owner contacts developer)

---

## Phase 3 — Custom Booking Form + Email Notifications

### How it works
- Customer fills out booking form on the public site
- Form submits to `/api/booking` (POST)
- API saves booking to Supabase `bookings` table
- Resend sends two emails:
  1. **Owner email** — all booking details, customer contact info, service requested
  2. **Customer confirmation** — booking received, what to expect, business phone number
- Admin dashboard shows booking immediately

### Booking form fields
| Field | Type | Required |
|---|---|---|
| Full name | text | yes |
| Phone number | tel | yes |
| Email address | email | yes |
| Service type | select | yes |
| Property address | text | yes |
| Preferred date | date | yes |
| Preferred time | select (Morning / Afternoon / Evening / ASAP) | yes |
| Job description | textarea | no |

### Service types (dropdown options)
- Emergency Plumbing
- Drain Cleaning
- Water Heater Repair / Replacement
- Leak Detection & Repair
- Pipe Repair / Repiping
- Bathroom Installation
- Kitchen Plumbing
- Sewer Line Service
- Commercial Plumbing
- Other / Not Sure

### Database schema (Supabase — clean start)
```sql
-- bookings
create table bookings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  service_type text not null,
  address text not null,
  preferred_date date not null,
  preferred_time text not null,
  description text,
  status text not null default 'pending', -- pending | confirmed | in_progress | completed | cancelled
  notes text,                              -- internal admin notes
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Email templates
**Owner notification email:**
- Subject: `New Booking Request — [Service Type] — [Customer Name]`
- Body: all form fields, customer phone/email prominently at top, date/time requested

**Customer confirmation email:**
- Subject: `We received your request — MS & P LLC`
- Body: what they submitted, business phone number, "we'll call to confirm within 2 hours"

### Files to create
- `lib/supabase.ts` — single clean Supabase client (service role, server only)
- `lib/email.ts` — Resend email helpers (send owner notification, send customer confirmation)
- `lib/email-templates.tsx` — React Email templates for both emails
- `app/api/booking/route.ts` — POST handler: validate → save → send emails → return confirmation
- `components/BookingForm.tsx` — public booking form component
- `app/book/page.tsx` — dedicated booking page

---

## Phase 4 — Admin Dashboard

### Layout
- Navy sidebar (matches site nav color `#0b3a62`)
- White content area
- Red accents on active states, badges, CTAs
- Mobile: sidebar collapses to top nav

### Sidebar navigation
- Dashboard (overview)
- Bookings
- Customers
- Services
- Settings

### Dashboard page — key metrics cards
| Metric | Description |
|---|---|
| New bookings today | Bookings created today |
| Pending confirmation | Bookings still in `pending` status |
| In progress | Active jobs |
| Completed this month | Closed jobs this month |
| Conversion rate | Form starts vs completions (7-day) |
| Top service | Most booked service this month |

### Bookings page
- Table: customer name, phone, service, date, time, status, created
- Filter by status (pending / confirmed / in_progress / completed / cancelled)
- Click row to open detail panel
- Change status with dropdown
- Add internal notes
- Export to CSV

### Customers page
- List of unique customers (by phone)
- Total bookings per customer
- Last service date
- Click to see full booking history

### Services page (demand tracking)
- Bar chart: bookings per service type (last 30 / 90 days)
- Table: service name, total bookings, % of total, trend (up/down)
- Identifies most and least booked services

### Analytics page
- Conversion funnel: page visits → form opens → form submits
- Bookings by day of week (what days are busiest)
- Bookings by time slot (morning/afternoon/evening/ASAP)
- Month-over-month booking volume chart
- Geographic breakdown (addresses → neighborhoods)

### Files to create
- `app/admin/layout.tsx` — sidebar shell, session check
- `app/admin/page.tsx` — dashboard overview
- `app/admin/bookings/page.tsx` — bookings table
- `app/admin/bookings/[id]/page.tsx` — single booking detail
- `app/admin/customers/page.tsx` — customer list
- `app/admin/services/page.tsx` — service demand charts
- `app/admin/analytics/page.tsx` — conversion + trend charts
- `components/admin/Sidebar.tsx` — nav sidebar
- `components/admin/MetricCard.tsx` — reusable stat card
- `components/admin/BookingStatusBadge.tsx` — colored status pill
- `components/admin/BookingTable.tsx` — sortable bookings table
- `lib/admin/queries.ts` — all Supabase queries for admin pages

---

## Build Order

```
Phase 1  →  Phase 2  →  Phase 3  →  Phase 4
Cleanup     Auth         Booking      Dashboard
            (login)      (form +      (metrics +
                         email)       management)
```

Each phase is deployed and tested before moving to the next.

---

## Design Rules (must match site)
- Navy `#0b3a62` (`bg-brand`) — sidebar, headers, nav elements
- Red `#c81e2d` (`bg-secondary`) — CTA buttons, active states, badges
- Light gray `#eef2f8` (`bg-background`) — page backgrounds
- White — cards, panels, form inputs
- Font: Geist (already in project)
- Border radius: `rounded-lg` (0.625rem)
- Spacing: `container mx-auto px-4`, sections `py-6 md:py-8`

---

## Status

- [ ] Phase 1 — Cleanup
- [ ] Phase 2 — Admin auth (simple password)
- [ ] Phase 3 — Booking form + email
- [ ] Phase 4 — Admin dashboard
