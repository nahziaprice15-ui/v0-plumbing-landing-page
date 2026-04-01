import Link from 'next/link'
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
import { Badge } from '@/components/ui/badge'
import { getClientSummaries } from '@/lib/admin/queries'

export default async function AdminClientsPage() {
  const clients = await getClientSummaries()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients</CardTitle>
        <CardDescription>Customers derived from booking history and contact records.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Total Bookings</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Service</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.key}>
                <TableCell className="font-medium">{client.customerName}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.totalBookings}</TableCell>
                <TableCell>
                  <Badge variant={client.totalBookings > 1 ? 'secondary' : 'outline'}>
                    {client.totalBookings > 1 ? 'returning' : 'new'}
                  </Badge>
                </TableCell>
                <TableCell>{client.lastServiceDate ?? '—'}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/clients/${encodeURIComponent(client.key)}`}>Profile</Link>
                  </Button>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/admin/clients/${encodeURIComponent(client.key)}`}>History</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No client records available yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
