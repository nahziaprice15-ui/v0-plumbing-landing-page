'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) {
    redirect('/admin-login?error=1')
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      redirect('/admin-login?error=1')
    }
  } catch (err) {
    // Re-throw Next.js redirect errors — they must propagate to work correctly.
    if ((err as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) throw err
    // Any other error (Supabase config missing, network failure, etc.) → show login error.
    redirect('/admin-login?error=1')
  }

  redirect('/admin/dashboard')
}
