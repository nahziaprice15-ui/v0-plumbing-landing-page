/** Header titles for `/admin/*` — used by AdminShell (client) via pathname. */
export const ADMIN_ROUTE_META: Record<
  string,
  { title: string; description: string }
> = {
  '/admin/dashboard': {
    title: 'Dashboard',
    description: 'KPIs, pipeline snapshot, and demand at a glance',
  },
  '/admin/bookings': {
    title: 'Bookings',
    description: 'Search, filter, and update job status',
  },
  '/admin/services': {
    title: 'Services',
    description: 'Catalog entries tied to booking demand',
  },
  '/admin/service-categories': {
    title: 'Service categories',
    description: 'Group services for reporting and dispatch',
  },
  '/admin/clients': {
    title: 'Clients',
    description: 'Customers aggregated from booking history',
  },
  '/admin/insights': {
    title: 'Insights',
    description: 'Funnel, demand, and operational analytics',
  },
  '/admin/today': {
    title: 'Today',
    description: "Today's schedule and quick map links",
  },
  '/admin/activity': {
    title: 'Activity',
    description: 'Recent status changes and booking events',
  },
  '/admin/settings': {
    title: 'Settings',
    description: 'Dispatch reference — hours, area, after-hours',
  },
  '/admin/notifications': {
    title: 'Notifications',
    description: 'Action items, new requests, and status updates',
  },
}

export function getAdminRouteMeta(pathname: string): { title: string; description: string } {
  if (pathname.startsWith('/admin/bookings/') && pathname !== '/admin/bookings') {
    return {
      title: 'Booking detail',
      description: 'Customer, service, timeline, and status updates',
    }
  }
  if (pathname.startsWith('/admin/clients/') && pathname !== '/admin/clients') {
    return {
      title: 'Client profile',
      description: 'History and notes for this customer',
    }
  }
  return ADMIN_ROUTE_META[pathname] ?? {
    title: 'Admin',
    description: 'Private staff tools for bookings and dispatch',
  }
}
