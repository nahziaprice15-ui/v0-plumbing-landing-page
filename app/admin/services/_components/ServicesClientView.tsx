'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { ServiceDemandRow } from '@/lib/admin/queries'

const SERVICE_LABELS: Record<string, string> = {
  emergency: 'Emergency Plumbing',
  drain: 'Drain Cleaning',
  'water-heater': 'Water Heater Service',
  leak: 'Leak Detection & Repair',
  installation: 'Fixture / Installation',
  other: 'Other',
}

function ServiceBarChart({ data }: { data: ServiceDemandRow[] }) {
  const chartData = data.map((row) => ({
    name: SERVICE_LABELS[row.service_type] ?? row.service_type,
    total: row.total,
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 40 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="total" fill="#0b3a62" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ServicesClientView({
  data30,
  data90,
}: {
  data30: ServiceDemandRow[]
  data90: ServiceDemandRow[]
}) {
  const [tab, setTab] = useState<'30' | '90'>('30')
  const data = tab === '30' ? data30 : data90

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['30', '90'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-[#0b3a62] text-white'
                : 'border bg-white text-muted-foreground hover:bg-muted/50'
            }`}
          >
            {t} Days
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">No booking data for this period.</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border bg-white p-5">
            <ServiceBarChart data={data} />
          </div>

          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Rank</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Service</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Total Bookings</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.map((row, idx) => (
                  <tr key={row.service_type} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium">
                      {SERVICE_LABELS[row.service_type] ?? row.service_type}
                    </td>
                    <td className="px-4 py-3">{row.total}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-[#eef2f8]">
                          <div
                            className="h-2 rounded-full bg-[#0b3a62]"
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span>{row.pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
