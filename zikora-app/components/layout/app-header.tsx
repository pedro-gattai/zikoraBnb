'use client'

import { Menu } from 'lucide-react'
import { ZikoraLogo } from '@/components/zikora-logo'
import { WalletButton } from '@/components/wallet/wallet-button'
import { NetworkBadge } from '@/components/wallet/network-badge'
import { Button } from '@/components/ui/button'

interface AppHeaderProps {
  onMenuClick?: () => void
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <ZikoraLogo />
      </div>
      <div className="flex items-center gap-3">
        <NetworkBadge />
        <WalletButton />
      </div>
    </header>
  )
}
