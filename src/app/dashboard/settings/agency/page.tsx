import { requireStaff } from '@/lib/auth'
import { getCurrentAgencySettings } from '@/lib/agencies'
import { AgencyForm } from './agency-form'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Agency Settings | AgencyOS'
}

export default async function AgencySettingsPage() {
  const { profile } = await requireStaff()
  
  if (!['owner', 'manager'].includes(profile.role)) {
    redirect('/dashboard/settings')
  }

  const agency = await getCurrentAgencySettings()
  
  return (
    <div className="space-y-6">
      <AgencyForm agency={agency} />
    </div>
  )
}
