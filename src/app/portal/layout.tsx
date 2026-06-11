import { requireClient } from '@/lib/auth'
import { signOut } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireClient()
  return (
    <div className='min-h-screen bg-muted/30'>
      <header className='flex h-14 items-center justify-between border-b bg-card px-4 md:px-8'>
        <span className='text-lg font-bold tracking-tight'>Client Portal</span>
        <div className='flex items-center gap-3'>
          <span className='text-sm text-muted-foreground'>
            {profile.full_name || profile.email}
          </span>
          <form action={signOut}>
            <Button variant='outline' size='sm'>
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className='mx-auto max-w-5xl p-4 md:p-8'>{children}</main>
    </div>
  )
}
