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

function serviceToCategory(serviceType: string): string {
  if (serviceType.includes('emergency')) return 'Emergency'
  if (serviceType.includes('drain')) return 'Drain'
  if (serviceType.includes('water-heater')) return 'Water Heater'
  if (serviceType.includes('installation')) return 'Installation'
  if (serviceType.includes('leak')) return 'Leak Repair'
  return 'General'
}

export default async function AdminServiceCategoriesPage() {
  const demand = await getServiceDemand()
  const categoryMap = new Map<string, number>()
  for (const row of demand) {
    const category = serviceToCategory(row.serviceType)
    categoryMap.set(category, (categoryMap.get(category) ?? 0) + row.bookings)
  }
  const categories = [...categoryMap.entries()]
    .map(([name, bookings]) => ({ name, bookings }))
    .sort((a, b) => b.bookings - a.bookings)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Service Categories</CardTitle>
          <CardDescription>Organize services by category for internal operations and reporting.</CardDescription>
        </div>
        <Button>Add Category</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Total Bookings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.name}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.bookings}</TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No category data yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
