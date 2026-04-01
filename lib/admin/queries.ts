import { format } from 'date-fns'
import { subDays } from 'date-fns'
import { getServiceRoleClient } from '@/lib/supabase/service-role'

type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export type AdminBookingRow = {
  id: string
  customerName: string
  phone: string
  email: string
  address: string
  serviceType: string
  preferredDate: string
  preferredTimeSlot: string
  status: BookingStatus
  createdAt: string
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

export async function getAdminBookings(): Promise<AdminBookingRow[]> {
  const db = getServiceRoleClient()
  if (!db) return []

  const { data, error } = await db
    .from('bookings')
    .select(
      'id,service_type,service_type_id,preferred_date,preferred_time_slot,status,created_at,customers(full_name,phone,email,address),service_types(title,slug)',
    )
    .order('created_at', { ascending: false })
    .limit(200)

  if (error || !data) return []

  return data.map((row) => {
    const customer = Array.isArray(row.customers) ? row.customers[0] : row.customers
    return {
      id: String(row.id),
      customerName: String(customer?.full_name ?? 'Unknown'),
      phone: String(customer?.phone ?? '—'),
      email: String(customer?.email ?? '—'),
      address: String(customer?.address ?? '—'),
      serviceType: serviceLabelFromRow(row as Parameters<typeof serviceLabelFromRow>[0]),
      preferredDate: String(row.preferred_date ?? ''),
      preferredTimeSlot: String(row.preferred_time_slot ?? '—'),
      status: asStatus(String(row.status ?? 'pending')),
      createdAt: String(row.created_at ?? ''),
    }
  })
}

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
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

export async function getClientSummaries(): Promise<ClientSummaryRow[]> {
  const bookings = await getAdminBookings()
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
