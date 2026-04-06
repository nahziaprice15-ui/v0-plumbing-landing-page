declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    NEXT_PUBLIC_CALENDLY_EVENT_URL?: string | undefined
    NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR?: string | undefined
    NEXT_PUBLIC_CALENDLY_TEXT_COLOR?: string | undefined
    NEXT_PUBLIC_CALENDLY_BACKGROUND_COLOR?: string | undefined
    NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER?: '0' | '1' | undefined
    NEXT_PUBLIC_CALENDLY_USE_POPUP_FLOW?: '0' | '1' | undefined
    /** Server-only; optional. When set, /api/booking uses this client and bypasses RLS. */
    SUPABASE_SERVICE_ROLE_KEY?: string | undefined
  }
}
