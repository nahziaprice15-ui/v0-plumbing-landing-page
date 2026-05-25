'use server'

import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function signInAdmin(_prevState: unknown, formData: FormData) {
  const password = (formData.get('password') as string | null) ?? ''

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Incorrect password. Try again.' }
  }

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  session.isAdmin = true
  await session.save()

  redirect('/admin/dashboard')
}
