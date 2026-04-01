/**
 * When `ADMIN_DATA_SOURCE=mock` or `NEXT_PUBLIC_ADMIN_MOCK=1`, admin server queries
 * use `mock-repository` data (design / demos only — no production PII).
 */
export function isAdminMockDataSource(): boolean {
  if (process.env.ADMIN_DATA_SOURCE === 'mock') return true
  if (process.env.NEXT_PUBLIC_ADMIN_MOCK === '1') return true
  return false
}
