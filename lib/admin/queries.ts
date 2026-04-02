import { format, subDays, subHours } from 'date-fns'
import { isAdminMockDataSource } from '@/lib/admin/data-source'
import {
  getMockAdminBookingDetail,
  getMockAdminBookings,
  getMockAdminDashboardMetrics,
  getMockBookingEvents,
  getMockCatalogServicesWithDemand,
  getMockRecentBookingActivity,
  getMockServiceCategories,
  getMockServiceDemand,
} from '@/lib/admin/mock-repository'
import { getServiceRoleClient } from '@/lib/supabase/service-role'

type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export type AdminBookingRow = {
  id: string
  customerName: string
  phone: string
  email: string
  address: string
  serviceType: string
  confirmationCode: string
  preferredDate: string
  preferredTimeSlot: string
  status: BookingStatus
  createdAt: string
}

export type AdminBookingsDiagnostics = {
  dataSource: 'mock' | 'live'
  serviceRoleReady: boolean
  queryOk: boolean
  errorCode: string | null
  errorMessage: string | null
  rowCount: number
}

export type AdminBookingsResult = {
  rows: AdminBookingRow[]
  diagnostics: AdminBookingsDiagnostics
}

export type AdminDashboardMetrics = {
  /** Bookings whose `created_at` falls on the local calendar day */
  bookingsCreatedToday: number
  /** Bookings whose `preferred_date` is the local calendar day */
  bookingsScheduledToday: number
  pendingConfirmations: number
  inProgress: number
  completedScheduledToday: number
  cancelledScheduledToday: number
  upcoming7Days: number
  bookingStarts: number
  bookingSubmissions: number
  bookingConversionRate: number
  topBookedService: string
  topEntryPages: Array<{ sourcePath: string; submissions: number }>
}

export type ServiceDemandRow = {
  serviceType: string
  bookings: number
}

export type ServiceCategoryRow = {
  id: string
  slug: string
  name: string
  sortOrder: number
}

export type CatalogServiceRow = {
  id: string
  slug: string
  title: string
  categoryId: string | null
  categoryName: string | null
  durationMinutes: number
  isActive: boolean
  demandCount: number
}

export type ClientSummaryRow = {
  key: string
  customerName: string
  phone: string
  email: string
  totalBookings: number
  completedBookings: number
  lastServiceDate: string | null
}

function localDateString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

function startOfTodayIso(): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.toISOString()
}

function endOfTodayIso(): string {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return end.toISOString()
}

function asStatus(v: string): BookingStatus {
  if (
    v === 'pending' ||
    v === 'confirmed' ||
    v === 'in_progress' ||
    v === 'completed' ||
    v === 'cancelled' ||
    v === 'no_show'
  ) {
    return v
  }
  return 'pending'
}

function serviceLabelFromRow(row: {
  service_type: string | null
  service_type_id: string | null
  service_types: { title: string } | { title: string }[] | null
}): string {
  const st = Array.isArray(row.service_types) ? row.service_types[0] : row.service_types
  if (st?.title) return String(st.title)
  return String(row.service_type ?? 'other')
}

export async function getAdminBookingsResult(): Promise<AdminBookingsResult> {
  if (isAdminMockDataSource()) {
    const rows = await getMockAdminBookings()
    return {
      rows,
      diagnostics: {
        dataSource: 'mock',
        serviceRoleReady: Boolean(getServiceRoleClient()),
        queryOk: true,
        errorCode: null,
        errorMessage: null,
        rowCount: rows.length,
      },
    }
  }

  const db = getServiceRoleClient()
  if (!db) {
    return {
      rows: [],
      diagnostics: {
        dataSource: 'live',
        serviceRoleReady: false,
        queryOk: false,
        errorCode: 'SERVICE_ROLE_MISSING',
        errorMessage:
          'Service-role Supabase client is unavailable. Set SUPABASE_SERVICE_ROLE_KEY for admin live data.',
        rowCount: 0,
      },
    }
  }

  const { data, error } = await db
    .from('bookings')
    .select(
      'id,confirmation_code,service_type,service_type_id,preferred_date,preferred_time_slot,status,created_at,customers(full_name,phone,email,address),service_types(title,slug)',
    )
    .order('created_at', { ascending: false })
    .limit(200)

  if (error || !data) {
    return {
      rows: [],
      diagnostics: {
        dataSource: 'live',
        serviceRoleReady: true,
        queryOk: false,
        errorCode: error?.code ?? 'BOOKINGS_QUERY_FAILED',
        errorMessage: error?.message ?? 'Bookings query returned no data.',
        rowCount: 0,
      },
    }
  }

  const rows = data.map((row) => {
    const customer = Array.isArray(row.customers) ? row.customers[0] : row.customers
    return {
      id: String(row.id),
      customerName: String(customer?.full_name ?? 'Unknown'),
      phone: String(customer?.phone ?? '—'),
      email: String(customer?.email ?? '—'),
      address: String(customer?.address ?? '—'),
      serviceType: serviceLabelFromRow(row as Parameters<typeof serviceLabelFromRow>[0]),
      confirmationCode: String(row.confirmation_code ?? ''),
      preferredDate: String(row.preferred_date ?? ''),
      preferredTimeSlot: String(row.preferred_time_slot ?? '—'),
      status: asStatus(String(row.status ?? 'pending')),
      createdAt: String(row.created_at ?? ''),
    }
  })

  return {
    rows,
    diagnostics: {
      dataSource: 'live',
      serviceRoleReady: true,
      queryOk: true,
      errorCode: null,
      errorMessage: null,
      rowCount: rows.length,
    },
  }
}

export async function getAdminBookings(): Promise<AdminBookingRow[]> {
  const result = await getAdminBookingsResult()
  return result.rows
}

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  if (isAdminMockDataSource()) return getMockAdminDashboardMetrics()

  const db = getServiceRoleClient()
  const empty: AdminDashboardMetrics = {
    bookingsCreatedToday: 0,
    bookingsScheduledToday: 0,
    pendingConfirmations: 0,
    inProgress: 0,
    completedScheduledToday: 0,
    cancelledScheduledToday: 0,
    upcoming7Days: 0,
    bookingStarts: 0,
    bookingSubmissions: 0,
    bookingConversionRate: 0,
    topBookedService: '—',
    topEntryPages: [],
  }
  if (!db) return empty

  const todayStart = startOfTodayIso()
  const todayEnd = endOfTodayIso()
  const todayDate = localDateString()
  const sevenDayStart = subDays(new Date(), 7).toISOString()
  const now = new Date()
  const plus7 = subDays(now, -7)

  const [{ data: allBookings }, { data: funnel }] = await Promise.all([
    db
      .from('bookings')
      .select('status,service_type,service_type_id,preferred_date,created_at,service_types(title)'),
    db.from('booking_funnel_events').select('event_type,source_path').gte('created_at', sevenDayStart),
  ])

  const all = allBookings ?? []
  const funnelRows = funnel ?? []

  const bookingsCreatedToday = all.filter(
    (b) => String(b.created_at ?? '') >= todayStart && String(b.created_at ?? '') <= todayEnd,
  ).length

  const bookingsScheduledToday = all.filter((b) => String(b.preferred_date ?? '') === todayDate).length

  const pendingConfirmations = all.filter((b) => b.status === 'pending').length
  const inProgress = all.filter((b) => b.status === 'in_progress').length

  const completedScheduledToday = all.filter(
    (b) => b.status === 'completed' && String(b.preferred_date ?? '') === todayDate,
  ).length
  const cancelledScheduledToday = all.filter(
    (b) => b.status === 'cancelled' && String(b.preferred_date ?? '') === todayDate,
  ).length

  const upcoming7Days = all.filter((b) => {
    if (!b.preferred_date) return false
    const d = new Date(String(b.preferred_date))
    return d >= now && d <= plus7
  }).length

  const serviceCounts = new Map<string, number>()
  for (const row of all) {
    const key = serviceLabelFromRow(row as Parameters<typeof serviceLabelFromRow>[0])
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

export async function getServiceDemand(): Promise<ServiceDemandRow[]> {
  if (isAdminMockDataSource()) return getMockServiceDemand()

  const db = getServiceRoleClient()
  if (!db) return []
  const { data } = await db
    .from('bookings')
    .select('service_type,service_type_id,service_types(title)')
  const counts = new Map<string, number>()
  for (const row of data ?? []) {
    const key = serviceLabelFromRow(row as Parameters<typeof serviceLabelFromRow>[0])
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([serviceType, bookings]) => ({ serviceType, bookings }))
}

export async function getServiceCategories(): Promise<ServiceCategoryRow[]> {
  if (isAdminMockDataSource()) return getMockServiceCategories()

  const db = getServiceRoleClient()
  if (!db) return []
  const { data, error } = await db
    .from('service_categories')
    .select('id,slug,name,sort_order')
    .order('sort_order', { ascending: true })
  if (error || !data) return []
  return data.map((r) => ({
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    sortOrder: Number(r.sort_order ?? 0),
  }))
}

export async function getCatalogServicesWithDemand(): Promise<CatalogServiceRow[]> {
  if (isAdminMockDataSource()) return getMockCatalogServicesWithDemand()

  const db = getServiceRoleClient()
  if (!db) return []

  const [{ data: types }, { data: bookingRows }, catsResult] = await Promise.all([
    db.from('service_types').select('id,slug,title,category_id,is_active,duration_minutes').order('sort_order', {
      ascending: true,
    }),
    db.from('bookings').select('service_type,service_type_id'),
    db.from('service_categories').select('id,name'),
  ])
  const cats = catsResult.error ? [] : (catsResult.data ?? [])

  if (!types?.length) return []

  const bookings = bookingRows ?? []
  const catMap = new Map(cats.map((c) => [String(c.id), String(c.name)]))

  return types.map((t) => {
    const slug = String(t.slug)
    const categoryName = t.category_id ? catMap.get(String(t.category_id)) ?? null : null
    let demandCount = 0
    for (const b of bookings) {
      if (b.service_type_id && String(b.service_type_id) === String(t.id)) {
        demandCount += 1
        continue
      }
      if (!b.service_type_id && String(b.service_type ?? '') === slug) {
        demandCount += 1
      }
    }
    return {
      id: String(t.id),
      slug,
      title: String(t.title),
      categoryId: t.category_id ? String(t.category_id) : null,
      categoryName,
      durationMinutes: Number(t.duration_minutes ?? 60),
      isActive: Boolean(t.is_active),
      demandCount,
    }
  })
}

function clientSummariesFromBookings(bookings: AdminBookingRow[]): ClientSummaryRow[] {
  const map = new Map<string, ClientSummaryRow>()

  for (const row of bookings) {
    const key = `${row.customerName}:${row.phone}`
    const existing = map.get(key)
    if (!existing) {
      map.set(key, {
        key,
        customerName: row.customerName,
        phone: row.phone,
        email: row.email,
        totalBookings: 1,
        completedBookings: row.status === 'completed' ? 1 : 0,
        lastServiceDate: row.preferredDate || null,
      })
      continue
    }
    existing.totalBookings += 1
    if (row.status === 'completed') existing.completedBookings += 1
    if (row.preferredDate && (!existing.lastServiceDate || row.preferredDate > existing.lastServiceDate)) {
      existing.lastServiceDate = row.preferredDate
    }
  }

  return [...map.values()].sort((a, b) => b.totalBookings - a.totalBookings)
}

export async function getClientSummaries(): Promise<ClientSummaryRow[]> {
  const bookings = await getAdminBookings()
  return clientSummariesFromBookings(bookings)
}

export type BookingEventRow = {
  id: string
  eventType: string
  payload: Record<string, unknown>
  createdAt: string
}

export type AdminBookingDetail = {
  id: string
  status: BookingStatus
  confirmationCode: string
  serviceTypeLabel: string
  description: string
  preferredDate: string
  preferredTimeSlot: string
  customerName: string
  phone: string
  email: string
  address: string
  createdAt: string
}

export async function getAdminBookingDetail(bookingId: string): Promise<AdminBookingDetail | null> {
  if (isAdminMockDataSource()) return getMockAdminBookingDetail(bookingId)

  const db = getServiceRoleClient()
  if (!db) return null

  const { data, error } = await db
    .from('bookings')
    .select(
      'id,status,confirmation_code,service_type,service_type_id,description,preferred_date,preferred_time_slot,created_at,customers(full_name,phone,email,address),service_types(title,slug)',
    )
    .eq('id', bookingId)
    .maybeSingle()

  if (error || !data) return null

  const customer = Array.isArray(data.customers) ? data.customers[0] : data.customers

  return {
    id: String(data.id),
    status: asStatus(String(data.status ?? 'pending')),
    confirmationCode: String(data.confirmation_code ?? ''),
    serviceTypeLabel: serviceLabelFromRow(data as Parameters<typeof serviceLabelFromRow>[0]),
    description: String(data.description ?? ''),
    preferredDate: String(data.preferred_date ?? ''),
    preferredTimeSlot: String(data.preferred_time_slot ?? ''),
    customerName: String(customer?.full_name ?? 'Unknown'),
    phone: String(customer?.phone ?? '—'),
    email: String(customer?.email ?? '—'),
    address: String(customer?.address ?? '—'),
    createdAt: String(data.created_at ?? ''),
  }
}

export async function getBookingEvents(bookingId: string): Promise<BookingEventRow[]> {
  if (isAdminMockDataSource()) return getMockBookingEvents(bookingId)

  const db = getServiceRoleClient()
  if (!db) return []

  const { data, error } = await db
    .from('booking_events')
    .select('id,event_type,payload,created_at')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map((r) => ({
    id: String(r.id),
    eventType: String(r.event_type ?? ''),
    payload: (r.payload && typeof r.payload === 'object' ? r.payload : {}) as Record<string, unknown>,
    createdAt: String(r.created_at ?? ''),
  }))
}

export type AdminOperationalInsights = {
  /** Count of `pending` bookings whose `created_at` is older than this many hours (SLA-style backlog). */
  slaPendingThresholdHours: number
  pendingOlderThanThreshold: number
  emergencyBookingsLast30d: number
  residentialBookingsCount: number
  commercialBookingsCount: number
  /** % of bookings created in the last 7 days that ended in `no_show`. */
  noShowRate7d: number
  /** % of bookings created in the last 7 days that ended in `cancelled`. */
  cancelRate7d: number
  /** Customers (by phone) with more than one emergency-typed booking in the last 30 days. */
  repeatEmergencyCustomers30d: number
}

type OperationalBookingInput = {
  status: BookingStatus
  createdAt: string
  preferredDate: string
  phone: string
  serviceTypeLabel: string
  categorySlug: string | null
}

function inferCategorySlugFromLabel(serviceType: string): string | null {
  if (/emergency/i.test(serviceType)) return 'emergency'
  if (/commercial/i.test(serviceType)) return 'commercial'
  return 'residential'
}

function isEmergencyBooking(b: OperationalBookingInput): boolean {
  return b.categorySlug === 'emergency' || /emergency/i.test(b.serviceTypeLabel)
}

function isCommercialBooking(b: OperationalBookingInput): boolean {
  return b.categorySlug === 'commercial' || /commercial/i.test(b.serviceTypeLabel)
}

function computeOperationalInsights(
  inputs: OperationalBookingInput[],
  slaHours: number,
): AdminOperationalInsights {
  const now = new Date()
  const sevenAgo = subDays(now, 7)
  const thirtyAgo = subDays(now, 30)
  const thresholdTime = subHours(now, slaHours)

  const pendingOlderThanThreshold = inputs.filter(
    (b) => b.status === 'pending' && new Date(b.createdAt).getTime() < thresholdTime.getTime(),
  ).length

  const in30 = inputs.filter((b) => new Date(b.createdAt) >= thirtyAgo)
  const emergencyBookingsLast30d = in30.filter((b) => isEmergencyBooking(b)).length

  const residentialBookingsCount = inputs.filter((b) => !isCommercialBooking(b)).length
  const commercialBookingsCount = inputs.filter((b) => isCommercialBooking(b)).length

  const createdIn7d = inputs.filter((b) => new Date(b.createdAt) >= sevenAgo)
  const denom7 = createdIn7d.length
  const noShowRate7d =
    denom7 > 0 ? Number(((createdIn7d.filter((b) => b.status === 'no_show').length / denom7) * 100).toFixed(1)) : 0
  const cancelRate7d =
    denom7 > 0 ? Number(((createdIn7d.filter((b) => b.status === 'cancelled').length / denom7) * 100).toFixed(1)) : 0

  const emergencyIn30 = in30.filter((b) => isEmergencyBooking(b))
  const byPhone = new Map<string, number>()
  for (const b of emergencyIn30) {
    const p = b.phone.trim()
    if (!p) continue
    byPhone.set(p, (byPhone.get(p) ?? 0) + 1)
  }
  const repeatEmergencyCustomers30d = [...byPhone.values()].filter((n) => n > 1).length

  return {
    slaPendingThresholdHours: slaHours,
    pendingOlderThanThreshold,
    emergencyBookingsLast30d,
    residentialBookingsCount,
    commercialBookingsCount,
    noShowRate7d,
    cancelRate7d,
    repeatEmergencyCustomers30d,
  }
}

async function getOperationalBookingInputs(): Promise<OperationalBookingInput[]> {
  if (isAdminMockDataSource()) {
    const rows = await getAdminBookings()
    return rows.map((r) => ({
      status: r.status,
      createdAt: r.createdAt,
      preferredDate: r.preferredDate,
      phone: r.phone,
      serviceTypeLabel: r.serviceType,
      categorySlug: inferCategorySlugFromLabel(r.serviceType),
    }))
  }

  const db = getServiceRoleClient()
  if (!db) return []

  const { data, error } = await db
    .from('bookings')
    .select(
      `
      status,
      created_at,
      preferred_date,
      customers(phone),
      service_types(
        title,
        service_categories(slug)
      )
    `,
    )
    .order('created_at', { ascending: false })
    .limit(500)

  if (error || !data) return []

  return data.map((row) => {
    const customer = Array.isArray(row.customers) ? row.customers[0] : row.customers
    const st = Array.isArray(row.service_types) ? row.service_types[0] : row.service_types
    const sc = st?.service_categories as { slug?: string } | { slug?: string }[] | null | undefined
    const cat = Array.isArray(sc) ? sc[0] : sc
    const slug = cat?.slug != null ? String(cat.slug) : null
    const title = st && typeof st === 'object' && 'title' in st ? String((st as { title?: string }).title ?? '') : ''
    return {
      status: asStatus(String(row.status ?? 'pending')),
      createdAt: String(row.created_at ?? ''),
      preferredDate: String(row.preferred_date ?? ''),
      phone: String(customer?.phone ?? ''),
      serviceTypeLabel: title,
      categorySlug: slug,
    }
  })
}

export async function getAdminOperationalInsights(): Promise<AdminOperationalInsights> {
  const slaHours = 4
  const inputs = await getOperationalBookingInputs()
  return computeOperationalInsights(inputs, slaHours)
}

export type BookingActivityRow = {
  id: string
  bookingId: string
  eventType: string
  payload: Record<string, unknown>
  createdAt: string
  label: string
}

export async function getRecentBookingActivity(limit: number): Promise<BookingActivityRow[]> {
  if (isAdminMockDataSource()) {
    const rows = await getMockRecentBookingActivity(limit)
    return rows.map((r) => ({
      id: r.id,
      bookingId: r.bookingId,
      eventType: r.eventType,
      payload: r.payload,
      createdAt: r.createdAt,
      label: r.label,
    }))
  }

  const db = getServiceRoleClient()
  if (!db) return []

  const { data, error } = await db
    .from('booking_events')
    .select('id,booking_id,event_type,payload,created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []

  return data.map((r) => {
    const payload = (r.payload && typeof r.payload === 'object' ? r.payload : {}) as Record<string, unknown>
    const shortId = String(r.booking_id ?? '').slice(0, 8)
    return {
      id: String(r.id),
      bookingId: String(r.booking_id ?? ''),
      eventType: String(r.event_type ?? ''),
      payload,
      createdAt: String(r.created_at ?? ''),
      label:
        r.event_type === 'status_change'
          ? `${shortId || 'booking'} · ${String(payload.from ?? '—')} → ${String(payload.to ?? '—')}`
          : `${shortId || 'booking'} · ${String(r.event_type ?? '')}`,
    }
  })
}

export async function getBookingsForClientKey(clientKey: string): Promise<AdminBookingRow[]> {
  const decoded = decodeURIComponent(clientKey)
  const all = await getAdminBookings()
  return all
    .filter((b) => `${b.customerName}:${b.phone}` === decoded)
    .sort((a, b) => (a.preferredDate < b.preferredDate ? 1 : -1))
}
