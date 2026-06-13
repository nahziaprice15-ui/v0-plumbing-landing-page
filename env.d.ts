declare namespace NodeJS {
  interface ProcessEnv {
    /** Public site origin for canonical URLs, sitemap, and robots (https, no trailing slash). */
    NEXT_PUBLIC_SITE_URL?: string
    AIRTABLE_TOKEN?: string | undefined
    AIRTABLE_BASE_ID?: string | undefined
    AIRTABLE_TABLE_NAME?: string | undefined
    NEXT_PUBLIC_CALENDLY_EVENT_URL?: string | undefined
    NEXT_PUBLIC_CALENDLY_PRIMARY_COLOR?: string | undefined
    NEXT_PUBLIC_CALENDLY_TEXT_COLOR?: string | undefined
    NEXT_PUBLIC_CALENDLY_BACKGROUND_COLOR?: string | undefined
    NEXT_PUBLIC_CALENDLY_HIDE_GDPR_BANNER?: '0' | '1' | undefined
    NEXT_PUBLIC_CALENDLY_USE_POPUP_FLOW?: '0' | '1' | undefined
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string | undefined
    CALENDLY_WEBHOOK_TOKEN?: string | undefined
  }
}
