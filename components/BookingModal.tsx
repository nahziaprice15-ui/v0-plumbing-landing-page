'use client'

import { useState, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { X, Calendar, Clock, User, Phone, Mail, MapPin, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AddressAutocompleteInput } from '@/components/address/AddressAutocompleteInput'
import { getClientTodayDateString } from '@/lib/booking-availability-ui'
import { SITE } from '@/lib/site'
import type { BookingServiceTypeId } from '@/lib/bookingServiceType'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  /** When opening from a service CTA, pre-select the matching dropdown value. */
  presetServiceType?: BookingServiceTypeId | null
}

// Phone number formatting function
const formatPhoneNumber = (value: string) => {
  // Remove all non-digit characters
  const phoneNumber = value.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX
  if (phoneNumber.length <= 3) {
    return phoneNumber
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }
}

// Zod schema for form validation
const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      `Please enter a valid phone number (e.g., ${SITE.phoneDisplay})`,
    ),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  serviceType: z.string().min(1, 'Please select a service type'),
  preferredDate: z.string().optional().refine((date) => {
    if (!date) return true
    return date >= getClientTodayDateString()
  }, 'Preferred date must be today or in the future'),
  preferredTime: z.string().optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

export function BookingModal({ isOpen, onClose, presetServiceType = null }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const focusableElementsRef = useRef<HTMLElement[]>([])
  const triggerElementRef = useRef<HTMLElement | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    clearErrors,
    watch,
    control,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      serviceType: '',
      preferredDate: '',
      preferredTime: '',
      notes: '',
    },
  })

  const phoneValue = watch('phone')


  // Fresh form when the modal opens (and apply service preset from the CTA that opened it).
  useEffect(() => {
    if (!isOpen) return
    reset({
      name: '',
      phone: '',
      email: '',
      address: '',
      serviceType: presetServiceType ?? '',
      preferredDate: '',
      preferredTime: '',
      notes: '',
    })
  }, [isOpen, presetServiceType, reset])

  // Format phone number as user types
  useEffect(() => {
    if (phoneValue) {
      const formatted = formatPhoneNumber(phoneValue)
      if (formatted !== phoneValue) {
        setValue('phone', formatted, { shouldValidate: false })
      }
    }
  }, [phoneValue, setValue])

  // Focus management and body scroll lock
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement | null
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      // Focus first input
      setTimeout(() => {
        firstInputRef.current?.focus()
      }, 100)
      if (modalRef.current) {
        const elements = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
        )
        focusableElementsRef.current = Array.from(elements).filter(
          (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
        )
      }
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Focus trap
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || event.key !== 'Tab') return
      const focusableElements = focusableElementsRef.current
      if (!focusableElements.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const current = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (current === firstElement || !current) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (current === lastElement || !current) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const { ref: registerNameRef, ...nameRegister } = register('name')

  if (!isOpen) return null

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          sourcePath: typeof window !== 'undefined' ? window.location.pathname : '/',
          formVariant: 'modal',
        }),
      })

      const result = await response.json().catch(() => ({} as { success?: boolean; error?: string }))

      if (!response.ok || !result.success) {
        throw new Error(
          typeof result.error === 'string' ? result.error : 'Failed to submit booking',
        )
      }
      
      toast.success('Booking request submitted!', {
        description: 'We will contact you shortly to confirm your appointment.',
        duration: 5000,
      })
      
      reset()
      onClose()
      if (triggerElementRef.current) {
        triggerElementRef.current.focus()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong'
      toast.error('Failed to submit booking request', {
        description: `${message} — or call us at ${SITE.phoneDisplay}`,
        duration: 7000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === modalRef.current) {
          onClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="bg-background rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-primary/10">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary via-primary to-primary/90 rounded-t-3xl p-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="modal-title" className="text-2xl font-bold text-white">Book a Service</h2>
              <p id="modal-description" className="text-sm text-white/90 mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                We&apos;ll respond within 2 hours
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:rotate-90 transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-brand" />
              Personal Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...nameRegister}
                  ref={(el) => {
                    registerNameRef(el)
                    firstInputRef.current = el
                  }}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-required="true"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-destructive" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={SITE.phoneDisplay}
                    {...register('phone')}
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    aria-required="true"
                    className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-destructive" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Service Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Controller
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <AddressAutocompleteInput
                      id="address"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="123 Bourbon St, New Orleans, LA"
                      className={`pl-10 ${errors.address ? 'border-destructive' : ''}`}
                    />
                  )}
                />
              </div>
              {errors.address && (
                <p id="address-error" className="text-sm text-destructive" role="alert">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand" />
              Service Details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="serviceType">
                Service Type <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="serviceType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="serviceType"
                      aria-invalid={errors.serviceType ? 'true' : 'false'}
                      aria-describedby={errors.serviceType ? 'serviceType-error' : undefined}
                      aria-required="true"
                      className={errors.serviceType ? 'border-destructive' : ''}
                    >
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency Repair</SelectItem>
                      <SelectItem value="drain">Drain Cleaning</SelectItem>
                      <SelectItem value="water-heater">Water Heater Service</SelectItem>
                      <SelectItem value="leak">Leak Detection</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.serviceType && (
                <p id="serviceType-error" className="text-sm text-destructive" role="alert">
                  {errors.serviceType.message}
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  min={getClientTodayDateString()}
                  {...register('preferredDate')}
                  aria-invalid={errors.preferredDate ? 'true' : 'false'}
                  aria-describedby={errors.preferredDate ? 'preferredDate-error' : undefined}
                  className={errors.preferredDate ? 'border-destructive' : ''}
                />
                {errors.preferredDate && (
                  <p id="preferredDate-error" className="text-sm text-destructive" role="alert">
                    {errors.preferredDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Controller
                  control={control}
                  name="preferredTime"
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger id="preferredTime">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8AM-12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
                        <SelectItem value="evening">Evening (5PM-8PM)</SelectItem>
                        <SelectItem value="asap">ASAP</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Describe your plumbing issue or any special requirements..."
                rows={4}
                {...register('notes')}
                aria-invalid={errors.notes ? 'true' : 'false'}
                aria-describedby={errors.notes ? 'notes-error' : undefined}
                className={errors.notes ? 'border-destructive' : ''}
              />
              {errors.notes && (
                <p id="notes-error" className="text-sm text-destructive" role="alert">
                  {errors.notes.message}
                </p>
              )}
            </div>
          </div>

          {/* Form submission status (for screen readers) */}
          <div id="form-status" aria-live="polite" aria-atomic="true" className="sr-only"></div>

          {/* Submit */}
          <div className="flex gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 hover:scale-105 transition-transform duration-300"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:shadow-xl hover:shadow-secondary/50 hover:scale-105 transition-all duration-300 font-semibold relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Booking Request
                    <Calendar className="w-4 h-4 group-hover:animate-bounce" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
