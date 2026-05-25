'use client'

import { useActionState } from 'react'
import { BrandLogo } from '@/components/BrandLogo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInAdmin } from './actions'
import { AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(signInAdmin, null)

  return (
    <div className="min-h-screen bg-[#eef2f8] flex flex-col">
      <header className="bg-[#0b3a62] py-4 px-6 flex justify-center">
        <BrandLogo size="nav" />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-[#0b3a62]">Admin Portal</h1>
            <p className="text-sm text-muted-foreground">MS &amp; P LLC — staff only</p>
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter admin password"
              />
            </div>

            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-[#c81e2d] hover:bg-[#a8181f] text-white"
            >
              {pending ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
