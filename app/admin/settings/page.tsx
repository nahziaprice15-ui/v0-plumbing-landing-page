export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white divide-y">
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
