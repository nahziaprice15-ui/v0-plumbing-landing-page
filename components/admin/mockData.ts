export type BookingStatus = 'new' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export type BookingRow = {
  id: string
  customerName: string
  phone: string
  service: string
  category: string
  address: string
  date: string
  timeWindow: string
  status: BookingStatus
}

export type ServiceRow = {
  id: string
  title: string
  category: string
  durationMinutes: number
  isActive: boolean
}

export type ServiceCategoryRow = {
  id: string
  name: string
  activeServices: number
}

export type ClientRow = {
  id: string
  name: string
  phone: string
  email: string
  totalBookings: number
  lastServiceDate: string
}

export const bookings: BookingRow[] = [
  {
    id: 'BK-1008',
    customerName: 'Monica Hall',
    phone: '(504) 555-1102',
    service: 'Emergency Leak Repair',
    category: 'Emergency',
    address: '1209 Saint Charles Ave, New Orleans',
    date: 'Mar 31',
    timeWindow: '8:00 AM - 10:00 AM',
    status: 'new',
  },
  {
    id: 'BK-1009',
    customerName: 'David Barnes',
    phone: '(504) 555-8811',
    service: 'Drain Cleaning',
    category: 'Residential',
    address: '443 Dauphine St, New Orleans',
    date: 'Mar 31',
    timeWindow: '10:00 AM - 12:00 PM',
    status: 'confirmed',
  },
  {
    id: 'BK-1010',
    customerName: 'Harbor Hotel',
    phone: '(504) 555-9010',
    service: 'Commercial Pipe Repair',
    category: 'Commercial',
    address: '918 Canal St, New Orleans',
    date: 'Mar 31',
    timeWindow: '1:00 PM - 4:00 PM',
    status: 'in_progress',
  },
  {
    id: 'BK-1011',
    customerName: 'Inez Cooper',
    phone: '(504) 555-3011',
    service: 'Water Heater Service',
    category: 'Residential',
    address: '2518 Franklin Ave, New Orleans',
    date: 'Apr 01',
    timeWindow: '9:00 AM - 11:00 AM',
    status: 'completed',
  },
  {
    id: 'BK-1012',
    customerName: 'Paul Ramirez',
    phone: '(504) 555-1190',
    service: 'Fixture Installation',
    category: 'Residential',
    address: '3101 Esplanade Ave, New Orleans',
    date: 'Apr 01',
    timeWindow: '2:00 PM - 4:00 PM',
    status: 'cancelled',
  },
]

export const services: ServiceRow[] = [
  { id: 'SV-01', title: 'Emergency Leak Repair', category: 'Emergency', durationMinutes: 90, isActive: true },
  { id: 'SV-02', title: 'Drain Cleaning', category: 'Residential', durationMinutes: 60, isActive: true },
  { id: 'SV-03', title: 'Water Heater Service', category: 'Residential', durationMinutes: 120, isActive: true },
  { id: 'SV-04', title: 'Commercial Pipe Repair', category: 'Commercial', durationMinutes: 180, isActive: true },
  { id: 'SV-05', title: 'Fixture Installation', category: 'Residential', durationMinutes: 90, isActive: false },
]

export const serviceCategories: ServiceCategoryRow[] = [
  { id: 'CAT-01', name: 'Emergency', activeServices: 1 },
  { id: 'CAT-02', name: 'Residential', activeServices: 3 },
  { id: 'CAT-03', name: 'Commercial', activeServices: 1 },
]

export const clients: ClientRow[] = [
  {
    id: 'CL-101',
    name: 'Monica Hall',
    phone: '(504) 555-1102',
    email: 'monica.hall@example.com',
    totalBookings: 3,
    lastServiceDate: 'Mar 21, 2026',
  },
  {
    id: 'CL-102',
    name: 'David Barnes',
    phone: '(504) 555-8811',
    email: 'david.barnes@example.com',
    totalBookings: 2,
    lastServiceDate: 'Mar 18, 2026',
  },
  {
    id: 'CL-103',
    name: 'Harbor Hotel',
    phone: '(504) 555-9010',
    email: 'ops@harborhotel.com',
    totalBookings: 5,
    lastServiceDate: 'Mar 30, 2026',
  },
]
