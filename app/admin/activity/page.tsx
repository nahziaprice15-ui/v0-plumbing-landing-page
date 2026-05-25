import { AdminEmptyState } from '@/components/admin/AdminEmptyState'

export default function ActivityPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-[#eef2f8] px-5 py-4 text-sm text-muted-foreground">
        Activity log coming soon. This page will display recent admin actions (status changes, notes edits).
      </div>
      <AdminEmptyState
        title="No activity recorded yet"
        description="Once status changes and note edits are logged, they will appear here."
      />
    </div>
  )
}
