'use server'

import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function signOutAdmin() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  session.destroy()
  redirect('/admin-login')
}
