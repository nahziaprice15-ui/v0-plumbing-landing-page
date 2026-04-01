/**
 * Admin demo data is implemented in `lib/admin/mock-repository.ts` (same shapes as `lib/admin/queries.ts`).
 * Set server env `ADMIN_DATA_SOURCE=mock` so admin routes use the mock layer — design-only, no prod PII.
 *
 * Demo booking IDs for `/admin/bookings/[id]`: import `MOCK_DEMO_BOOKING_IDS` from `@/lib/admin/mock-repository`.
 */
export type {
  AdminBookingRow,
  AdminDashboardMetrics,
  CatalogServiceRow,
  ClientSummaryRow,
  ServiceDemandRow,
} from '@/lib/admin/queries'
export type { ServiceCategoryRow as QueryServiceCategoryRow } from '@/lib/admin/queries'
