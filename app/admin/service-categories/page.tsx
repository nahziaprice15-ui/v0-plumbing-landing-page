import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  createServiceCategory,
  deleteServiceCategory,
  updateServiceCategory,
} from '@/lib/admin/catalog-actions'
import { getServiceCategories } from '@/lib/admin/queries'

export default async function AdminServiceCategoriesPage() {
  const categories = await getServiceCategories()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add category</CardTitle>
          <CardDescription>Groups services for reporting and admin organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createServiceCategory} className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" name="name" placeholder="Emergency" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug (optional)</Label>
              <Input id="cat-slug" name="slug" placeholder="emergency" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-sort">Sort order</Label>
              <Input id="cat-sort" name="sortOrder" type="number" defaultValue={0} />
            </div>
            <Button type="submit">Add category</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Edit labels and ordering. Deleting a category clears its link on service types (FK set null).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-end sm:justify-between"
            >
              <form action={updateServiceCategory} className="flex flex-1 flex-wrap gap-2">
                <input type="hidden" name="id" value={category.id} />
                <Input name="name" defaultValue={category.name} className="max-w-[200px]" required />
                <Input name="slug" defaultValue={category.slug} className="max-w-[160px]" />
                <Input name="sortOrder" type="number" defaultValue={category.sortOrder} className="w-24" />
                <Button size="sm" type="submit" variant="outline">
                  Save
                </Button>
              </form>
              <form action={deleteServiceCategory}>
                <input type="hidden" name="id" value={category.id} />
                <Button size="sm" variant="ghost" type="submit">
                  Delete
                </Button>
              </form>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No categories yet. Apply the service_categories migration or add one above.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
