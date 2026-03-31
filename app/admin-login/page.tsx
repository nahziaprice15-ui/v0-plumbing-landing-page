import type { Metadata } from 'next'
import Link from 'next/link'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { signInAdmin } from '@/app/admin-login/actions'
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
              Sign in with a Supabase account that has an admin or staff profile in the database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
              <p className="mb-2 font-medium text-foreground">Access requirements</p>
              <p>
                The admin area is restricted to users whose <code className="text-xs">profiles.role</code> is{' '}
                <code className="text-xs">admin</code> or <code className="text-xs">staff</code>. Promote your
                user in Supabase (SQL or dashboard) after the first sign-up.
              </p>
            </div>

            <form action={signInAdmin} className="space-y-3 rounded-lg border p-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input id="password" name="password" type="password" autoComplete="current-password" required />
              </div>
              {hasError && (
                <p className="text-sm text-destructive">Could not sign in. Check your email and password.</p>
              )}
              <Button type="submit" className="w-full gap-2">
                <LockKeyhole className="h-4 w-4" />
                Sign in
              </Button>
            </form>

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
