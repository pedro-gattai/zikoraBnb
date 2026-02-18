'use client'

import { useAccount, useChainId } from 'wagmi'
import { Badge } from '@/components/ui/badge'

export function NetworkBadge() {
  const chainId = useChainId()
  const { isConnected } = useAccount()

  if (!isConnected) return null

  return (
    <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
      {chainId === 56 ? 'BSC Mainnet' : `Chain ${chainId}`}
    </Badge>
  )
}
