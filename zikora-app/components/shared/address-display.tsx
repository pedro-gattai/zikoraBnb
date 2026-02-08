import { EXPLORER_URL } from '@/lib/constants'

export function AddressDisplay({ address }: { address: string }) {
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <a
      href={`${EXPLORER_URL}/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs text-muted-foreground hover:text-foreground"
    >
      {short}
    </a>
  )
}
