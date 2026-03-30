-- Run this in Supabase: SQL Editor → New query → Run.
-- Creates tables used by POST /api/booking and policies so the anon key can insert
-- and read back rows (required for .insert().select().single()).
-- If you use SUPABASE_SERVICE_ROLE_KEY only on the server, RLS is bypassed for that
-- client, but the tables must still exist.

create extension if not exists "pgcrypto";

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid (),
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  zip_code text not null,
  created_at timestamptz not null default now ()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid (),
  customer_id uuid not null references public.customers (id) on delete cascade,
  confirmation_code text not null unique,
  service_type text not null,
  description text not null,
  preferred_date date not null,
  preferred_time_slot text not null,
  urgency text not null default 'standard',
  status text not null default 'pending',
  created_at timestamptz not null default now ()
);

create index if not exists bookings_customer_id_idx on public.bookings (customer_id);
create index if not exists bookings_confirmation_code_idx on public.bookings (confirmation_code);

alter table public.customers enable row level security;
alter table public.bookings enable row level security;

-- Public booking form (anon key from Next.js API route)
drop policy if exists "Allow anon insert customers" on public.customers;
create policy "Allow anon insert customers" on public.customers for insert to anon
with
  check (true);

drop policy if exists "Allow anon select customers" on public.customers;
create policy "Allow anon select customers" on public.customers for select to anon using (true);

drop policy if exists "Allow anon insert bookings" on public.bookings;
create policy "Allow anon insert bookings" on public.bookings for insert to anon
with
  check (true);

drop policy if exists "Allow anon select bookings" on public.bookings;
create policy "Allow anon select bookings" on public.bookings for select to anon using (true);
