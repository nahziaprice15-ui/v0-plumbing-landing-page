/** Single source for NAP and site URL (use env in production). */
export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://msandpllc.com').replace(/\/$/, '')
}

export const SITE = {
  businessName: 'MS & P LLC',
  /** E.164 without spaces */
  phoneTel: '+16015690211',
  phoneDisplay: '(601) 569-0211',
  email: 'mspllc@gmail.com',
  city: 'New Orleans',
  state: 'LA',
  country: 'US',
} as const
