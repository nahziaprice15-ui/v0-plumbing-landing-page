const META: Record<string, { title: string; description: string }> = {
  '/admin/dashboard': { title: 'Dashboard', description: 'Overview of booking activity' },
  '/admin/today': { title: 'Today', description: "Today's scheduled appointments" },
  '/admin/bookings': { title: 'Bookings', description: 'All booking requests' },
  '/admin/services': { title: 'Services', description: 'Service demand and performance' },
  '/admin/service-categories': { title: 'Service Categories', description: 'Manage service catalog categories' },
  '/admin/clients': { title: 'Clients', description: 'Customer booking history' },
  '/admin/insights': { title: 'Insights', description: 'Conversion and trend analytics' },
  '/admin/notifications': { title: 'Notifications', description: 'Alerts and system notifications' },
  '/admin/activity': { title: 'Activity', description: 'Recent admin actions and changes' },
  '/admin/settings': { title: 'Settings', description: 'Portal and notification settings' },
}

export function getAdminRouteMeta(pathname: string) {
  for (const [prefix, meta] of Object.entries(META)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return meta
  }
  return { title: 'Admin', description: '' }
}
