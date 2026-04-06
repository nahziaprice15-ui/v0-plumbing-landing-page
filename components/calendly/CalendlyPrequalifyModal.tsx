'use client'

import { useState } from 'react'
import { Calendar, MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AddressAutocompleteInput } from '@/components/address/AddressAutocompleteInput'
import type { CalendlyPrefill } from '@/lib/calendly'

type Props = {
  isOpen: boolean
  onClose: () => void
  onContinue: (prefill: CalendlyPrefill) => Promise<void> | void
}

type QualifyData = {
  serviceType: string
  urgency: string
  address: string
  customerType: string
  timeframe: string
  details: string
  name: string
  email: string
}

const initialData: QualifyData = {
  serviceType: '',
  urgency: '',
  address: '',
  customerType: '',
  timeframe: '',
  details: '',
  name: '',
  email: '',
}

export function CalendlyPrequalifyModal({ isOpen, onClose, onContinue }: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<QualifyData>(initialData)

  if (!isOpen) return null

  const canGoNext =
    data.serviceType && data.urgency && data.address.trim().length >= 5 && data.customerType && data.timeframe
  const canContinue = data.name.trim().length >= 2 && /\S+@\S+\.\S+/.test(data.email)

  const closeAndReset = () => {
    setStep(1)
    setData(initialData)
    setIsSubmitting(false)
    onClose()
  }

  const submit = async () => {
    if (!canContinue) return
    setIsSubmitting(true)
    try {
      // Calendly customAnswers (a1-a6) map to invitee question order in Calendly event settings.
      await onContinue({
        name: data.name.trim(),
        email: data.email.trim(),
        customAnswers: {
          a1: data.serviceType,
          a2: data.urgency,
          a3: data.address.trim(),
          a4: data.customerType,
          a5: data.timeframe,
          a6: data.details.trim() || undefined,
        },
      })
      closeAndReset()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendly-prequalify-title"
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-primary/15 bg-background shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-gradient-to-r from-primary via-primary to-primary/90 px-5 py-4">
          <div className="flex items-center gap-3 text-white">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <Calendar className="h-5 w-5" />
            </span>
            <div>
              <h2 id="calendly-prequalify-title" className="text-lg font-semibold">
                Before we book your service
              </h2>
              <p className="text-xs text-white/90">Step {step} of 2</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white/90 hover:bg-white/10 hover:text-white"
            onClick={closeAndReset}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>1) What service do you need?</Label>
              <Select value={data.serviceType} onValueChange={(v) => setData((p) => ({ ...p, serviceType: v }))}>
                <SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency repair</SelectItem>
                  <SelectItem value="drain">Drain cleaning</SelectItem>
                  <SelectItem value="water-heater">Water heater service</SelectItem>
                  <SelectItem value="leak">Leak detection/repair</SelectItem>
                  <SelectItem value="installation">Fixture installation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>2) How urgent is this?</Label>
              <Select value={data.urgency} onValueChange={(v) => setData((p) => ({ ...p, urgency: v }))}>
                <SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">Emergency (ASAP)</SelectItem>
                  <SelectItem value="urgent">Urgent (today/tomorrow)</SelectItem>
                  <SelectItem value="standard">Standard (this week)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceAddress">3) What is the service address?</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <AddressAutocompleteInput
                  id="serviceAddress"
                  value={data.address}
                  onChange={(value) => setData((p) => ({ ...p, address: value }))}
                  placeholder="123 Bourbon St, New Orleans, LA"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>4) Are you a new or returning customer?</Label>
              <Select value={data.customerType} onValueChange={(v) => setData((p) => ({ ...p, customerType: v }))}>
                <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New customer</SelectItem>
                  <SelectItem value="returning">Returning customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>5) What timeframe works best?</Label>
              <Select value={data.timeframe} onValueChange={(v) => setData((p) => ({ ...p, timeframe: v }))}>
                <SelectTrigger><SelectValue placeholder="Select preferred timeframe" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8am-12pm)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                  <SelectItem value="evening">Evening (5pm-8pm)</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Optional notes</Label>
              <Textarea
                id="details"
                rows={3}
                value={data.details}
                onChange={(e) => setData((p) => ({ ...p, details: e.target.value }))}
                placeholder="Any context we should know before scheduling?"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={() => setStep(2)}
                disabled={!canGoNext}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We&apos;ll prefill this in Calendly so you only confirm details and choose a time.
            </p>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData((p) => ({ ...p, email: e.target.value }))}
                placeholder="jane@email.com"
              />
            </div>
            <div className="rounded-xl border border-border/80 bg-card p-3 text-sm">
              <p className="mb-2 font-medium text-foreground">Review before opening Calendly</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>Service: {data.serviceType || '—'}</li>
                <li>Urgency: {data.urgency || '—'}</li>
                <li>Address: {data.address || '—'}</li>
                <li>Customer: {data.customerType || '—'}</li>
                <li>Timeframe: {data.timeframe || '—'}</li>
              </ul>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="button"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={() => void submit()}
                disabled={!canContinue || isSubmitting}
              >
                {isSubmitting ? 'Opening…' : 'Continue to booking'}
              </Button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
