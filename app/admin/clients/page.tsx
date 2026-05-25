import Link from 'next/link'
import { getClientSummaries } from '@/lib/admin/queries'
import { getMockClientSummaries } from '@/lib/admin/mock-repository'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import type { ClientSummaryRow } from '@/lib/admin/queries'

const SERVICE_LABELS: Record<string, string> = {
  emergency: 'Emergency Plumbing',
  drain: 'Drain Cleaning',
  'water-heater': 'Water Heater Service',
  leak: 'Leak Detection & Repair',
  installation: 'Fixture / Installation',
  other: 'Other',
}

async function fetchClients(): Promise<ClientSummaryRow[]> {
  if (process.env.ADMIN_DATA_SOURCE === 'mock') {
    return getMockClientSummaries()
  }
  return getClientSummaries()
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function ClientsPage() {
  const clients = await fetchClients()

  if (clients.length === 0) {
    return (
      <AdminEmptyState
        title="No clients yet"
        description="Clients will appear here once bookings are submitted."
        actionLabel="View bookings"
        actionHref="/admin/bookings"
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/30 text-left">
            <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Phone</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Bookings</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Last Service</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Last Date</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {clients.map((client) => {
            const encodedPhone = encodeURIComponent(client.phone)
            return (
              <tr key={client.phone} className="hover:bg-muted/20">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/clients/${encodedPhone}`}
                    className="font-medium text-[#0b3a62] underline-offset-4 hover:underline"
                  >
                    {client.full_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{client.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{client.email ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-[#eef2f8] px-2 py-0.5 text-xs font-medium text-[#0b3a62]">
                    {client.booking_count}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {client.last_service_type
                    ? (SERVICE_LABELS[client.last_service_type] ?? client.last_service_type)
                    : '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(client.last_booking_date)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
