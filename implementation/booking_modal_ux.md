# Booking modal — validation & service preset

## Name field “Required” error (fixed)

The booking form used `{...register('name')}` together with `ref={firstInputRef}` for focus management. The second `ref` **replaced** react-hook-form’s ref, so the name input was never registered. On submit, `name` was treated as missing, and Zod reported **`Required`**.

**Fix:** merge refs so both RHF and `firstInputRef` receive the DOM node (see `components/BookingModal.tsx`).

## Service dropdown auto-fill (fixed)

Opening the modal from a **specific service** (hub offering card, or a `/services/[slug]` detail page) now passes a **`presetServiceType`** into `SiteChrome` → `BookingModal`. On open, the form **resets** and sets **Service Type** from that preset so customers do not have to pick the same service again in the dropdown.

**Mapping** lives in `lib/bookingServiceType.ts` (detail page slugs → modal select values: `emergency`, `drain`, `water-heater`, `leak`, `installation`, `other`).

**API:** `useOpenBooking()` returns `openBooking(opts?: { serviceType?: BookingServiceTypeId })`. Callers that only open the generic modal still use `openBooking()` with no arguments.
