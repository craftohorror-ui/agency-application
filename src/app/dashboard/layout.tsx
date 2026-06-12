import { requireStaff } from '@/lib/auth'
import { signOut } from '@/app/(auth)/actions'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { GlobalSearch } from '@/components/global-search'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireStaff()
  return (
    <div className='flex min-h-screen'>
      <aside className='hidden w-60 shrink-0 border-r bg-card md:flex md:flex-col'>
        <div className='border-b p-4 text-lg font-bold tracking-tight'>AgencyOS</div>
        <Sidebar role={profile.role} />
      </aside>
      <div className='flex flex-1 flex-col'>
        <header className='flex h-14 items-center justify-between border-b bg-card px-4'>
          <div className='text-lg font-bold md:hidden'>AgencyOS</div>
          
          <div className="flex-1 px-4 md:px-8 max-w-2xl">
            <GlobalSearch />
          </div>

          <div className='ml-auto flex items-center gap-3'>
            <div className='text-right'>
              <p className='text-sm font-medium leading-none'>
                {profile.full_name || profile.email}
              </p>
              <p className='text-xs capitalize text-muted-foreground'>{profile.role}</p>
            </div>
            <form action={signOut}>
              <Button variant='outline' size='sm'>
                Sign out
              </Button>
            </form>
          </div>
        </header>
        <main className='flex-1 p-4 md:p-6'>{children}</main>
      </div>
    </div>
  )
}
