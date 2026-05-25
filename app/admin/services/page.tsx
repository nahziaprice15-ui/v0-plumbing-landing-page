import { getServiceDemand } from '@/lib/admin/queries'
import { getMockServiceDemand } from '@/lib/admin/mock-repository'
import type { ServiceDemandRow } from '@/lib/admin/queries'
import { ServicesClientView } from './_components/ServicesClientView'

async function fetchDemand(days: number): Promise<ServiceDemandRow[]> {
  try {
    if (process.env.ADMIN_DATA_SOURCE === 'mock') return getMockServiceDemand()
    return await getServiceDemand(days)
  } catch {
    return []
  }
}

export default async function ServicesPage() {
  const [data30, data90] = await Promise.all([fetchDemand(30), fetchDemand(90)])

  return <ServicesClientView data30={data30} data90={data90} />
}
