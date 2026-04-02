'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import type { ComponentProps } from 'react'

type ButtonProps = Pick<ComponentProps<typeof Button>, 'variant' | 'size' | 'className'>

type Props = ButtonProps & {
  action: (formData: FormData) => void | Promise<void>
  bookingId: string
  nextStatus: string
  children: React.ReactNode
}

function SubmitButton({
  children,
  ...props
}: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {children}
    </Button>
  )
}

/** Server action form for booking status transitions; disables the button while the action runs. */
export function BookingStatusActionForm({
  action,
  bookingId,
  nextStatus,
  children,
  variant,
  size,
  className,
}: Props) {
  return (
    <form action={action}>
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="status" value={nextStatus} />
      <SubmitButton variant={variant} size={size} className={className}>
        {children}
      </SubmitButton>
    </form>
  )
}
