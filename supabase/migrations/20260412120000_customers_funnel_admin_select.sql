-- Allow admin/staff (via is_admin()) to read customers when using the user session
-- client instead of the service role — required for bookings embed: customers(...).
drop policy if exists "customers_select_admin" on public.customers;
create policy "customers_select_admin"
on public.customers
for select
to authenticated
using (public.is_admin(auth.uid()));

-- Funnel analytics: previously insert-only; admin dashboard selects need read access.
drop policy if exists "booking_funnel_events_admin_select" on public.booking_funnel_events;
create policy "booking_funnel_events_admin_select"
on public.booking_funnel_events
for select
to authenticated
using (public.is_admin(auth.uid()));
