-- Drops the old bookings table (old system, test data only) and creates the new one.
-- Run this in Supabase → SQL Editor.

drop table if exists bookings cascade;

create table bookings (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null,
  phone            text not null,
  email            text,
  service_type     text not null,
  address          text not null,
  preferred_date   date,
  preferred_time   text,
  description      text,
  status           text not null default 'pending'
                     check (status in ('pending','confirmed','in_progress','completed','cancelled')),
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index bookings_status_idx     on bookings (status);
create index bookings_created_at_idx on bookings (created_at desc);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_updated_at
  before update on bookings
  for each row execute procedure set_updated_at();
