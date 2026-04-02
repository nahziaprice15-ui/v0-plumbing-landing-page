import Link from 'next/link'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
      <Inbox className="mb-3 h-10 w-10 text-muted-foreground" aria-hidden />
      <p className="text-base font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref ? (
        <Button className="mt-4" asChild variant="secondary">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  )
}
