import { requireOwner } from '@/lib/auth'
import { getCurrentAgencySettings } from '@/lib/agencies'
import { AgencyForm } from './agency-form'

export const metadata = {
  title: 'Agency Settings | AgencyOS'
}

// H-2 / H-10 FIX: requireOwner() replaces requireStaff() + manual role check.
// This provides a clean, consistent defense-in-depth Layer 2+3 check for this page.
export default async function AgencySettingsPage() {
  await requireOwner()

  const agency = await getCurrentAgencySettings()
  
  return (
    <div className="space-y-6">
      <AgencyForm agency={agency} />
    </div>
  )
}
