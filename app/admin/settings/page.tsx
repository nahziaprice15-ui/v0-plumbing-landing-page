export default function SettingsPage() {
  const ownerEmail = process.env.OWNER_EMAIL ?? 'not configured'

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white divide-y">
        <div className="p-5 space-y-3">
          <h3 className="font-semibold text-[#0b3a62]">Email Notifications</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Owner notification email:{' '}
              <span className="font-mono font-medium text-foreground">{ownerEmail}</span>
            </p>
            <p>
              To enable email notifications, set the following environment variables in your Vercel
              project settings and redeploy:
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>
                <span className="font-mono text-foreground">RESEND_API_KEY</span> — your Resend API
                key from resend.com
              </li>
              <li>
                <span className="font-mono text-foreground">RESEND_FROM_EMAIL</span> — the sender
                address (e.g. noreply@yourdomain.com)
              </li>
              <li>
                <span className="font-mono text-foreground">OWNER_EMAIL</span> — the address that
                receives booking notifications
              </li>
            </ul>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <h3 className="font-semibold text-[#0b3a62]">Admin Password</h3>
          <p className="text-sm text-muted-foreground">
            Change password by updating{' '}
            <span className="font-mono text-foreground">ADMIN_PASSWORD</span> in Vercel environment
            variables, then redeploy. The new password takes effect immediately after deployment.
          </p>
        </div>
      </div>
    </div>
  )
}
