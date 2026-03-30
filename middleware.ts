import { NextResponse, type NextRequest } from 'next/server'

// Used for Vercel runtime evidence: does this middleware module load?
console.warn('[middleware][debug][module] loaded')

export async function middleware(request: NextRequest) {
  // Vercel middleware runs on the Edge runtime by default. In that runtime,
  // `process` may not exist at request-time, so guard access.
  const hasProcess = typeof process !== 'undefined'
  const env = hasProcess ? process.env : undefined
  const url = env?.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = env?.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const pathname = request.nextUrl?.pathname ?? ''
  console.warn('[middleware][debug] entry reached')
  // #region agent log
  try {
    console.log('[middleware][debug]', {
      pathname,
      hasProcess,
      urlPresent: !!url,
      anonKeyPresent: !!anonKey,
    })
  } catch {}
  // #endregion
  // #region agent log
  try {
    fetch('http://127.0.0.1:7377/ingest/4534d9c7-556c-46f2-adf2-0ecaecac6578', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '4eeb0a',
      },
      body: JSON.stringify({
        sessionId: '4eeb0a',
        runId: 'pre-debug',
        hypothesisId: 'H1_process_env_access',
        location: 'middleware.ts:entry',
        message: 'middleware entry',
        data: { hasProcess, urlPresent: !!url, anonKeyPresent: !!anonKey, pathname },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
  } catch {}
  // #endregion

  // If Supabase isn't configured (common in local dev / first boot),
  // never crash middleware; just let the request through.
  if (!url || !anonKey) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next()

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

    // #region agent log
    try {
      console.log('[middleware][debug]', { pathname, stage: 'before_getUser' })
    } catch {}
    // #endregion

    // #region agent log
    try {
      fetch('http://127.0.0.1:7377/ingest/4534d9c7-556c-46f2-adf2-0ecaecac6578', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '4eeb0a',
        },
        body: JSON.stringify({
          sessionId: '4eeb0a',
          runId: 'pre-debug',
          hypothesisId: 'H2_edge_incompatible_supabase_ssr',
          location: 'middleware.ts:supabase_init',
          message: 'supabase server client created, about to call auth.getUser()',
          data: { pathname },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
    } catch {}
    // #endregion

    // Refresh session / validate auth cookie if present.
    await supabase.auth.getUser()
  } catch (err) {
    // If auth/session refresh fails, don't block page loads.
    // (We'll still allow the request through with the original cookies.)
    console.warn('[middleware][supabase]', err)
    // #region agent log
    try {
      console.warn('[middleware][debug]', {
        pathname,
        stage: 'getUser_catch',
        errorName: err instanceof Error ? err.name : typeof err,
        errorMessage: err instanceof Error ? err.message : String(err),
      })
    } catch {}
    // #endregion

    // #region agent log
    try {
      fetch('http://127.0.0.1:7377/ingest/4534d9c7-556c-46f2-adf2-0ecaecac6578', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '4eeb0a',
        },
        body: JSON.stringify({
          sessionId: '4eeb0a',
          runId: 'pre-debug',
          hypothesisId: 'H3_supabase_getUser_or_cookies_failure',
          location: 'middleware.ts:catch',
          message: 'middleware catch during supabase auth refresh',
          data: {
            pathname,
            errorName: err instanceof Error ? err.name : typeof err,
            errorMessage: err instanceof Error ? err.message : String(err),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
    } catch {}
    // #endregion
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
