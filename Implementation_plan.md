# Implementation plan (MS & P LLC Plumbing)

This file is the **entry point** for active engineering plans. Detailed specs live under [`implementation/`](implementation/).

## Current initiative: Supabase backend and dashboards

**Canonical document:** [`implementation/backend_dashboards_supabase_70a94e24.plan.md`](implementation/backend_dashboards_supabase_70a94e24.plan.md)

That plan covers:

- Supabase (Postgres, Auth, RLS, Storage, Edge Functions)
- Slot-based booking, client and admin routes, terminology aligned to plumbing
- Database schema outline, security notes, and phased rollout
- **Environment variables:** see **§11.1** in that file for a copy-paste `.env` template (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)

## Other reference plans

| Topic | Document |
|--------|----------|
| Site build / landing structure | [`implementation/implementation_plan.md`](implementation/implementation_plan.md) |
| Website enhancements | [`implementation/website_enhancement_plan_f6c2dc95.plan.md`](implementation/website_enhancement_plan_f6c2dc95.plan.md) |
| Color system | [`implementation/Implementation_color_plan.md`](implementation/Implementation_color_plan.md) |

## Issue tracking

Use **[`GitHub_issue_Guide.md`](GitHub_issue_Guide.md)** when opening or updating GitHub issues for this work.
