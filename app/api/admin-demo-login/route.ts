import { NextResponse } from 'next/server'

const DEMO_ADMIN_USERNAME = 'admin'
const DEMO_ADMIN_PASSWORD = 'plumbing123'

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null)
  const username = String(formData?.get('username') ?? '').trim().toLowerCase()
  const password = String(formData?.get('password') ?? '')

  if (username !== DEMO_ADMIN_USERNAME || password !== DEMO_ADMIN_PASSWORD) {
    const badRedirect = new URL('/admin-login?error=1', request.url)
    return NextResponse.redirect(badRedirect)
  }

  const okRedirect = NextResponse.redirect(new URL('/admin/dashboard', request.url))
  okRedirect.cookies.set('admin_demo', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  })
  return okRedirect
}

