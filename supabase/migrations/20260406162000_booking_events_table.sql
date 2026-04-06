create extension if not exists pgcrypto;

create table if not exists public.booking_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  actor_user_id uuid null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists booking_events_booking_id_idx
  on public.booking_events (booking_id);

create index if not exists booking_events_event_type_idx
  on public.booking_events (event_type);

create index if not exists booking_events_created_at_idx
  on public.booking_events (created_at desc);

alter table public.booking_events enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'booking_events'
      and policyname = 'booking_events_service_role_all'
  ) then
    create policy booking_events_service_role_all
      on public.booking_events
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end
$$;
