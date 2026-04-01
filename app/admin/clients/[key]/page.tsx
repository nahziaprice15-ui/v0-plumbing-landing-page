import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
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
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { bookingStatusLabel, bookingStatusVariant } from '@/lib/admin/booking-status'
import { getBookingsForClientKey, getClientSummaries } from '@/lib/admin/queries'

export default async function AdminClientDetailPage({ params }: { params: Promise<{ key: string }> }) {
  const { key: rawKey } = await params
  const key = decodeURIComponent(rawKey)
  const summaries = await getClientSummaries()
  const summary = summaries.find((c) => c.key === key)
  const rows = await getBookingsForClientKey(key)

  if (!summary && rows.length === 0) {
    notFound()
  }

  const displayName = summary?.customerName ?? rows[0]?.customerName ?? 'Client'
  const vip = (summary?.totalBookings ?? rows.length) > 3

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/clients" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Clients
          </Link>
        </Button>
        <h2 className="text-lg font-semibold">{displayName}</h2>
        {vip ? <Badge variant="secondary">VIP</Badge> : null}
        {summary && summary.totalBookings > 1 ? (
          <Badge variant="outline">Returning</Badge>
        ) : (
          <Badge variant="outline">New</Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>From latest booking records.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="font-medium">{summary?.phone ?? rows[0]?.phone ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-medium">{summary?.email ?? rows[0]?.email ?? '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking history</CardTitle>
          <CardDescription>All jobs for this customer key (name + phone).</CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <AdminEmptyState title="No bookings" description="This client has no booking rows in the current dataset." />
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"> </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <p>{b.preferredDate}</p>
                        <p className="text-xs text-muted-foreground">{b.preferredTimeSlot}</p>
                      </TableCell>
                      <TableCell>{b.serviceType}</TableCell>
                      <TableCell>
                        <Badge variant={bookingStatusVariant(b.status)}>{bookingStatusLabel(b.status)}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/bookings/${b.id}`}>Open</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
