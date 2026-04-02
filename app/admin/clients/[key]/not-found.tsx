import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminClientNotFound() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client not found</CardTitle>
        <CardDescription>No booking history matched this client key.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" asChild>
          <Link href="/admin/clients">Back to clients</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
