import { requireStaff } from '@/lib/auth'
import { OwnerOverview } from './_components/owner-overview'
import { MemberOverview } from './_components/member-overview'

export default async function DashboardPage() {
  const { profile } = await requireStaff()
  
  // As per requirements: only checking Owner. Managers/Members fall back to Member overview.
  const isOwner = profile.role === 'owner'

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-sm text-muted-foreground'>
          {isOwner ? 'Agency overview and operational metrics.' : 'Your personalized work overview.'}
        </p>
      </div>
      
      {isOwner ? <OwnerOverview /> : <MemberOverview />}
    </div>
  )
}
