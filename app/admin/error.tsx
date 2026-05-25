'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[admin-error]', error.message)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <p className="text-base font-semibold text-red-800">Something went wrong loading this page</p>
      <p className="mt-2 max-w-md text-sm text-red-700">
        {error.message.includes('does not exist') || error.message.includes('supabase')
          ? 'The database table may not be set up yet. Run the SQL migration in Supabase, then try again.'
          : 'An unexpected error occurred. Try refreshing the page.'}
      </p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-[#0b3a62] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b3a62]/90"
        >
          Try again
        </button>
        <Link
          href="/admin/dashboard"
          className="rounded-md border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
