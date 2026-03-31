-- Booking funnel analytics for admin insights.
create extension if not exists "pgcrypto";

create table if not exists public.booking_funnel_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('start', 'submit', 'submit_error')),
  source_path text not null default '/',
  form_variant text not null default 'unknown',
  created_at timestamptz not null default now()
);

create index if not exists booking_funnel_events_created_at_idx
  on public.booking_funnel_events (created_at desc);

create index if not exists booking_funnel_events_event_type_idx
  on public.booking_funnel_events (event_type);

alter table public.booking_funnel_events enable row level security;

drop policy if exists "Allow anon insert booking funnel events" on public.booking_funnel_events;
create policy "Allow anon insert booking funnel events"
on public.booking_funnel_events
for insert
to anon
with check (true);

drop policy if exists "Allow authenticated insert booking funnel events" on public.booking_funnel_events;
create policy "Allow authenticated insert booking funnel events"
on public.booking_funnel_events
for insert
to authenticated
with check (true);

