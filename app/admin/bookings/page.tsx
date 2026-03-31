import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getAdminBookings, type AdminBookingRow } from '@/lib/admin/queries'
import { updateBookingStatus } from '@/app/admin/bookings/actions'

type BookingStatus = AdminBookingRow['status']

function statusVariant(status: BookingStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'completed') return 'secondary'
  if (status === 'cancelled') return 'destructive'
  if (status === 'pending') return 'outline'
  return 'default'
}

const statuses: BookingStatus[] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const all = await getAdminBookings()
  const statusFilter = statuses.includes(params.status as BookingStatus)
    ? (params.status as BookingStatus)
    : 'pending'
  const rows = all.filter((booking) => booking.status === statusFilter)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>Track and manage your pipeline from request to completion.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={status === statusFilter ? 'default' : 'outline'}
              size="sm"
              asChild
            >
              <a href={`/admin/bookings?status=${status}`}>{status.replace('_', ' ')}</a>
            </Button>
          ))}
        </div>

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
                  <Badge variant={statusVariant(booking.status)}>{booking.status.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button size="sm" variant="secondary" asChild>
                      <a href={`/admin/bookings/${booking.id}`}>View</a>
                    </Button>
                    {booking.status !== 'confirmed' && (
                      <form action={updateBookingStatus}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="status" value="confirmed" />
                        <Button size="sm" variant="outline" type="submit">
                          Confirm
                        </Button>
                      </form>
                    )}
                    {booking.status !== 'in_progress' && (
                      <form action={updateBookingStatus}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="status" value="in_progress" />
                        <Button size="sm" variant="outline" type="submit">
                          Start
                        </Button>
                      </form>
                    )}
                    {booking.status !== 'completed' && (
                      <form action={updateBookingStatus}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="status" value="completed" />
                        <Button size="sm" type="submit">
                          Complete
                        </Button>
                      </form>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No bookings in this status.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
