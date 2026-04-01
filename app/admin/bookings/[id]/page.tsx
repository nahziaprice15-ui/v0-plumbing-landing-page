import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdminBookingDetail, getBookingEvents } from '@/lib/admin/queries'

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'completed') return 'secondary'
  if (status === 'cancelled') return 'destructive'
  if (status === 'pending') return 'outline'
  return 'default'
}

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [detail, events] = await Promise.all([getAdminBookingDetail(id), getBookingEvents(id)])

  if (!detail) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking not found</CardTitle>
          <CardDescription>This id is missing or you do not have access.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/admin/bookings">Back to bookings</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/bookings" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Bookings
          </Link>
        </Button>
        <h2 className="text-lg font-semibold">Booking {detail.id.slice(0, 8)}</h2>
        <Badge variant={statusVariant(detail.status)}>{detail.status.replace('_', ' ')}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Confirmation {detail.confirmationCode}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Customer</p>
            <p className="font-medium">{detail.customerName}</p>
            <p className="text-sm text-muted-foreground">{detail.phone}</p>
            <p className="text-sm text-muted-foreground">{detail.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Service</p>
            <p className="font-medium">{detail.serviceTypeLabel}</p>
            <p className="text-sm text-muted-foreground">{detail.description}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">When</p>
            <p className="font-medium">
              {detail.preferredDate} · {detail.preferredTimeSlot}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="text-sm">{detail.address}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="text-sm">{detail.createdAt}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>Status changes and other booking events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="rounded-md border p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{ev.eventType}</span>
                <span className="text-xs text-muted-foreground">{ev.createdAt}</span>
              </div>
              {ev.eventType === 'status_change' && (
                <p className="mt-1 text-muted-foreground">
                  {String(ev.payload.from ?? '—')} → {String(ev.payload.to ?? '—')}
                </p>
              )}
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-sm text-muted-foreground">No events recorded yet. Events appear after status updates.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
