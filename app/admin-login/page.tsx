import type { Metadata } from 'next'
import Link from 'next/link'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { SiteChrome } from '@/components/SiteChrome'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'Admin Access | MS & P LLC',
  description: 'Private admin access page for MS & P LLC staff.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLoginLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params.error === '1'

  return (
    <SiteChrome>
      <section className="container mx-auto max-w-2xl px-4 pb-20 pt-32">
        <Card>
          <CardHeader>
            <div className="mb-2 flex items-center gap-2 text-brand">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium">Private Staff Area</span>
            </div>
            <CardTitle className="text-2xl">Admin Portal Access</CardTitle>
            <CardDescription>
              This area is for authorized MS & P LLC admins and staff. Public visitors cannot access admin
              pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
              <p className="mb-2 font-medium text-foreground">Why it looked like nothing happened</p>
              <p>
                The admin route is protected. If you are not signed in with an admin/staff profile, it
                redirects back to the homepage.
              </p>
            </div>

            <form action="/api/admin-demo-login" method="POST" className="space-y-3 rounded-lg border p-4">
              <div className="space-y-1">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input id="username" name="username" placeholder="admin" required />
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
              {hasError && (
                <p className="text-sm text-destructive">Invalid demo credentials. Please try again.</p>
              )}
              <Button type="submit" className="w-full gap-2">
                <LockKeyhole className="h-4 w-4" />
                Continue to Admin
              </Button>
            </form>

            <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Demo credentials (temporary)</p>
              <p>Username: admin</p>
              <p>Password: plumbing123</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline">
                <Link href="/">Back to Website</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </SiteChrome>
  )
}

