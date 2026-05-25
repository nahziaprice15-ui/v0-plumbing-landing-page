import type {
  AdminBookingRow,
  AdminDashboardMetrics,
  ClientSummaryRow,
  ServiceDemandRow,
  ServiceCategoryRow,
} from './queries'

export const MOCK_DEMO_BOOKING_IDS = [
  'mock-001',
  'mock-002',
  'mock-003',
]

const MOCK_BOOKINGS: AdminBookingRow[] = [
  {
    id: 'mock-001',
    full_name: 'James Carter',
    phone: '(504) 555-0101',
    email: 'james@example.com',
    service_type: 'emergency',
    address: '123 Canal St, New Orleans, LA 70112',
    preferred_date: '2026-05-26',
    preferred_time: 'Morning',
    description: 'Burst pipe under kitchen sink, water everywhere',
    status: 'pending',
    notes: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-002',
    full_name: 'Maria Gonzalez',
    phone: '(504) 555-0202',
    email: null,
    service_type: 'drain',
    address: '456 Magazine St, New Orleans, LA 70115',
    preferred_date: '2026-05-27',
    preferred_time: 'Afternoon',
    description: 'Slow drain in bathroom',
    status: 'confirmed',
    notes: 'Called to confirm 10am slot',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-003',
    full_name: 'David Thompson',
    phone: '(504) 555-0303',
    email: 'david@example.com',
    service_type: 'water-heater',
    address: '789 St Charles Ave, New Orleans, LA 70130',
    preferred_date: '2026-05-25',
    preferred_time: 'Morning',
    description: 'No hot water, 8-year-old unit',
    status: 'completed',
    notes: 'Replaced 40-gal unit. Customer satisfied.',
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
]

export function getMockDashboardMetrics(): AdminDashboardMetrics {
  return {
    newBookingsToday: 2,
    pendingConfirmations: 1,
    inProgress: 0,
    completedThisMonth: 4,
    pendingSlaCount: 1,
    unreadNotifications: 1,
  }
}

export function getMockBookings(status?: string | null): AdminBookingRow[] {
  if (!status) return MOCK_BOOKINGS
  return MOCK_BOOKINGS.filter((b) => b.status === status)
}

export function getMockBookingById(id: string): AdminBookingRow | null {
  return MOCK_BOOKINGS.find((b) => b.id === id) ?? null
}

export function getMockClientSummaries(): ClientSummaryRow[] {
  return [
    {
      phone: '(504) 555-0101',
      full_name: 'James Carter',
      email: 'james@example.com',
      booking_count: 1,
      last_booking_date: MOCK_BOOKINGS[0].created_at,
      last_service_type: 'emergency',
    },
    {
      phone: '(504) 555-0202',
      full_name: 'Maria Gonzalez',
      email: null,
      booking_count: 1,
      last_booking_date: MOCK_BOOKINGS[1].created_at,
      last_service_type: 'drain',
    },
    {
      phone: '(504) 555-0303',
      full_name: 'David Thompson',
      email: 'david@example.com',
      booking_count: 1,
      last_booking_date: MOCK_BOOKINGS[2].created_at,
      last_service_type: 'water-heater',
    },
  ]
}

export function getMockServiceDemand(): ServiceDemandRow[] {
  return [
    { service_type: 'drain', total: 8, pct: 35 },
    { service_type: 'emergency', total: 6, pct: 26 },
    { service_type: 'water-heater', total: 4, pct: 17 },
    { service_type: 'leak', total: 3, pct: 13 },
    { service_type: 'installation', total: 2, pct: 9 },
  ]
}

export function getMockCategories(): ServiceCategoryRow[] {
  return [
    { id: 'cat-1', name: 'Emergency Services', slug: 'emergency', created_at: new Date().toISOString() },
    { id: 'cat-2', name: 'Maintenance', slug: 'maintenance', created_at: new Date().toISOString() },
    { id: 'cat-3', name: 'Installation', slug: 'installation', created_at: new Date().toISOString() },
  ]
}
