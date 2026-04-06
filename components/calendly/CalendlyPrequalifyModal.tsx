'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { CalendlyPrefill } from '@/lib/calendly'

type Props = {
  isOpen: boolean
  onClose: () => void
  onContinue: (prefill: CalendlyPrefill) => Promise<void> | void
}

type QualifyData = {
  serviceType: string
  urgency: string
  zipCode: string
  customerType: string
  timeframe: string
  details: string
  name: string
  email: string
}

const initialData: QualifyData = {
  serviceType: '',
  urgency: '',
  zipCode: '',
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
    data.serviceType && data.urgency && data.zipCode.trim() && data.customerType && data.timeframe
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
      await onContinue({
        name: data.name.trim(),
        email: data.email.trim(),
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
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="calendly-prequalify-title" className="text-xl font-semibold">
              Before we book your service
            </h2>
            <p className="text-sm text-muted-foreground">
              Step {step} of 2
            </p>
          </div>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            onClick={closeAndReset}
            aria-label="Close"
          >
            ×
          </button>
        </div>

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
              <Label htmlFor="zipCode">3) What is the service ZIP code?</Label>
              <Input
                id="zipCode"
                value={data.zipCode}
                onChange={(e) => setData((p) => ({ ...p, zipCode: e.target.value }))}
                placeholder="e.g. 70119"
              />
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
              <Button type="button" onClick={() => setStep(2)} disabled={!canGoNext}>
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We&apos;ll prefill this into Calendly for a faster checkout.
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
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" onClick={() => void submit()} disabled={!canContinue || isSubmitting}>
                {isSubmitting ? 'Opening…' : 'Continue to booking'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
