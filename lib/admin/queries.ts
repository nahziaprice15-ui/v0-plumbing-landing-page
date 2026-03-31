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
  bookingsToday: number
  pendingConfirmations: number
  inProgress: number
  completedToday: number
  cancelledToday: number
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

export type ClientSummaryRow = {
  key: string
  customerName: string
  phone: string
  email: string
  totalBookings: number
  completedBookings: number
  lastServiceDate: string | null
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

export async function getAdminBookings(): Promise<AdminBookingRow[]> {
  const db = getServiceRoleClient()
  if (!db) return []

  const { data, error } = await db
    .from('bookings')
    .select(
      'id,service_type,preferred_date,preferred_time_slot,status,created_at,customers(full_name,phone,email,address)',
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
      serviceType: String(row.service_type ?? 'other'),
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
    bookingsToday: 0,
    pendingConfirmations: 0,
    inProgress: 0,
    completedToday: 0,
    cancelledToday: 0,
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
  const sevenDayStart = subDays(new Date(), 7).toISOString()

  const [{ data: allBookings }, { data: todayBookings }, { data: funnel }] = await Promise.all([
    db.from('bookings').select('status,service_type,preferred_date,created_at'),
    db
      .from('bookings')
      .select('status,preferred_date')
      .gte('created_at', todayStart)
      .lte('created_at', todayEnd),
    db.from('booking_funnel_events').select('event_type,source_path').gte('created_at', sevenDayStart),
  ])

  const all = allBookings ?? []
  const today = todayBookings ?? []
  const funnelRows = funnel ?? []

  const bookingsToday = today.length
  const pendingConfirmations = today.filter((b) => b.status === 'pending').length
  const inProgress = today.filter((b) => b.status === 'in_progress').length
  const completedToday = today.filter((b) => b.status === 'completed').length
  const cancelledToday = today.filter((b) => b.status === 'cancelled').length

  const now = new Date()
  const plus7 = subDays(now, -7)
  const upcoming7Days = all.filter((b) => {
    if (!b.preferred_date) return false
    const d = new Date(String(b.preferred_date))
    return d >= now && d <= plus7
  }).length

  const serviceCounts = new Map<string, number>()
  for (const row of all) {
    const key = String(row.service_type ?? 'other')
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
    bookingsToday,
    pendingConfirmations,
    inProgress,
    completedToday,
    cancelledToday,
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
  const { data } = await db.from('bookings').select('service_type')
  const counts = new Map<string, number>()
  for (const row of data ?? []) {
    const key = String(row.service_type ?? 'other')
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([serviceType, bookings]) => ({ serviceType, bookings }))
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

