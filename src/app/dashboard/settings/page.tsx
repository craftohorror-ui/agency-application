import { requireStaff } from '@/lib/auth'
import { ProfileForm } from './profile-form'

export const metadata = {
  title: 'My Profile | Settings | AgencyOS'
}

export default async function SettingsPage() {
  const { profile } = await requireStaff()
  
  return (
    <div className="space-y-6">
      <ProfileForm profile={profile} />
    </div>
  )
}
