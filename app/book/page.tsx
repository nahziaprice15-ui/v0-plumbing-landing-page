'use client'

import { useState } from 'react'

type FormData = {
  full_name: string
  email: string
  phone: string
  address: string
  city: string
  zip_code: string
  service_type: string
  description: string
  preferred_date: string
  preferred_time_slot: string
  urgency: string
}

const initialFormData: FormData = {
  full_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zip_code: '',
  service_type: '',
  description: '',
  preferred_date: '',
  preferred_time_slot: '',
  urgency: 'standard',
}

export default function BookingPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!data.success) throw new Error(data.error)

      setConfirmation(data.confirmation_code)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (confirmation) {
    return (
      <main className="min-h-screen container mx-auto px-4 py-16 max-w-lg">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
          <p>
            Your confirmation code is: <strong>{confirmation}</strong>
          </p>
          <p className="text-muted-foreground">
            We will contact you shortly to confirm your appointment.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen container mx-auto px-4 py-16 max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="full_name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          name="zip_code"
          placeholder="Zip Code"
          onChange={handleChange}
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />

        <select
          name="service_type"
          onChange={handleChange}
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select Service</option>
          <option value="Leak Repair">Leak Repair</option>
          <option value="Drain Cleaning">Drain Cleaning</option>
          <option value="Water Heater">Water Heater</option>
          <option value="Emergency">Emergency</option>
        </select>

        <select
          name="preferred_time_slot"
          onChange={handleChange}
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select Time Slot</option>
          <option value="Morning">Morning (8am - 12pm)</option>
          <option value="Afternoon">Afternoon (12pm - 5pm)</option>
          <option value="Evening">Evening (5pm - 8pm)</option>
        </select>

        <select
          name="urgency"
          onChange={handleChange}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="standard">Standard</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>

        <input
          name="preferred_date"
          type="date"
          onChange={handleChange}
          required
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <textarea
          name="description"
          placeholder="Describe the issue..."
          onChange={handleChange}
          required
          rows={4}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm resize-y min-h-[100px]"
        />

        {error && <p className="text-destructive text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Book Service'}
        </button>
      </form>
    </main>
  )
}
