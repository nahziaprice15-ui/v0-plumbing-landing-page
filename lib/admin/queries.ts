import {
  listBookings,
  getBookingById,
  updateBookingStatus as airtableUpdateStatus,
  updateBookingNotes as airtableUpdateNotes,
} from '@/lib/airtable'
import type { AirtableRecord } from '@/lib/airtable'

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

function toRow(record: AirtableRecord): AdminBookingRow {
  const f = record.fields
  return {
    id: record.id,
    full_name: f.Name ?? '',
    phone: f.Phone ?? '',
    email: f.Email ?? null,
    service_type: f.Service ?? '',
    address: '',
    preferred_date: f.Date ?? null,
    preferred_time: f.Time ?? null,
    description: f.Notes ?? null,
    status: (f.Status ?? 'pending') as BookingStatus,
    notes: f.Notes ?? null,
    created_at: record.createdTime,
    updated_at: record.createdTime,
  }
}

// ── Bookings ─────────────────────────────────────────────────────────────────

export async function getAdminBookings(opts?: {
  status?: BookingStatus | null
  limit?: number
  offset?: number
}): Promise<AdminBookingRow[]> {
  try {
    const records = await listBookings({ status: opts?.status, maxRecords: opts?.limit ?? 100 })
    return records.map(toRow)
  } catch (err) {
    console.error('[getAdminBookings]', err)
    return []
  }
}

export async function getAdminBookingById(id: string): Promise<AdminBookingRow | null> {
  try {
    const record = await getBookingById(id)
    return record ? toRow(record) : null
  } catch (err) {
    console.error('[getAdminBookingById]', err)
    return null
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  await airtableUpdateStatus(id, status)
}

export async function updateBookingNotes(id: string, notes: string): Promise<void> {
  await airtableUpdateNotes(id, notes)
}

export async function getTodayBookings(): Promise<AdminBookingRow[]> {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const records = await listBookings({ maxRecords: 200 })
    return records
      .filter(r => r.createdTime.startsWith(today) || r.fields.Date === today)
      .sort((a, b) => (a.fields.Time ?? '').localeCompare(b.fields.Time ?? ''))
      .map(toRow)
  } catch (err) {
    console.error('[getTodayBookings]', err)
    return []
  }
}

// ── Dashboard metrics ─────────────────────────────────────────────────────────

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  try {
    const all = await listBookings({ maxRecords: 500 })
    const today = new Date().toISOString().slice(0, 10)
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const slaThreshold = new Date(Date.now() - 4 * 60 * 60 * 1000)

    const slaCount = all.filter(
      r => r.fields.Status === 'pending' && new Date(r.createdTime) <= slaThreshold,
    ).length

    return {
      newBookingsToday: all.filter(r => r.createdTime.startsWith(today)).length,
      pendingConfirmations: all.filter(r => r.fields.Status === 'pending').length,
      inProgress: all.filter(r => r.fields.Status === 'in_progress').length,
      completedThisMonth: all.filter(
        r => r.fields.Status === 'completed' && r.createdTime >= monthStart,
      ).length,
      pendingSlaCount: slaCount,
      unreadNotifications: slaCount,
    }
  } catch (err) {
    console.error('[getAdminDashboardMetrics]', err)
    return { newBookingsToday: 0, pendingConfirmations: 0, inProgress: 0, completedThisMonth: 0, pendingSlaCount: 0, unreadNotifications: 0 }
  }
}

export async function getAdminOperationalInsights() {
  const slaPendingThresholdHours = 4
  try {
    const slaThreshold = new Date(Date.now() - slaPendingThresholdHours * 60 * 60 * 1000)
    const records = await listBookings({ status: 'pending', maxRecords: 200 })
    const count = records.filter(r => new Date(r.createdTime) <= slaThreshold).length
    return { slaPendingThresholdHours, pendingOlderThanThreshold: count }
  } catch (err) {
    console.error('[getAdminOperationalInsights]', err)
    return { slaPendingThresholdHours, pendingOlderThanThreshold: 0 }
  }
}

// ── Clients ───────────────────────────────────────────────────────────────────

export async function getClientSummaries(): Promise<ClientSummaryRow[]> {
  try {
    const records = await listBookings({ maxRecords: 500 })
    const byPhone = new Map<string, ClientSummaryRow>()
    for (const r of records) {
      const phone = r.fields.Phone ?? ''
      const existing = byPhone.get(phone)
      if (!existing) {
        byPhone.set(phone, {
          phone,
          full_name: r.fields.Name ?? '',
          email: r.fields.Email ?? null,
          booking_count: 1,
          last_booking_date: r.createdTime,
          last_service_type: r.fields.Service ?? null,
        })
      } else {
        existing.booking_count++
      }
    }
    return Array.from(byPhone.values())
  } catch (err) {
    console.error('[getClientSummaries]', err)
    return []
  }
}

export async function getClientBookings(phone: string): Promise<AdminBookingRow[]> {
  try {
    const records = await listBookings({ phone, maxRecords: 100 })
    return records.map(toRow)
  } catch (err) {
    console.error('[getClientBookings]', err)
    return []
  }
}

// ── Service demand ────────────────────────────────────────────────────────────

export async function getServiceDemand(days = 30): Promise<ServiceDemandRow[]> {
  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const records = await listBookings({ maxRecords: 500 })
    const filtered = records.filter(r => new Date(r.createdTime) >= since)

    const counts = new Map<string, number>()
    for (const r of filtered) {
      const s = r.fields.Service ?? 'Unknown'
      counts.set(s, (counts.get(s) ?? 0) + 1)
    }
    const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([service_type, count]) => ({
        service_type,
        total: count,
        pct: Math.round((count / total) * 100),
      }))
  } catch (err) {
    console.error('[getServiceDemand]', err)
    return []
  }
}

// ── Notifications ─────────────────────────────────────────────────────────────

export async function getPendingSlabookings(thresholdHours = 4): Promise<AdminBookingRow[]> {
  try {
    const cutoff = new Date(Date.now() - thresholdHours * 60 * 60 * 1000)
    const records = await listBookings({ status: 'pending', maxRecords: 200 })
    return records
      .filter(r => new Date(r.createdTime) <= cutoff)
      .sort((a, b) => a.createdTime.localeCompare(b.createdTime))
      .map(toRow)
  } catch (err) {
    console.error('[getPendingSlabookings]', err)
    return []
  }
}
