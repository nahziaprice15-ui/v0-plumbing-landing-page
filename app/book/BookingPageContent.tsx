'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Calendar, Clock, User, Phone, Mail, MapPin, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
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

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Please enter a valid phone number'),
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

const VALID_SERVICE_IDS = ['emergency', 'drain', 'water-heater', 'leak', 'installation', 'other']

export function BookingPageContent() {
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get('service') ?? ''
  const presetService = VALID_SERVICE_IDS.includes(serviceParam) ? serviceParam : ''

  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      serviceType: presetService,
      preferredDate: '',
      preferredTime: '',
      notes: '',
    },
  })

  const phoneValue = watch('phone')

  useEffect(() => {
    if (phoneValue) {
      const formatted = formatPhoneNumber(phoneValue)
      if (formatted !== phoneValue) setValue('phone', formatted, { shouldValidate: false })
    }
  }, [phoneValue, setValue])

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, sourcePath: '/book', formVariant: 'page' }),
      })
      const result = await res.json().catch(() => ({} as { success?: boolean; error?: string }))
      if (!res.ok || !result.success) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Failed to submit booking')
      }
      setSubmitted(true)
      reset()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#0b3a62]">Booking Request Received!</h1>
          <p className="text-lg text-muted-foreground">
            We&apos;ll call you within 2 hours to confirm your appointment.
          </p>
          <p className="text-muted-foreground text-sm">
            Need to reach us sooner? Call{' '}
            <a href={`tel:${SITE.phoneTel}`} className="font-semibold text-[#0b3a62] hover:underline">
              {SITE.phoneDisplay}
            </a>
          </p>
          <Button asChild className="bg-[#0b3a62] hover:bg-[#0b3a62]/90 text-white">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-[#0b3a62] via-[#0b3a62] to-[#071f35] text-white pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            We respond within 2 hours
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Book a Service</h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto">
            Fill out the form below and our team will call you to confirm your appointment.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">

              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-[#0b3a62]" />
                  Personal Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      {...register('name')}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
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
                        className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email{' '}
                    <span className="text-muted-foreground font-normal text-sm">(optional)</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register('email')}
                      className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
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
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Service Details */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0b3a62]" />
                  Service Details
                </h2>

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
                    <p className="text-sm text-destructive">{errors.serviceType.message}</p>
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
                      className={errors.preferredDate ? 'border-destructive' : ''}
                    />
                    {errors.preferredDate && (
                      <p className="text-sm text-destructive">{errors.preferredDate.message}</p>
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
                            <SelectItem value="morning">Morning (8AM–12PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12PM–5PM)</SelectItem>
                            <SelectItem value="evening">Evening (5PM–8PM)</SelectItem>
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
                    className={errors.notes ? 'border-destructive' : ''}
                  />
                  {errors.notes && (
                    <p className="text-sm text-destructive">{errors.notes.message}</p>
                  )}
                </div>
              </div>

              {/* Error banner */}
              {submitError && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                  {submitError} — or call us at{' '}
                  <a href={`tel:${SITE.phoneTel}`} className="font-semibold underline">
                    {SITE.phoneDisplay}
                  </a>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#c81e2d] hover:bg-[#a8181f] text-white font-semibold h-12 text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Booking Request
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Or call us directly at{' '}
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="font-semibold text-[#0b3a62] hover:underline"
                >
                  {SITE.phoneDisplay}
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
