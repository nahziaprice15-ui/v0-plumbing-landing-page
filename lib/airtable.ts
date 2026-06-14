const AIRTABLE_API = 'https://api.airtable.com/v0'

export interface AirtableFields {
  Name?: string
  Email?: string
  Phone?: string
  Service?: string
  Date?: string
  Time?: string
  Notes?: string
  Status?: string
}

export interface AirtableRecord {
  id: string
  createdTime: string
  fields: AirtableFields
}

interface AirtableListResponse {
  records: AirtableRecord[]
  offset?: string
}

function cfg() {
  const token = process.env.AIRTABLE_TOKEN
  const baseId = process.env.AIRTABLE_BASE_ID
  const table = process.env.AIRTABLE_TABLE_NAME
  if (!token || !baseId || !table) throw new Error('[airtable] Missing AIRTABLE_TOKEN, AIRTABLE_BASE_ID, or AIRTABLE_TABLE_NAME')
  return { token, url: `${AIRTABLE_API}/${baseId}/${encodeURIComponent(table)}` }
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

async function throwIfError(res: Response, label: string) {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error(`[airtable] ${label}: HTTP ${res.status} — ${text || res.statusText}`)
    throw new Error(`[airtable] ${label}: HTTP ${res.status}`)
  }
}

export async function createBooking(data: {
  name: string
  email?: string | null
  phone: string
  service: string
  date?: string | null
  time?: string | null
  notes?: string | null
}): Promise<{ id: string }> {
  const { token, url } = cfg()
  const fields: AirtableFields = {
    Name: data.name,
    Phone: data.phone,
    Service: data.service,
    Status: 'pending',
  }
  if (data.email) fields.Email = data.email
  if (data.date) fields.Date = data.date
  if (data.time) fields.Time = data.time
  if (data.notes) fields.Notes = data.notes

  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ fields }),
  })
  await throwIfError(res, 'createBooking')
  const record: AirtableRecord = await res.json()
  return { id: record.id }
}

export async function listBookings(opts?: {
  status?: string | null
  phone?: string
  maxRecords?: number
}): Promise<AirtableRecord[]> {
  const { token, url } = cfg()
  const params = new URLSearchParams()
  params.set('maxRecords', String(opts?.maxRecords ?? 200))

  const filters: string[] = []
  if (opts?.status) filters.push(`{Status}="${opts.status}"`)
  if (opts?.phone) filters.push(`{Phone}="${opts.phone}"`)
  if (filters.length) params.set('filterByFormula', filters.length === 1 ? filters[0] : `AND(${filters.join(',')})`)

  const res = await fetch(`${url}?${params}`, { headers: { Authorization: `Bearer ${token}` } })
  await throwIfError(res, 'listBookings')
  const data: AirtableListResponse = await res.json()
  return data.records.sort((a, b) => b.createdTime.localeCompare(a.createdTime))
}

export async function getBookingById(id: string): Promise<AirtableRecord | null> {
  const { token, url } = cfg()
  const res = await fetch(`${url}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  if (res.status === 404) return null
  await throwIfError(res, 'getBookingById')
  return res.json()
}

export async function updateBookingStatus(id: string, status: string): Promise<void> {
  const { token, url } = cfg()
  const res = await fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ fields: { Status: status } }),
  })
  await throwIfError(res, 'updateBookingStatus')
}

export async function updateBookingNotes(id: string, notes: string): Promise<void> {
  const { token, url } = cfg()
  const res = await fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ fields: { Notes: notes } }),
  })
  await throwIfError(res, 'updateBookingNotes')
}

export async function cancelBooking(id: string): Promise<void> {
  return updateBookingStatus(id, 'cancelled')
}
