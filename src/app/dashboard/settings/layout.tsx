import { ReactNode } from 'react'
import Link from 'next/link'
import { requireStaff } from '@/lib/auth'

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireStaff()
  
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your personal and agency preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <nav className="flex md:flex-col gap-2 min-w-[200px] overflow-x-auto pb-2 md:pb-0">
          <Link href="/dashboard/settings" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted bg-transparent transition-colors">
            My Profile
          </Link>
          {profile.role === 'owner' && (
            <Link href="/dashboard/settings/agency" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted bg-transparent transition-colors">
              Agency Settings
            </Link>
          )}
        </nav>

        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
