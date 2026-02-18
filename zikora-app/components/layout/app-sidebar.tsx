'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, LayoutDashboard, Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { href: '/', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/history', label: 'History', icon: Clock },
]

interface AppSidebarProps {
  open?: boolean
  onClose?: () => void
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-60 flex-col border-r border-border bg-background transition-transform duration-200 md:static md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 md:hidden">
          <span className="text-sm font-medium text-muted-foreground">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            BSC Mainnet
          </p>
        </div>
      </aside>
    </>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-border bg-background md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-1',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
