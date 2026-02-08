import { ExternalLink } from 'lucide-react'
import { EXPLORER_URL } from '@/lib/constants'

export function TxHashLink({ hash }: { hash: string }) {
  const short = `${hash.slice(0, 6)}...${hash.slice(-4)}`

  return (
    <a
      href={`${EXPLORER_URL}/tx/${hash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:underline"
    >
      {short}
      <ExternalLink className="h-3 w-3" />
    </a>
  )
}
