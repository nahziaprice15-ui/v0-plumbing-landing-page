-- Phase 1 full Supabase schema + baseline RLS.
-- This migration adds the planned auth/catalog/scheduling/audit tables while
-- preserving the current customers/bookings flow used by /api/booking.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('user', 'client', 'admin', 'staff');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'profile_status') then
    create type public.profile_status as enum ('active', 'banned', 'suspended');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'availability_rule_kind') then
    create type public.availability_rule_kind as enum ('recurring', 'date_range', 'blackout');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'slot_status') then
    create type public.slot_status as enum ('open', 'closed', 'full');
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = uid
      and p.role in ('admin', 'staff')
      and p.status = 'active'
  );
$$;

-- ---------------------------------------------------------------------------
-- Core identity
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role public.app_role not null default 'user',
  status public.profile_status not null default 'active',
  banned_at timestamptz,
  ban_reason text,
  promoted_to_client_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, status)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    'user',
    'active'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

-- ---------------------------------------------------------------------------
-- Catalog + scheduling
-- ---------------------------------------------------------------------------
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  timezone text not null default 'America/Chicago',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists locations_set_updated_at on public.locations;
create trigger locations_set_updated_at
before update on public.locations
for each row execute function public.set_updated_at();

create table if not exists public.service_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  base_price_display text,
  base_price_cents integer check (base_price_cents is null or base_price_cents >= 0),
  buffer_minutes integer not null default 0 check (buffer_minutes >= 0),
  max_bookings_per_slot integer not null default 1 check (max_bookings_per_slot > 0),
  default_location_id uuid references public.locations (id) on delete set null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists service_types_set_updated_at on public.service_types;
create trigger service_types_set_updated_at
before update on public.service_types
for each row execute function public.set_updated_at();

create table if not exists public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  service_type_id uuid references public.service_types (id) on delete cascade,
  location_id uuid references public.locations (id) on delete cascade,
  rule_kind public.availability_rule_kind not null,
  days_of_week smallint[],
  start_local_time time,
  end_local_time time,
  valid_from date,
  valid_to date,
  is_indefinite boolean not null default false,
  priority integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint availability_rules_day_values check (
    days_of_week is null
    or (
      array_length(days_of_week, 1) > 0
      and not exists (
        select 1 from unnest(days_of_week) as d where d < 0 or d > 6
      )
    )
  )
);

drop trigger if exists availability_rules_set_updated_at on public.availability_rules;
create trigger availability_rules_set_updated_at
before update on public.availability_rules
for each row execute function public.set_updated_at();

create table if not exists public.slots (
  id uuid primary key default gen_random_uuid(),
  service_type_id uuid not null references public.service_types (id) on delete restrict,
  location_id uuid references public.locations (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null default 1 check (capacity > 0),
  booked_count integer not null default 0 check (booked_count >= 0 and booked_count <= capacity),
  status public.slot_status not null default 'open',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint slots_time_range check (ends_at > starts_at)
);

create index if not exists slots_starts_at_service_type_id_idx
  on public.slots (starts_at, service_type_id);

drop trigger if exists slots_set_updated_at on public.slots;
create trigger slots_set_updated_at
before update on public.slots
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Evolve existing bookings table in place (keep current columns for compatibility)
-- ---------------------------------------------------------------------------
alter table public.bookings
  add column if not exists user_id uuid references public.profiles (id) on delete set null,
  add column if not exists slot_id uuid references public.slots (id) on delete set null,
  add column if not exists service_type_id uuid references public.service_types (id) on delete set null,
  add column if not exists service_address text,
  add column if not exists address_line2 text,
  add column if not exists state text,
  add column if not exists postal_code text,
  add column if not exists customer_notes text,
  add column if not exists internal_notes text,
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancelled_by text,
  add column if not exists cancellation_reason text,
  add column if not exists completed_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

-- If/when booking status transitions to completed and user is attached,
-- upgrade role from user -> client once.
create or replace function public.promote_profile_to_client_on_booking_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_id is null then
    return new;
  end if;

  if new.status = 'completed' and coalesce(old.status, '') <> 'completed' then
    update public.profiles
    set
      role = case when role = 'user' then 'client' else role end,
      promoted_to_client_at = coalesce(promoted_to_client_at, now()),
      updated_at = now()
    where id = new.user_id;
  end if;

  return new;
end;
$$;

drop trigger if exists bookings_promote_profile_on_completed on public.bookings;
create trigger bookings_promote_profile_on_completed
after update on public.bookings
for each row execute function public.promote_profile_to_client_on_booking_completed();

create table if not exists public.booking_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  actor_user_id uuid references public.profiles (id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists booking_events_booking_id_created_at_idx
  on public.booking_events (booking_id, created_at desc);

create table if not exists public.login_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  occurred_at timestamptz not null default now(),
  ip text,
  user_agent text,
  auth_provider text
);

create index if not exists login_events_user_id_occurred_at_idx
  on public.login_events (user_id, occurred_at desc);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles (id) on delete cascade,
  target_user_id uuid references public.profiles (id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_admin_id_created_at_idx
  on public.admin_audit_log (admin_id, created_at desc);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.service_types enable row level security;
alter table public.locations enable row level security;
alter table public.availability_rules enable row level security;
alter table public.slots enable row level security;
alter table public.booking_events enable row level security;
alter table public.login_events enable row level security;
alter table public.admin_audit_log enable row level security;

-- profiles
drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (id = auth.uid() and status = 'active')
with check (id = auth.uid());

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
on public.profiles
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- service_types
drop policy if exists "service_types_public_read_active" on public.service_types;
create policy "service_types_public_read_active"
on public.service_types
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "service_types_admin_write" on public.service_types;
create policy "service_types_admin_write"
on public.service_types
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- locations
drop policy if exists "locations_public_read_active" on public.locations;
create policy "locations_public_read_active"
on public.locations
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "locations_admin_write" on public.locations;
create policy "locations_admin_write"
on public.locations
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- availability_rules
drop policy if exists "availability_rules_admin_only" on public.availability_rules;
create policy "availability_rules_admin_only"
on public.availability_rules
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- slots
drop policy if exists "slots_public_read_published" on public.slots;
create policy "slots_public_read_published"
on public.slots
for select
to anon, authenticated
using (is_published = true and status = 'open');

drop policy if exists "slots_admin_write" on public.slots;
create policy "slots_admin_write"
on public.slots
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- bookings (legacy anon policies remain from previous migration for compatibility)
drop policy if exists "bookings_select_own_or_admin" on public.bookings;
create policy "bookings_select_own_or_admin"
on public.bookings
for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "bookings_insert_self_or_admin" on public.bookings;
create policy "bookings_insert_self_or_admin"
on public.bookings
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "bookings_update_own_or_admin" on public.bookings;
create policy "bookings_update_own_or_admin"
on public.bookings
for update
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- booking_events
drop policy if exists "booking_events_select_own_or_admin" on public.booking_events;
create policy "booking_events_select_own_or_admin"
on public.booking_events
for select
to authenticated
using (
  exists (
    select 1
    from public.bookings b
    where b.id = booking_id
      and (b.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

drop policy if exists "booking_events_insert_own_or_admin" on public.booking_events;
create policy "booking_events_insert_own_or_admin"
on public.booking_events
for insert
to authenticated
with check (
  exists (
    select 1
    from public.bookings b
    where b.id = booking_id
      and (b.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

-- login_events
drop policy if exists "login_events_select_own_or_admin" on public.login_events;
create policy "login_events_select_own_or_admin"
on public.login_events
for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "login_events_insert_own_or_admin" on public.login_events;
create policy "login_events_insert_own_or_admin"
on public.login_events
for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- admin_audit_log
drop policy if exists "admin_audit_log_admin_only" on public.admin_audit_log;
create policy "admin_audit_log_admin_only"
on public.admin_audit_log
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
