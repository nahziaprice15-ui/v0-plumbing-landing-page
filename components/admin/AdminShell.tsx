'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarClock,
  ChartColumnIncreasing,
  LayoutDashboard,
  Menu,
  ScrollText,
  Settings,
  Tags,
  Users,
} from 'lucide-react'
import { signOutAdmin } from '@/app/admin/actions'
import { getAdminRouteMeta } from '@/lib/admin/route-meta'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/today', label: 'Today', icon: CalendarClock },
  { href: '/admin/bookings', label: 'Bookings', icon: BookOpenCheck },
  { href: '/admin/services', label: 'Services', icon: BriefcaseBusiness },
  { href: '/admin/service-categories', label: 'Service Categories', icon: Tags },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/insights', label: 'Insights', icon: ChartColumnIncreasing },
  { href: '/admin/activity', label: 'Activity', icon: ScrollText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
] as const

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href + '/'))
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminShell({
  children,
  pendingSlaCount = 0,
}: {
  children: React.ReactNode
  pendingSlaCount?: number
}) {
  const pathname = usePathname()
  const meta = getAdminRouteMeta(pathname)

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-card p-4 md:block md:min-h-screen">
          <div className="mb-6 rounded-lg bg-brand p-3 text-white">
            <p className="text-xs uppercase tracking-wide text-white/75">MS & P LLC</p>
            <h1 className="text-lg font-semibold">Admin Portal</h1>
          </div>
          <NavLinks pathname={pathname} />
        </aside>

        <section className="min-w-0 p-4 md:p-6">
          <header className="mb-6 flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 md:hidden" aria-label="Open menu">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[260px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 rounded-lg bg-brand p-3 text-white">
                    <p className="text-xs uppercase tracking-wide text-white/75">MS & P LLC</p>
                    <p className="font-semibold">Admin Portal</p>
                  </div>
                  <div className="mt-4">
                    <NavLinks pathname={pathname} />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-foreground">{meta.title}</h2>
                <p className="text-sm text-muted-foreground">{meta.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <form action={signOutAdmin}>
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Bell className="h-4 w-4" />
                    Alerts
                    {pendingSlaCount > 0 ? (
                      <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-semibold text-destructive-foreground">
                        {pendingSlaCount > 9 ? '9+' : pendingSlaCount}
                      </span>
                    ) : null}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <p className="text-sm font-medium">Operations</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>
                      {pendingSlaCount > 0 ? (
                        <>
                          <span className="font-medium text-foreground">{pendingSlaCount}</span> pending booking
                          {pendingSlaCount === 1 ? '' : 's'} older than 4 hours — review the queue.
                        </>
                      ) : (
                        <>No pending bookings past the 4h SLA window.</>
                      )}
                    </li>
                    <li>
                      <Link href="/admin/bookings?status=pending" className="text-primary underline-offset-4 hover:underline">
                        Open pending bookings
                      </Link>
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
              <div className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                Admin
              </div>
            </div>
          </header>

          {children}
        </section>
      </div>
    </main>
  )
}
