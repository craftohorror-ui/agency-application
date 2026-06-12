'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/portal', label: 'Dashboard' },
  { href: '/portal/projects', label: 'Projects' },
  { href: '/portal/contracts', label: 'Contracts' },
  { href: '/portal/invoices', label: 'Invoices' },
  { href: '/portal/files', label: 'Files' },
  { href: '/portal/messages', label: 'Messages' },
]

export function PortalNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 overflow-x-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/portal' && pathname.startsWith(item.href))
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary whitespace-nowrap',
              isActive ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
