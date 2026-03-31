import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/AdminShell'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Admin | MS & P LLC',
  description: 'Private admin tools for MS & P LLC operations and dispatch.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    redirect('/')
  }

  return <AdminShell>{children}</AdminShell>
}
