# Calendly Webhook + CRM Event Tracking Hardening Plan

## Goal

Make Calendly-to-CRM sync reliable by:

1. Creating the missing `public.booking_events` table in Supabase.
2. Hardening webhook/API code to handle missing event tables gracefully (no silent failures).
3. Preserving full CRM visibility for admin pages even if partial infra is unavailable.

---

## Problem summary (current state)

- The app currently writes bookings from Calendly webhook into:
  - `public.customers`
  - `public.bookings`
- But `public.booking_events` is missing in the active project.
- Result:
  - Some event/audit logging paths fail.
  - Admin activity/audit surfaces are incomplete.
  - Troubleshooting future sync issues becomes harder.

---

## Scope

### In scope

- Add migration for `public.booking_events`.
- Add defensive handling where event logging is optional-but-visible (warn/fallback).
- Ensure webhook remains successful for booking creation/cancellation even if event logging has transient issues.
- Add diagnostics and verification checklist.

### Out of scope

- Rewriting booking schema.
- Replacing Calendly webhook model.
- New admin UI feature set beyond diagnostics/messages.

---

## Implementation steps

## 1) Add database migration for `booking_events`

Create SQL migration in repo migrations folder (or Supabase migration flow used by this project) to add:

- Table: `public.booking_events`
- Columns:
  - `id uuid primary key default gen_random_uuid()`
  - `booking_id uuid not null references public.bookings(id) on delete cascade`
  - `actor_user_id uuid null` (for admin status changes; links to `auth.users`/`profiles` as currently modeled)
  - `event_type text not null`
  - `payload jsonb not null default '{}'::jsonb`
  - `created_at timestamptz not null default now()`
- Indexes:
  - `booking_events_booking_id_idx` on `(booking_id)`
  - `booking_events_event_type_idx` on `(event_type)`
  - `booking_events_created_at_idx` on `(created_at desc)`

RLS:

- Enable RLS.
- Service-role paths continue working.
- Add policy allowing admin/staff reads if needed by current server-side query model.

---

## 2) Harden webhook event insert behavior

File: `app/api/calendly/webhook/route.ts`

### Target behavior

- Booking create/cancel should still complete when possible.
- If event-log insert fails because table is missing or transient DB issue:
  - Return success for core booking update.
  - Emit clear server log warning with event type and booking id.
  - Include lightweight debug metadata in response for non-production (optional).

### Suggested approach

- Wrap `booking_events` inserts in `try/catch`.
- Detect missing table/code (`42P01`) and downgrade to warning.
- Keep revalidation calls (`/admin/bookings`, `/admin/dashboard`, etc.) regardless.

---

## 3) Harden admin query paths using booking events

File: `lib/admin/queries.ts`

### Target behavior

- Admin pages should not break when `booking_events` table is missing.
- Activity panels should degrade gracefully:
  - return empty list
  - return diagnostics warning code (e.g. `BOOKING_EVENTS_MISSING`)

### Suggested changes

- In `getBookingEvents(...)` and `getRecentBookingActivity(...)`:
  - detect relation-missing errors (`42P01`)
  - return empty array + warning diagnostics (where existing shape allows)

---

## 4) Add explicit diagnostics for CRM sync health

Files:

- `app/admin/bookings/page.tsx` (or existing diagnostics surface)
- optionally `app/admin/dashboard/page.tsx` for a compact health card

### Display conditions

- Show warning if:
  - webhook token missing in environment
  - booking_events table unavailable
  - webhook/event insert failures detected recently (future enhancement)

Message example:

- “Booking records are syncing, but event audit trail is degraded.”

---

## 5) Verification checklist

### Database verification

- `public.booking_events` exists.
- Indexes are present.
- Row insert test works manually.

### Webhook flow verification

- Trigger test `invitee.created` from Calendly:
  - customer created/reused
  - booking created with expected fields
  - booking_events row created (`calendly_invitee_created`)
- Trigger test `invitee.canceled`:
  - booking status becomes `cancelled`
  - booking_events row created (`calendly_invitee_canceled`)

### Admin verification

- `/admin/bookings` shows new booking.
- `/admin/activity` shows related event row.
- `/admin/bookings/[id]` shows booking event history.

---

## Rollout plan

1. Deploy migration first.
2. Deploy webhook/admin hardening code.
3. Run end-to-end Calendly create + cancel test in production.
4. Confirm admin CRM and activity views both update.

Rollback:

- If migration applied but code issues appear, keep migration and roll forward with patch.
- Avoid dropping event table once in use.

---

## Risks and mitigations

- **Risk:** Migration applied to wrong Supabase project.
  - **Mitigation:** Verify project ref matches `NEXT_PUBLIC_SUPABASE_URL` before applying.

- **Risk:** Webhook events arrive before migration is live.
  - **Mitigation:** Graceful fallback in webhook handler prevents hard failure.

- **Risk:** Admin users misread partial sync state.
  - **Mitigation:** Add explicit diagnostics/warnings in admin UI.

---

## Files expected to change

- `app/api/calendly/webhook/route.ts`
- `lib/admin/queries.ts`
- `app/admin/bookings/page.tsx` (and/or dashboard diagnostics surface)
- Supabase migration file (new)
- `README.md` (optional diagnostics section update)
