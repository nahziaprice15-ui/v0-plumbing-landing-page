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
import {
  createServiceType,
  setServiceTypeActive,
  updateServiceType,
} from '@/lib/admin/catalog-actions'
import { getCatalogServicesWithDemand, getServiceCategories } from '@/lib/admin/queries'

export default async function AdminServicesPage() {
  const [rows, categories] = await Promise.all([getCatalogServicesWithDemand(), getServiceCategories()])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add service</CardTitle>
          <CardDescription>Create a catalog entry. Slug should match booking form values when possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createServiceType} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="new-title">Title</Label>
              <Input id="new-title" name="title" placeholder="Drain Cleaning" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-slug">Slug</Label>
              <Input id="new-slug" name="slug" placeholder="drain" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-category">Category</Label>
              <select
                id="new-category"
                name="categoryId"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-duration">Duration (minutes)</Label>
              <Input id="new-duration" name="durationMinutes" type="number" min={15} step={15} defaultValue={60} />
            </div>
            <div className="flex items-end">
              <Button type="submit">Add service</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services catalog</CardTitle>
          <CardDescription>
            Demand counts include bookings linked by <code className="text-xs">service_type_id</code> or legacy
            text match on slug.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">
                    <div>{service.title}</div>
                    <div className="text-xs text-muted-foreground">{service.slug}</div>
                  </TableCell>
                  <TableCell>{service.categoryName ?? '—'}</TableCell>
                  <TableCell>{service.demandCount}</TableCell>
                  <TableCell>
                    <Badge variant={service.isActive ? 'secondary' : 'outline'}>
                      {service.isActive ? 'active' : 'archived'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-2 sm:flex-row sm:justify-end">
                      <form action={updateServiceType} className="flex flex-wrap items-end justify-end gap-2">
                        <input type="hidden" name="id" value={service.id} />
                        <Input name="title" defaultValue={service.title} className="h-8 w-[140px]" />
                        <Input name="slug" defaultValue={service.slug} className="h-8 w-[100px]" />
                        <select
                          name="categoryId"
                          className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                          defaultValue={service.categoryId ?? ''}
                        >
                          <option value="">None</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <Input
                          name="durationMinutes"
                          type="number"
                          min={15}
                          step={15}
                          defaultValue={service.durationMinutes}
                          className="h-8 w-20"
                        />
                        <Button size="sm" type="submit" variant="outline">
                          Save
                        </Button>
                      </form>
                      <form action={setServiceTypeActive}>
                        <input type="hidden" name="id" value={service.id} />
                        <input type="hidden" name="active" value={service.isActive ? '0' : '1'} />
                        <Button size="sm" variant="ghost" type="submit">
                          {service.isActive ? 'Archive' : 'Restore'}
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No catalog rows yet. Apply migrations (phase1 + service_categories) and seed, or add a service
                    above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
