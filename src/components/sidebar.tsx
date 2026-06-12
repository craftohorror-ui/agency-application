'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/lib/types'
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  FileSignature,
  Receipt,
  FolderKanban,
  UserCog,
  MessageSquare,
  FolderOpen,
  BarChart3,
  Shield,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['owner', 'manager', 'member'] },
  { href: '/dashboard/leads', label: 'Leads', icon: Users, roles: ['owner', 'manager', 'member'] },
  { href: '/dashboard/clients', label: 'Clients', icon: Building2, roles: ['owner', 'manager', 'member'] },
  // { href: '/dashboard/proposals', label: 'Proposals', icon: FileText, roles: ['owner', 'manager'] },
  // { href: '/dashboard/contracts', label: 'Contracts', icon: FileSignature, roles: ['owner', 'manager'] },
  // { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt, roles: ['owner', 'manager'] },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban, roles: ['owner', 'manager', 'member'] },
  { href: '/dashboard/team', label: 'Team', icon: UserCog, roles: ['owner', 'manager'] },
  // { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare, roles: ['owner', 'manager', 'member'] },
  { href: '/dashboard/files', label: 'Files', icon: FolderOpen, roles: ['owner', 'manager', 'member'] },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, roles: ['owner'] },
  { href: '/dashboard/admin', label: 'Admin', icon: Shield, roles: ['owner'] },
] as const

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname()
  return (
    <nav className='flex flex-col gap-1 p-3'>
      {NAV.filter((i) => (i.roles as readonly string[]).includes(role)).map((item) => {
        const active =
          item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className='h-4 w-4 shrink-0' />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
