import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Vercel middleware runs on the Edge runtime by default. In that runtime,
  // `process` may not exist at request-time, so guard access.
  const hasProcess = typeof process !== 'undefined'
  const env = hasProcess ? process.env : undefined
  const url = env?.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = env?.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase isn't configured (common in local dev / first boot),
  // never crash middleware; just let the request through.
  if (!url || !anonKey) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next()
  const isAdminRoute = /^\/admin(?:\/|$)/.test(request.nextUrl.pathname)

  try {
    // Initialize Supabase lazily inside middleware so it never runs at import/build time.
    const { createServerClient } = await import('@supabase/ssr')
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    })

    // Refresh session / validate auth cookie if present.
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (isAdminRoute) {
      if (!user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/admin-login'
        return NextResponse.redirect(redirectUrl)
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      const role = profile?.role
      const isAdmin = role === 'admin' || role === 'staff'
      if (profileError || !isAdmin) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/admin-login'
        return NextResponse.redirect(redirectUrl)
      }
    }
  } catch (err) {
    // If auth/session refresh fails, don't block page loads.
    // (We'll still allow the request through with the original cookies.)
    console.warn('[middleware][supabase]', err)
    if (isAdminRoute) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin-login'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
