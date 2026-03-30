import type { SegmentId, SegmentOffering, ServiceDetailSlug } from '@/data/serviceSegments'

/** Values accepted by the booking form `serviceType` select (`components/BookingModal.tsx`). */
export type BookingServiceTypeId =
  | 'emergency'
  | 'drain'
  | 'water-heater'
  | 'leak'
  | 'installation'
  | 'other'

const slugToBooking: Record<ServiceDetailSlug, BookingServiceTypeId> = {
  'emergency-plumbing': 'emergency',
  'drain-cleaning': 'drain',
  'water-heater-service': 'water-heater',
  'leak-detection': 'leak',
  'fixture-installation': 'installation',
  'pipe-repair': 'other',
}

export function serviceDetailSlugToBookingType(
  slug: string | undefined,
): BookingServiceTypeId | undefined {
  if (!slug || !(slug in slugToBooking)) return undefined
  return slugToBooking[slug as ServiceDetailSlug]
}

/** Default booking category when opening from a hub tab (not a specific offering card). */
export function segmentIdToBookingType(segmentId: SegmentId): BookingServiceTypeId | undefined {
  if (segmentId === 'emergency') return 'emergency'
  return undefined
}

/** Map a services-hub offering card to the booking form service dropdown. */
export function offeringToBookingType(offering: SegmentOffering): BookingServiceTypeId {
  if (offering.detailSlug) {
    return serviceDetailSlugToBookingType(offering.detailSlug) ?? 'other'
  }
  return 'other'
}
