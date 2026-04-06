import { addDays, format, subDays } from 'date-fns'
import type {
  AdminBookingDetail,
  AdminBookingRow,
  AdminDashboardMetrics,
  BookingEventRow,
  CatalogServiceRow,
  ServiceCategoryRow,
  ServiceDemandRow,
} from './queries'

type MockBookingRecord = AdminBookingRow & {
  confirmationCode: string
  description: string
}

function localDateString(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

function startOfDayIso(d: Date): string {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.toISOString()
}

function endOfDayIso(d: Date): string {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x.toISOString()
}

/** Stable IDs for `/admin/bookings/[id]` deep links while `ADMIN_DATA_SOURCE=mock`. */
export const MOCK_DEMO_BOOKING_IDS = [
  'a1111111-1111-4111-8111-111111111101',
  'a1111111-1111-4111-8111-111111111102',
  'a1111111-1111-4111-8111-111111111107',
] as const

/** Rich demo dataset — emergency vs residential/commercial, no-shows, long addresses, multi-day. */
function buildMockBookingRecords(anchor: Date): MockBookingRecord[] {
  const today = localDateString(anchor)
  const y = subDays(anchor, 1)
  const yStr = localDateString(y)
  const tmr = addDays(anchor, 1)
  const tmrStr = localDateString(tmr)
  const d3 = addDays(anchor, 3)
  const d3Str = localDateString(d3)
  const d7 = addDays(anchor, 7)
  const d7Str = localDateString(d7)
  const d10 = addDays(anchor, 10)
  const d10Str = localDateString(d10)

  const isoTodayStart = startOfDayIso(anchor)
  const isoToday10 = new Date(anchor)
  isoToday10.setHours(10, 30, 0, 0)
  const isoToday14 = new Date(anchor)
  isoToday14.setHours(14, 15, 0, 0)
  const isoYesterday = subDays(anchor, 2)
  isoYesterday.setHours(16, 0, 0, 0)

  const rows: MockBookingRecord[] = [
    {
      id: 'a1111111-1111-4111-8111-111111111101',
      customerName: 'Monica Hall',
      phone: '(504) 555-1102',
      email: 'monica.hall@example.com',
      address:
        '1209 Saint Charles Ave, Unit B, New Orleans, LA 70130 — gate code 4521, dog in backyard',
      serviceType: 'Emergency Leak Repair',
      preferredDate: today,
      preferredTimeSlot: '8:00 AM - 10:00 AM',
      status: 'pending',
      createdAt: isoToday10.toISOString(),
      confirmationCode: 'MHL-9K2P',
      description: 'Active ceiling leak under upstairs bath; water spreading to dining room.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111102',
      customerName: 'David Barnes',
      phone: '(504) 555-8811',
      email: 'david.barnes@example.com',
      address: '443 Dauphine St, New Orleans, LA 70112',
      serviceType: 'Drain Cleaning',
      preferredDate: today,
      preferredTimeSlot: '10:00 AM - 12:00 PM',
      status: 'confirmed',
      createdAt: isoToday14.toISOString(),
      confirmationCode: 'DBR-7L3Q',
      description: 'Kitchen sink draining slowly; tried enzyme cleaner.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111103',
      customerName: 'Harbor Hotel Facilities',
      phone: '(504) 555-9010',
      email: 'ops@harborhotel.example.com',
      address: '918 Canal St, Loading Dock B, New Orleans, LA 70112',
      serviceType: 'Commercial Pipe Repair',
      preferredDate: today,
      preferredTimeSlot: '1:00 PM - 4:00 PM',
      status: 'in_progress',
      createdAt: subDays(anchor, 1).toISOString(),
      confirmationCode: 'HHF-4M8R',
      description: 'Main line restriction — guest floors 3–6 reporting low pressure.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111104',
      customerName: 'Inez Cooper',
      phone: '(504) 555-3011',
      email: 'inez.c@example.com',
      address: '2518 Franklin Ave, New Orleans, LA 70122',
      serviceType: 'Water Heater Service',
      preferredDate: yStr,
      preferredTimeSlot: '9:00 AM - 11:00 AM',
      status: 'completed',
      createdAt: subDays(anchor, 3).toISOString(),
      confirmationCode: 'INC-2N5S',
      description: 'Tankless flush and inspection; anode OK.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111105',
      customerName: 'Paul Ramirez',
      phone: '(504) 555-1190',
      email: 'p.ramirez@example.com',
      address: '3101 Esplanade Ave, New Orleans, LA 70119',
      serviceType: 'Fixture Installation',
      preferredDate: yStr,
      preferredTimeSlot: '2:00 PM - 4:00 PM',
      status: 'cancelled',
      createdAt: subDays(anchor, 4).toISOString(),
      confirmationCode: 'PRZ-8T1W',
      description: 'Customer rescheduled via phone — duplicate entry.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111106',
      customerName: 'Sierra Nguyen',
      phone: '(504) 555-2244',
      email: 'sierra.n@example.com',
      address: '8842 Jefferson Hwy, River Ridge, LA 70123 — long driveway, park on street',
      serviceType: 'Sewer Line Inspection',
      preferredDate: tmrStr,
      preferredTimeSlot: '8:00 AM - 12:00 PM',
      status: 'pending',
      createdAt: isoToday14.toISOString(),
      confirmationCode: 'SNG-5P9X',
      description: 'Camera scope before city permit closeout.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111107',
      customerName: 'James Okonkwo',
      phone: '(504) 555-7733',
      email: 'j.okonkwo@example.com',
      address: '1400 Oretha Castle Haley Blvd, New Orleans, LA 70113',
      serviceType: 'Emergency Leak Repair',
      preferredDate: today,
      preferredTimeSlot: '12:00 PM - 2:00 PM',
      status: 'no_show',
      createdAt: subDays(anchor, 2).toISOString(),
      confirmationCode: 'JOK-3R7Y',
      description: 'Burst hose bib — voicemail full, no answer on arrival.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111108',
      customerName: 'Lakeside Dental Group',
      phone: '(504) 555-6600',
      email: 'maintenance@lakesidedental.example.com',
      address: '3325 Severn Ave, Metairie, LA 70002, Suite 200 — after-hours access via side door',
      serviceType: 'Commercial Pipe Repair',
      preferredDate: d3Str,
      preferredTimeSlot: '5:00 PM - 8:00 PM',
      status: 'confirmed',
      createdAt: subDays(anchor, 1).toISOString(),
      confirmationCode: 'LDG-6H2Z',
      description: 'Annual backflow test + PRV check.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111109',
      customerName: 'Elena Vasquez',
      phone: '(504) 555-4488',
      email: 'elena.v@example.com',
      address: '720 Frenchmen St, New Orleans, LA 70116',
      serviceType: 'Drain Cleaning',
      preferredDate: d7Str,
      preferredTimeSlot: '10:00 AM - 12:00 PM',
      status: 'pending',
      createdAt: isoYesterday.toISOString(),
      confirmationCode: 'EVZ-1K4A',
      description: 'Tub backup — possible main line.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111110',
      customerName: 'Marcus Webb',
      phone: '(504) 555-9922',
      email: 'marcus.webb@example.com',
      address: '4500 Magazine St, New Orleans, LA 70115',
      serviceType: 'Water Heater Service',
      preferredDate: d10Str,
      preferredTimeSlot: '9:00 AM - 1:00 PM',
      status: 'confirmed',
      createdAt: subDays(anchor, 5).toISOString(),
      confirmationCode: 'MWB-9Q5B',
      description: '50 gal replacement quote accepted.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111111',
      customerName: 'Monica Hall',
      phone: '(504) 555-1102',
      email: 'monica.hall@example.com',
      address: '1209 Saint Charles Ave, Unit B, New Orleans, LA 70130',
      serviceType: 'Drain Cleaning',
      preferredDate: tmrStr,
      preferredTimeSlot: '2:00 PM - 4:00 PM',
      status: 'confirmed',
      createdAt: subDays(anchor, 6).toISOString(),
      confirmationCode: 'MHL-REPEAT',
      description: 'Follow-up from prior visit — guest bath still slow.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111112',
      customerName: 'Riverside Property Mgmt',
      phone: '(504) 555-4000',
      email: 'dispatch@riversidepm.example.com',
      address: 'Multiple: 2100+ block St Claude Ave — call site contact on arrival',
      serviceType: 'Emergency Leak Repair',
      preferredDate: today,
      preferredTimeSlot: 'ASAP',
      status: 'in_progress',
      createdAt: isoToday10.toISOString(),
      confirmationCode: 'RPM-ASAP1',
      description: 'Tenant reported flooding in 1st floor utility closet.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111113',
      customerName: 'Tanya Brooks',
      phone: '(504) 555-5511',
      email: 'tanya.brooks@example.com',
      address: '11 Harmony St, Gretna, LA 70056',
      serviceType: 'Fixture Installation',
      preferredDate: d3Str,
      preferredTimeSlot: '1:00 PM - 3:00 PM',
      status: 'pending',
      createdAt: subDays(anchor, 0).toISOString(),
      confirmationCode: 'TBK-7M2C',
      description: 'Vanity and faucet swap — customer supplied fixtures.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111114',
      customerName: 'Chris Lee',
      phone: '(504) 555-7788',
      email: 'chris.lee@example.com',
      address: '6001 St Claude Ave, New Orleans, LA 70117',
      serviceType: 'Sewer Line Inspection',
      preferredDate: yStr,
      preferredTimeSlot: '3:00 PM - 5:00 PM',
      status: 'completed',
      createdAt: subDays(anchor, 8).toISOString(),
      confirmationCode: 'CLE-4N8D',
      description: 'Scope clean — roots at 40 ft.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111115',
      customerName: 'AFI Warehouse',
      phone: '(504) 555-3200',
      email: 'facilities@afiwh.example.com',
      address: '12000 I-10 Service Rd, New Orleans, LA 70128 — security badge required',
      serviceType: 'Commercial Pipe Repair',
      preferredDate: d7Str,
      preferredTimeSlot: '6:00 AM - 10:00 AM',
      status: 'pending',
      createdAt: subDays(anchor, 2).toISOString(),
      confirmationCode: 'AFI-2W9E',
      description: 'Scheduled shutdown window with plant ops.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111116',
      customerName: 'Nina Patel',
      phone: '(504) 555-1144',
      email: 'nina.patel@example.com',
      address: '3925 General Taylor St, New Orleans, LA 70125',
      serviceType: 'Water Heater Service',
      preferredDate: today,
      preferredTimeSlot: '4:00 PM - 6:00 PM',
      status: 'confirmed',
      createdAt: isoToday14.toISOString(),
      confirmationCode: 'NPT-5Y1F',
      description: 'Pilot light won’t stay — smell of gas.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111117',
      customerName: 'Orleans Parish School Board (test)',
      phone: '(504) 555-0001',
      email: 'facilities@opschools.example.com',
      address: '2000+ line Carrollton Ave campus — building C mechanical room',
      serviceType: 'Drain Cleaning',
      preferredDate: localDateString(addDays(anchor, 14)),
      preferredTimeSlot: 'School hours only',
      status: 'pending',
      createdAt: subDays(anchor, 1).toISOString(),
      confirmationCode: 'OPS-TEST',
      description: 'Grease interceptor quarterly — mock long-lead booking.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111118',
      customerName: 'Victor Huang',
      phone: '(504) 555-6677',
      email: 'victor.h@example.com',
      address: '1524 Dublin St, New Orleans, LA 70118',
      serviceType: 'Emergency Leak Repair',
      preferredDate: tmrStr,
      preferredTimeSlot: '7:00 AM - 9:00 AM',
      status: 'pending',
      createdAt: subDays(anchor, 3).toISOString(),
      confirmationCode: 'VHG-8Z3G',
      description: 'Slab leak suspicion — thermal imaging requested.',
    },
    {
      id: 'a1111111-1111-4111-8111-111111111119',
      customerName: 'David Barnes',
      phone: '(504) 555-8811',
      email: 'david.barnes@example.com',
      address: '443 Dauphine St, New Orleans, LA 70112',
      serviceType: 'Water Heater Service',
      preferredDate: d3Str,
      preferredTimeSlot: '11:00 AM - 1:00 PM',
      status: 'cancelled',
      createdAt: subDays(anchor, 7).toISOString(),
      confirmationCode: 'DBR-CAN1',
      description: 'Cancelled — found alternate vendor (mock).',
    },
  ]

  return rows
}

type FunnelRow = { event_type: string; source_path: string | null }

function buildMockFunnelRows(anchor: Date): FunnelRow[] {
  const paths = ['/', '/services', '/services/drain-cleaning', '/contact', '/book', '/emergency']
  const rows: FunnelRow[] = []
  let i = 0
  for (let d = 0; d < 7; d++) {
    const day = subDays(anchor, d)
    for (let s = 0; s < 12; s++) {
      const path = paths[i % paths.length]
      i++
      rows.push({ event_type: 'start', source_path: path })
      if (s % 3 !== 0) {
        rows.push({ event_type: 'submit', source_path: path })
      }
    }
  }
  return rows
}

function serviceLabelFromMock(row: { serviceType: string }): string {
  return row.serviceType
}

function computeDashboardMetrics(
  all: MockBookingRecord[],
  funnelRows: FunnelRow[],
  anchor: Date,
): AdminDashboardMetrics {
  const todayStart = startOfDayIso(anchor)
  const todayEnd = endOfDayIso(anchor)
  const todayDate = localDateString(anchor)
  const now = anchor
  const plus7 = addDays(anchor, 7)

  const bookingsCreatedToday = all.filter(
    (b) => String(b.createdAt ?? '') >= todayStart && String(b.createdAt ?? '') <= todayEnd,
  ).length

  const bookingsScheduledToday = all.filter((b) => String(b.preferredDate ?? '') === todayDate).length

  const pendingConfirmations = all.filter((b) => b.status === 'pending').length
  const inProgress = all.filter((b) => b.status === 'in_progress').length

  const completedScheduledToday = all.filter(
    (b) => b.status === 'completed' && String(b.preferredDate ?? '') === todayDate,
  ).length
  const cancelledScheduledToday = all.filter(
    (b) => b.status === 'cancelled' && String(b.preferredDate ?? '') === todayDate,
  ).length

  const upcoming7Days = all.filter((b) => {
    if (!b.preferredDate) return false
    const d = new Date(String(b.preferredDate))
    return d >= now && d <= plus7
  }).length

  const serviceCounts = new Map<string, number>()
  for (const row of all) {
    const key = serviceLabelFromMock(row)
    serviceCounts.set(key, (serviceCounts.get(key) ?? 0) + 1)
  }
  const topBookedService =
    [...serviceCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

  const bookingStarts = funnelRows.filter((r) => r.event_type === 'start').length
  const bookingSubmissions = funnelRows.filter((r) => r.event_type === 'submit').length
  const bookingConversionRate =
    bookingStarts > 0 ? Number(((bookingSubmissions / bookingStarts) * 100).toFixed(1)) : 0

  const pathCounts = new Map<string, number>()
  for (const row of funnelRows) {
    if (row.event_type !== 'submit') continue
    const path = String(row.source_path ?? '/')
    pathCounts.set(path, (pathCounts.get(path) ?? 0) + 1)
  }
  const topEntryPages = [...pathCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sourcePath, submissions]) => ({ sourcePath, submissions }))

  return {
    bookingsCreatedToday,
    bookingsScheduledToday,
    pendingConfirmations,
    inProgress,
    completedScheduledToday,
    cancelledScheduledToday,
    upcoming7Days,
    bookingStarts,
    bookingSubmissions,
    bookingConversionRate,
    topBookedService,
    topEntryPages,
  }
}

const MOCK_CATEGORIES: ServiceCategoryRow[] = [
  { id: 'cat-emergency', slug: 'emergency', name: 'Emergency', sortOrder: 0 },
  { id: 'cat-residential', slug: 'residential', name: 'Residential', sortOrder: 1 },
  { id: 'cat-commercial', slug: 'commercial', name: 'Commercial', sortOrder: 2 },
]

const CATALOG_BY_TITLE: Record<
  string,
  { id: string; slug: string; categoryId: string | null; durationMinutes: number; isActive: boolean }
> = {
  'Emergency Leak Repair': {
    id: 'svc-em-leak',
    slug: 'emergency-leak-repair',
    categoryId: 'cat-emergency',
    durationMinutes: 90,
    isActive: true,
  },
  'Drain Cleaning': {
    id: 'svc-drain',
    slug: 'drain-cleaning',
    categoryId: 'cat-residential',
    durationMinutes: 60,
    isActive: true,
  },
  'Water Heater Service': {
    id: 'svc-wh',
    slug: 'water-heater-service',
    categoryId: 'cat-residential',
    durationMinutes: 120,
    isActive: true,
  },
  'Commercial Pipe Repair': {
    id: 'svc-com-pipe',
    slug: 'commercial-pipe-repair',
    categoryId: 'cat-commercial',
    durationMinutes: 180,
    isActive: true,
  },
  'Fixture Installation': {
    id: 'svc-fixture',
    slug: 'fixture-installation',
    categoryId: 'cat-residential',
    durationMinutes: 90,
    isActive: false,
  },
  'Sewer Line Inspection': {
    id: 'svc-sewer',
    slug: 'sewer-line-inspection',
    categoryId: 'cat-residential',
    durationMinutes: 120,
    isActive: true,
  },
}

function catalogRowsFromBookings(bookings: MockBookingRecord[]): CatalogServiceRow[] {
  const catMap = new Map(MOCK_CATEGORIES.map((c) => [c.id, c.name]))
  const titles = [...new Set(bookings.map((b) => b.serviceType))]
  const allTitles = [...new Set([...Object.keys(CATALOG_BY_TITLE), ...titles])]

  return allTitles.map((title) => {
    const meta = CATALOG_BY_TITLE[title] ?? {
      id: `svc-${title.toLowerCase().replace(/\s+/g, '-')}`,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      categoryId: 'cat-residential',
      durationMinutes: 60,
      isActive: true,
    }
    const categoryName = meta.categoryId ? catMap.get(meta.categoryId) ?? null : null
    let demandCount = 0
    for (const b of bookings) {
      if (b.serviceType === title) demandCount += 1
    }
    return {
      id: meta.id,
      slug: meta.slug,
      title,
      categoryId: meta.categoryId,
      categoryName,
      durationMinutes: meta.durationMinutes,
      isActive: meta.isActive,
      demandCount,
    }
  })
}

function mockEventsForBooking(bookingId: string): BookingEventRow[] {
  const base = new Date()
  return [
    {
      id: `${bookingId}-ev1`,
      eventType: 'created',
      payload: { source: 'mock' },
      createdAt: subDays(base, 2).toISOString(),
    },
    {
      id: `${bookingId}-ev2`,
      eventType: 'status_change',
      payload: { from: 'pending', to: 'confirmed' },
      createdAt: subDays(base, 1).toISOString(),
    },
    {
      id: `${bookingId}-ev3`,
      eventType: 'note',
      payload: { text: 'Dispatcher: customer prefers text updates.' },
      createdAt: base.toISOString(),
    },
  ]
}

function stripBookingRow(r: MockBookingRecord): AdminBookingRow {
  return {
    id: r.id,
    customerName: r.customerName,
    phone: r.phone,
    email: r.email,
    address: r.address,
    serviceType: r.serviceType,
    confirmationCode: r.confirmationCode,
    preferredDate: r.preferredDate,
    preferredTimeSlot: r.preferredTimeSlot,
    status: r.status,
    createdAt: r.createdAt,
  }
}

/** In-memory overrides when `ADMIN_DATA_SOURCE=mock` (same Node process only). */
const mockBookingStatusById = new Map<string, AdminBookingRow['status']>()

/** Apply a status change for demo bookings; returns false if id is not in the mock dataset. */
export function applyMockBookingStatus(bookingId: string, status: AdminBookingRow['status']): boolean {
  const anchor = new Date()
  const exists = buildMockBookingRecords(anchor).some((b) => b.id === bookingId)
  if (!exists) return false
  mockBookingStatusById.set(bookingId, status)
  return true
}

function statusWithMockOverride(
  bookingId: string,
  base: AdminBookingRow['status'],
): AdminBookingRow['status'] {
  return mockBookingStatusById.get(bookingId) ?? base
}

export async function getMockAdminBookings(): Promise<AdminBookingRow[]> {
  const anchor = new Date()
  return buildMockBookingRecords(anchor).map((r) =>
    stripBookingRow({
      ...r,
      status: statusWithMockOverride(r.id, r.status),
    }),
  )
}

export async function getMockAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const anchor = new Date()
  const all = buildMockBookingRecords(anchor)
  const funnel = buildMockFunnelRows(anchor)
  return computeDashboardMetrics(all, funnel, anchor)
}

export async function getMockServiceDemand(): Promise<ServiceDemandRow[]> {
  const anchor = new Date()
  const all = buildMockBookingRecords(anchor)
  const counts = new Map<string, number>()
  for (const row of all) {
    const key = serviceLabelFromMock(row)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([serviceType, bookings]) => ({ serviceType, bookings }))
}

export async function getMockServiceCategories(): Promise<ServiceCategoryRow[]> {
  return MOCK_CATEGORIES.map((c) => ({ ...c }))
}

export async function getMockCatalogServicesWithDemand(): Promise<CatalogServiceRow[]> {
  const anchor = new Date()
  const bookings = buildMockBookingRecords(anchor)
  return catalogRowsFromBookings(bookings).sort((a, b) => a.title.localeCompare(b.title))
}

export async function getMockAdminBookingDetail(bookingId: string): Promise<AdminBookingDetail | null> {
  const anchor = new Date()
  const row = buildMockBookingRecords(anchor).find((b) => b.id === bookingId)
  if (!row) return null
  return {
    id: row.id,
    status: statusWithMockOverride(row.id, row.status),
    confirmationCode: row.confirmationCode,
    serviceTypeLabel: row.serviceType,
    description: row.description,
    preferredDate: row.preferredDate,
    preferredTimeSlot: row.preferredTimeSlot,
    customerName: row.customerName,
    phone: row.phone,
    email: row.email,
    address: row.address,
    createdAt: row.createdAt,
  }
}

export async function getMockBookingEvents(bookingId: string): Promise<BookingEventRow[]> {
  const anchor = new Date()
  const exists = buildMockBookingRecords(anchor).some((b) => b.id === bookingId)
  if (!exists) return []
  return mockEventsForBooking(bookingId)
}

export type MockBookingActivityRow = {
  id: string
  bookingId: string
  eventType: string
  payload: Record<string, unknown>
  createdAt: string
  label: string
}

/** Demo activity feed rows (no DB). */
export async function getMockRecentBookingActivity(limit: number): Promise<MockBookingActivityRow[]> {
  const anchor = new Date()
  const bookings = buildMockBookingRecords(anchor)
  const base = subDays(anchor, 0)
  const rows: MockBookingActivityRow[] = []
  let i = 0
  for (const b of bookings.slice(0, 8)) {
    rows.push({
      id: `mock-act-${i++}`,
      bookingId: b.id,
      eventType: 'status_change',
      payload: { from: 'pending', to: b.status },
      createdAt: subDays(base, i % 3).toISOString(),
      label: `${b.customerName} · ${b.status}`,
    })
  }
  rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  return rows.slice(0, limit)
}
