import { NextResponse, type NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import type { SessionData } from '@/lib/session'
import { sessionOptions } from '@/lib/session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next()
    const session = await getIronSession<SessionData>(request, response, sessionOptions)

    if (!session.isAdmin) {
      const loginUrl = new URL('/admin-login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
