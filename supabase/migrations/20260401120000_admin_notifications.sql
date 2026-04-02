-- Per-user admin notifications (in-app inbox). Inserts use service role from app code.

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  booking_id uuid references public.bookings (id) on delete set null,
  read_at timestamptz,
  dedupe_key text,
  created_at timestamptz not null default now(),
  constraint admin_notifications_user_dedupe unique (user_id, dedupe_key)
);

create index if not exists admin_notifications_user_created_idx
  on public.admin_notifications (user_id, created_at desc);

create index if not exists admin_notifications_user_unread_idx
  on public.admin_notifications (user_id)
  where read_at is null;

alter table public.admin_notifications enable row level security;

drop policy if exists "admin_notifications_select_own" on public.admin_notifications;
create policy "admin_notifications_select_own"
on public.admin_notifications
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "admin_notifications_update_own" on public.admin_notifications;
create policy "admin_notifications_update_own"
on public.admin_notifications
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Inserts from server using service role bypass RLS.
