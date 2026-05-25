import { supabase } from '@/lib/supabase'

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export interface AdminBookingRow {
  id: string
  full_name: string
  phone: string
  email: string | null
  service_type: string
  address: string
  preferred_date: string | null
  preferred_time: string | null
  description: string | null
  status: BookingStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AdminDashboardMetrics {
  newBookingsToday: number
  pendingConfirmations: number
  inProgress: number
  completedThisMonth: number
  pendingSlaCount: number
  unreadNotifications: number
}

export interface ClientSummaryRow {
  phone: string
  full_name: string
  email: string | null
  booking_count: number
  last_booking_date: string | null
  last_service_type: string | null
}

export interface ServiceDemandRow {
  service_type: string
  total: number
  pct: number
}

export interface CatalogServiceRow {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  active: boolean
  created_at: string
}

export interface ServiceCategoryRow {
  id: string
  name: string
  slug: string
  created_at: string
}

// ── Bookings ─────────────────────────────────────────────────────────────────

export async function getAdminBookings(opts?: {
  status?: BookingStatus | null
  limit?: number
  offset?: number
}): Promise<AdminBookingRow[]> {
  let q = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(opts?.limit ?? 100)

  if (opts?.offset) q = q.range(opts.offset, opts.offset + (opts.limit ?? 100) - 1)
  if (opts?.status) q = q.eq('status', opts.status)

  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminBookingRow[]
}

export async function getAdminBookingById(id: string): Promise<AdminBookingRow | null> {
  const { data, error } = await supabase.from('bookings').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data as AdminBookingRow | null
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function updateBookingNotes(id: string, notes: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ notes, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getTodayBookings(): Promise<AdminBookingRow[]> {
  const today = new Date().toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .or(`preferred_date.eq.${today},created_at.gte.${today}T00:00:00`)
    .order('preferred_time', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminBookingRow[]
}

// ── Dashboard metrics ─────────────────────────────────────────────────────────

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const slaThreshold = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()

  const [todayRes, pendingRes, inProgressRes, completedRes, slaRes] = await Promise.all([
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', `${todayStr}T00:00:00`),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'in_progress'),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('updated_at', `${monthStart}T00:00:00`),
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .lte('created_at', slaThreshold),
  ])

  return {
    newBookingsToday: todayRes.count ?? 0,
    pendingConfirmations: pendingRes.count ?? 0,
    inProgress: inProgressRes.count ?? 0,
    completedThisMonth: completedRes.count ?? 0,
    pendingSlaCount: slaRes.count ?? 0,
    unreadNotifications: slaRes.count ?? 0,
  }
}

export async function getAdminOperationalInsights() {
  const slaPendingThresholdHours = 4
  const slaThreshold = new Date(Date.now() - slaPendingThresholdHours * 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')
    .lte('created_at', slaThreshold)
  return { slaPendingThresholdHours, pendingOlderThanThreshold: count ?? 0 }
}

// ── Clients ───────────────────────────────────────────────────────────────────

export async function getClientSummaries(): Promise<ClientSummaryRow[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('phone, full_name, email, service_type, created_at')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)

  const byPhone = new Map<string, ClientSummaryRow>()
  for (const row of data ?? []) {
    const existing = byPhone.get(row.phone)
    if (!existing) {
      byPhone.set(row.phone, {
        phone: row.phone,
        full_name: row.full_name,
        email: row.email,
        booking_count: 1,
        last_booking_date: row.created_at,
        last_service_type: row.service_type,
      })
    } else {
      existing.booking_count++
    }
  }
  return Array.from(byPhone.values())
}

export async function getClientBookings(phone: string): Promise<AdminBookingRow[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminBookingRow[]
}

// ── Service demand ────────────────────────────────────────────────────────────

export async function getServiceDemand(days = 30): Promise<ServiceDemandRow[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('bookings')
    .select('service_type')
    .gte('created_at', since)
  if (error) throw new Error(error.message)

  const counts = new Map<string, number>()
  for (const row of data ?? []) {
    counts.set(row.service_type, (counts.get(row.service_type) ?? 0) + 1)
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([service_type, count]) => ({
      service_type,
      total: count,
      pct: Math.round((count / total) * 100),
    }))
}

// ── Notifications ─────────────────────────────────────────────────────────────

export async function getPendingSlabookings(thresholdHours = 4): Promise<AdminBookingRow[]> {
  const cutoff = new Date(Date.now() - thresholdHours * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'pending')
    .lte('created_at', cutoff)
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminBookingRow[]
}
