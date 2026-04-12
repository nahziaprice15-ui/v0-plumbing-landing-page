import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { BookingStatusActionForm } from '@/components/admin/BookingStatusActionForm'
import { updateBookingStatus } from '@/app/admin/bookings/actions'
import { BOOKING_STATUS_ORDER, bookingStatusLabel, bookingStatusVariant } from '@/lib/admin/booking-status'
import { getAdminBookingsResult, type AdminBookingRow } from '@/lib/admin/queries'

const PAGE_SIZE = 20

type StatusFilter = 'all' | 'today' | AdminBookingRow['status']

function parseStatus(raw: string | undefined): StatusFilter {
  if (raw === 'all' || raw === 'today') return raw
  if (raw && BOOKING_STATUS_ORDER.includes(raw as AdminBookingRow['status'])) {
    return raw as AdminBookingRow['status']
  }
  return 'all'
}

function filterBookings(
  all: AdminBookingRow[],
  statusFilter: StatusFilter,
  q: string,
  from: string,
  to: string,
): AdminBookingRow[] {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  let rows = all

  if (statusFilter === 'today') {
    rows = rows.filter((b) => b.preferredDate === todayStr)
  } else if (statusFilter !== 'all') {
    rows = rows.filter((b) => b.status === statusFilter)
  }

  const needle = q.trim().toLowerCase()
  if (needle) {
    const digits = needle.replace(/\D/g, '')
    rows = rows.filter((b) => {
      const name = b.customerName.toLowerCase()
      const addr = b.address.toLowerCase()
      const confirmationCode = b.confirmationCode.toLowerCase()
      const phoneDigits = b.phone.replace(/\D/g, '')
      return (
        name.includes(needle) ||
        addr.includes(needle) ||
        confirmationCode.includes(needle) ||
        (digits.length > 0 && phoneDigits.includes(digits))
      )
    })
  }

  if (from.trim()) {
    rows = rows.filter((b) => b.preferredDate >= from.trim())
  }
  if (to.trim()) {
    rows = rows.filter((b) => b.preferredDate <= to.trim())
  }

  return rows
}

function buildHref(params: {
  status: string
  q?: string
  from?: string
  to?: string
  page?: number
}): string {
  const sp = new URLSearchParams()
  sp.set('status', params.status)
  if (params.q?.trim()) sp.set('q', params.q.trim())
  if (params.from?.trim()) sp.set('from', params.from.trim())
  if (params.to?.trim()) sp.set('to', params.to.trim())
  if (params.page && params.page > 1) sp.set('page', String(params.page))
  const q = sp.toString()
  return q ? `/admin/bookings?${q}` : '/admin/bookings'
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; from?: string; to?: string; page?: string }>
}) {
  const params = await searchParams
  const statusFilter = parseStatus(params.status)
  const q = params.q ?? ''
  const from = params.from ?? ''
  const to = params.to ?? ''
  const pageNum = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1)

  const { rows: all, diagnostics } = await getAdminBookingsResult()
  const filtered = filterBookings(all, statusFilter, q, from, to)
  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(pageNum, pageCount)
  const offset = (page - 1) * PAGE_SIZE
  const rows = filtered.slice(offset, offset + PAGE_SIZE)

  const tabItems: { key: string; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    ...BOOKING_STATUS_ORDER.map((s) => ({ key: s, label: bookingStatusLabel(s) })),
  ]

  const exportHref = (() => {
    const sp = new URLSearchParams()
    if (from.trim()) sp.set('from', from.trim())
    if (to.trim()) sp.set('to', to.trim())
    const qs = sp.toString()
    return qs ? `/admin/bookings/export?${qs}` : '/admin/bookings/export'
  })()

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Track and manage your pipeline from request to completion.</CardDescription>
          <p className="mt-1 text-xs text-muted-foreground">
            Data source: {diagnostics.dataSource}
            {diagnostics.liveReadMode === 'user_session' ? ' · session' : null}
            {diagnostics.liveReadMode === 'service_role' ? ' · service role' : null} (
            {diagnostics.queryOk ? 'connected' : 'issue detected'})
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={exportHref}>Export CSV</a>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <form method="get" className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="status" value={statusFilter} />
          <div className="space-y-1.5">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Name, phone, address, confirmation code"
              defaultValue={q}
              className="w-[min(100%,340px)]"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="from">From</Label>
            <Input id="from" name="from" type="date" defaultValue={from} className="w-[160px]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to">To</Label>
            <Input id="to" name="to" type="date" defaultValue={to} className="w-[160px]" />
          </div>
          <Button type="submit" size="sm">
            Apply
          </Button>
        </form>

        {!diagnostics.queryOk && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <p className="font-medium">Admin bookings data is unavailable</p>
            <p className="text-muted-foreground">
              Source: {diagnostics.dataSource}. {diagnostics.errorMessage ?? 'Unknown query failure.'}
            </p>
            {diagnostics.errorCode && (
              <p className="text-xs text-muted-foreground">Code: {diagnostics.errorCode}</p>
            )}
          </div>
        )}

        {diagnostics.queryOk && diagnostics.errorCode === 'SCHEMA_DRIFT_42703' && (
          <div className="rounded-md border border-amber-400/40 bg-amber-500/10 p-3 text-sm">
            <p className="font-medium">Schema compatibility mode enabled</p>
            <p className="text-muted-foreground">
              Source: {diagnostics.dataSource}. {diagnostics.errorMessage}
            </p>
          </div>
        )}

        {diagnostics.dataSource === 'mock' && (
          <div className="rounded-md border border-amber-400/40 bg-amber-500/10 p-3 text-sm">
            <p className="font-medium">Mock mode enabled</p>
            <p className="text-muted-foreground">
              You are viewing demo bookings. Real website submissions will not appear until live mode is enabled.
            </p>
          </div>
        )}

        {diagnostics.queryOk &&
          diagnostics.dataSource === 'live' &&
          diagnostics.liveReadMode === 'user_session' && (
            <div className="rounded-md border border-amber-400/40 bg-amber-500/10 p-3 text-sm">
              <p className="font-medium">Signed-in session mode</p>
              <p className="text-muted-foreground">
                Live bookings are loaded with your admin login because{' '}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code> is not set on
                this server. Add it for Calendly webhooks and other server jobs. The public booking form may still
                write using the anon key.
              </p>
            </div>
          )}

        <div className="flex flex-wrap gap-2">
          {tabItems.map((tab) => (
            <Button
              key={tab.key}
              variant={tab.key === statusFilter ? 'default' : 'outline'}
              size="sm"
              asChild
            >
              <a href={buildHref({ status: tab.key, q, from, to, page: 1 })}>{tab.label}</a>
            </Button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Showing {total === 0 ? 0 : offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total} (loaded up to 200 from
          server). Refine with search, confirmation code, and dates.
        </p>

        <div className="relative w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <p>{booking.customerName}</p>
                    <p className="text-xs text-muted-foreground">{booking.phone}</p>
                  </TableCell>
                  <TableCell>{booking.serviceType}</TableCell>
                  <TableCell>
                    <p>{booking.preferredDate}</p>
                    <p className="text-xs text-muted-foreground">{booking.preferredTimeSlot}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={bookingStatusVariant(booking.status)}>{bookingStatusLabel(booking.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button size="sm" variant="secondary" asChild>
                        <a href={`/admin/bookings/${booking.id}`}>View</a>
                      </Button>
                      {booking.status === 'pending' && (
                        <BookingStatusActionForm
                          action={updateBookingStatus}
                          bookingId={booking.id}
                          nextStatus="confirmed"
                          size="sm"
                          variant="outline"
                        >
                          Confirm
                        </BookingStatusActionForm>
                      )}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <BookingStatusActionForm
                          action={updateBookingStatus}
                          bookingId={booking.id}
                          nextStatus="in_progress"
                          size="sm"
                          variant="outline"
                        >
                          Start
                        </BookingStatusActionForm>
                      )}
                      {booking.status !== 'completed' && booking.status !== 'cancelled' && booking.status !== 'no_show' && (
                        <BookingStatusActionForm
                          action={updateBookingStatus}
                          bookingId={booking.id}
                          nextStatus="completed"
                          size="sm"
                        >
                          Complete
                        </BookingStatusActionForm>
                      )}
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && booking.status !== 'no_show' && (
                        <BookingStatusActionForm
                          action={updateBookingStatus}
                          bookingId={booking.id}
                          nextStatus="cancelled"
                          size="sm"
                          variant="outline"
                        >
                          Cancel
                        </BookingStatusActionForm>
                      )}
                      {booking.status !== 'no_show' && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <BookingStatusActionForm
                          action={updateBookingStatus}
                          bookingId={booking.id}
                          nextStatus="no_show"
                          size="sm"
                          variant="destructive"
                        >
                          No-show
                        </BookingStatusActionForm>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <AdminEmptyState
                      title="No bookings match"
                      description="Try All or Today, clear search, or widen the date range."
                      actionLabel="Show all"
                      actionHref="/admin/bookings?status=all"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {pageCount > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {page > 1 ? (
              <Button variant="outline" size="sm" asChild>
                <a href={buildHref({ status: statusFilter, q, from, to, page: page - 1 })}>Previous</a>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              Page {page} of {pageCount}
            </span>
            {page < pageCount ? (
              <Button variant="outline" size="sm" asChild>
                <a href={buildHref({ status: statusFilter, q, from, to, page: page + 1 })}>Next</a>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
