'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, BookOpenCheck, BriefcaseBusiness, ChartColumnIncreasing, LayoutDashboard, Tags, Users } from 'lucide-react'
import { signOutAdmin } from '@/app/admin/actions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: BookOpenCheck },
  { href: '/admin/services', label: 'Services', icon: BriefcaseBusiness },
  { href: '/admin/service-categories', label: 'Service Categories', icon: Tags },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/insights', label: 'Insights', icon: ChartColumnIncreasing },
] as const

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r bg-card p-4 md:min-h-screen">
          <div className="mb-6 rounded-lg bg-brand p-3 text-white">
            <p className="text-xs uppercase tracking-wide text-white/75">MS & P LLC</p>
            <h1 className="text-lg font-semibold">Admin Portal</h1>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <section className="min-w-0 p-4 md:p-6">
          <header className="mb-6 flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Operations Dashboard</h2>
              <p className="text-sm text-muted-foreground">Private staff tools for bookings and dispatch</p>
            </div>
            <div className="flex items-center gap-2">
              <form action={signOutAdmin}>
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                Alerts
              </Button>
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
