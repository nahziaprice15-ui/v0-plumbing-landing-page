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
import { getServiceDemand } from '@/lib/admin/queries'

export default async function AdminServicesPage() {
  const demand = await getServiceDemand()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Services</CardTitle>
          <CardDescription>Manage service offerings shown to dispatch and staff.</CardDescription>
        </div>
        <Button>Add Service</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Demand Rank</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demand.map((service, idx) => (
              <TableRow key={service.serviceType}>
                <TableCell className="font-medium">{service.serviceType}</TableCell>
                <TableCell>{service.bookings}</TableCell>
                <TableCell>#{idx + 1}</TableCell>
                <TableCell>
                  <Badge variant="secondary">active</Badge>
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost">
                    Archive
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {demand.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No service demand data yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
