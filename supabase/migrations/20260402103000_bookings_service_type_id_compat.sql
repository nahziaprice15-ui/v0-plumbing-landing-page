-- Compatibility patch for environments that missed phase1 schema updates.
-- Safe to run multiple times.

alter table if exists public.bookings
  add column if not exists service_type_id uuid;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'bookings'
      and column_name = 'service_type_id'
  ) and exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'service_types'
  ) then
    if not exists (
      select 1
      from pg_constraint
      where conrelid = 'public.bookings'::regclass
        and contype = 'f'
        and conname = 'bookings_service_type_id_fkey'
    ) then
      alter table public.bookings
        add constraint bookings_service_type_id_fkey
        foreign key (service_type_id)
        references public.service_types (id)
        on delete set null;
    end if;
  end if;
end
$$;

create index if not exists bookings_service_type_id_idx
  on public.bookings (service_type_id);
