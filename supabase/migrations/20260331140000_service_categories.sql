-- Normalized service categories (plan option A2) + FK from service_types.
-- Requires phase1 (service_types, profiles, RLS helpers).

create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists service_categories_set_updated_at on public.service_categories;
create trigger service_categories_set_updated_at
before update on public.service_categories
for each row execute function public.set_updated_at();

alter table public.service_types
  add column if not exists category_id uuid references public.service_categories (id) on delete set null;

create index if not exists service_types_category_id_idx on public.service_types (category_id);

alter table public.service_categories enable row level security;

drop policy if exists "service_categories_public_read" on public.service_categories;
create policy "service_categories_public_read"
on public.service_categories
for select
to anon, authenticated
using (true);

drop policy if exists "service_categories_admin_write" on public.service_categories;
create policy "service_categories_admin_write"
on public.service_categories
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

insert into public.service_categories (slug, name, sort_order) values
  ('emergency', 'Emergency', 10),
  ('drain', 'Drain', 20),
  ('water-heater', 'Water Heater', 30),
  ('leak', 'Leak Repair', 40),
  ('installation', 'Installation', 50),
  ('general', 'General', 100)
on conflict (slug) do nothing;

insert into public.service_types (slug, title, category_id, sort_order)
select 'emergency', 'Emergency Repair', c.id, 10
from public.service_categories c where c.slug = 'emergency'
on conflict (slug) do update set
  title = excluded.title,
  category_id = coalesce(service_types.category_id, excluded.category_id);

insert into public.service_types (slug, title, category_id, sort_order)
select 'drain', 'Drain Cleaning', c.id, 20
from public.service_categories c where c.slug = 'drain'
on conflict (slug) do update set
  title = excluded.title,
  category_id = coalesce(service_types.category_id, excluded.category_id);

insert into public.service_types (slug, title, category_id, sort_order)
select 'water-heater', 'Water Heater Service', c.id, 30
from public.service_categories c where c.slug = 'water-heater'
on conflict (slug) do update set
  title = excluded.title,
  category_id = coalesce(service_types.category_id, excluded.category_id);

insert into public.service_types (slug, title, category_id, sort_order)
select 'leak', 'Leak Detection', c.id, 40
from public.service_categories c where c.slug = 'leak'
on conflict (slug) do update set
  title = excluded.title,
  category_id = coalesce(service_types.category_id, excluded.category_id);

insert into public.service_types (slug, title, category_id, sort_order)
select 'installation', 'Installation', c.id, 50
from public.service_categories c where c.slug = 'installation'
on conflict (slug) do update set
  title = excluded.title,
  category_id = coalesce(service_types.category_id, excluded.category_id);

insert into public.service_types (slug, title, category_id, sort_order)
select 'other', 'Other', c.id, 60
from public.service_categories c where c.slug = 'general'
on conflict (slug) do update set
  title = excluded.title,
  category_id = coalesce(service_types.category_id, excluded.category_id);
