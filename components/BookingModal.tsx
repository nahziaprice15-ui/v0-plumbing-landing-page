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

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
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
  phone: z.string().min(10, 'Please enter a valid phone number').regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Please enter a valid phone number (e.g., (504) 555-1234)'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  serviceType: z.string().min(1, 'Please select a service type'),
  preferredDate: z.string().optional().refine((date) => {
    if (!date) return true
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return selectedDate >= today
  }, 'Preferred date must be today or in the future'),
  preferredTime: z.string().optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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
  const nameRegister = register('name')

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
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      // Focus first input
      setTimeout(() => {
        firstInputRef.current?.focus()
      }, 100)
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

  if (!isOpen) return null

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    try {
      console.log('[v0] Booking form submitted:', data)
      // TODO: Handle form submission - API call will go here
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Booking request submitted!', {
        description: 'We will contact you shortly to confirm your appointment.',
        duration: 5000,
      })
      
      reset()
      onClose()
    } catch (error) {
      toast.error('Failed to submit booking request', {
        description: 'Please try again or call us directly at (504) 555-1234',
        duration: 5000,
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
              <User className="w-5 h-5 text-primary" />
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
                    nameRegister.ref(el)
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
                    placeholder="(504) 555-1234"
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
                <Input
                  id="address"
                  placeholder="123 Bourbon St, New Orleans, LA"
                  className={`pl-10 ${errors.address ? 'border-destructive' : ''}`}
                  {...register('address')}
                  aria-invalid={errors.address ? 'true' : 'false'}
                  aria-describedby={errors.address ? 'address-error' : undefined}
                  aria-required="true"
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
              <Calendar className="w-5 h-5 text-primary" />
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
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(value) => field.onChange(value)}
                  >
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
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(value) => field.onChange(value)}
                    >
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
