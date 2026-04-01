import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dispatch reference</CardTitle>
          <CardDescription>
            Operational defaults for crews (content-only in this phase — wire to a settings table later if needed).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground">
          <section>
            <h3 className="mb-2 font-medium text-foreground">Business hours</h3>
            <p>Monday–Friday: 7:00 AM – 6:00 PM · Saturday: 8:00 AM – 2:00 PM · Sunday: emergency calls only.</p>
          </section>
          <section>
            <h3 className="mb-2 font-medium text-foreground">Primary service ZIPs</h3>
            <p>
              70112–70119, 70122–70125, 70130, 70002–70006, 70123, 70128 — expand or edit when you add a persisted
              settings model.
            </p>
          </section>
          <section>
            <h3 className="mb-2 font-medium text-foreground">After-hours message</h3>
            <p>
              For emergencies outside business hours, callers reach the on-call rotation. Non-urgent requests are
              scheduled for the next business day.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
