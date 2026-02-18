'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { bsc } from 'wagmi/chains'
import { Button } from '@/components/ui/button'

export function WalletButton() {
  const { address, isConnected, chain } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  if (!isConnected) {
    return (
      <Button
        onClick={() => connect({ connector: injected() })}
        size="sm"
        className="btn-interactive"
      >
        Connect Wallet
      </Button>
    )
  }

  if (chain?.id !== bsc.id) {
    return (
      <Button
        onClick={() => disconnect()}
        variant="destructive"
        size="sm"
      >
        Wrong Network
      </Button>
    )
  }

  const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  return (
    <Button
      onClick={() => disconnect()}
      variant="outline"
      size="sm"
      className="font-mono text-xs"
    >
      {displayAddress}
    </Button>
  )
}
