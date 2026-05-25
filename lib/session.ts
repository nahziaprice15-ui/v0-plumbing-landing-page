import type { SessionOptions } from 'iron-session'

export type SessionData = {
  isAdmin?: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.ADMIN_SESSION_SECRET ?? 'fallback-secret-change-this-in-production-32ch',
  cookieName: 'msp-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
  },
}
