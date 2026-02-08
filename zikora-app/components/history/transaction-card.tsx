import {
  ArrowLeftRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AgentBadge } from '@/components/shared/agent-badge'
import { TxHashLink } from '@/components/shared/tx-hash-link'
import { type Transaction } from '@/types'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  swap: ArrowLeftRight,
  supply: ArrowDownToLine,
  redeem: ArrowUpFromLine,
  approve: Shield,
  deposit: ArrowDownToLine,
  withdraw: ArrowUpFromLine,
}

const STATUS_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-green-500' },
  failed: { icon: XCircle, color: 'text-red-500' },
  pending: { icon: Clock, color: 'text-yellow-500' },
}

export function TransactionCard({ tx }: { tx: Transaction }) {
  const TypeIcon = TYPE_ICONS[tx.type] || ArrowLeftRight
  const status = STATUS_CONFIG[tx.status]
  const StatusIcon = status.icon

  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <TypeIcon className="h-4 w-4 text-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <StatusIcon className={cn('h-3.5 w-3.5', status.color)} />
            <span className="text-sm font-medium truncate">{tx.summary}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <AgentBadge agent={tx.agent} />
            <TxHashLink hash={tx.hash} />
          </div>
          {tx.details.protocol && (
            <p className="mt-1 text-xs text-muted-foreground">
              via {tx.details.protocol}
            </p>
          )}
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground">
            {tx.timestamp.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {tx.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {tx.gasCostUsd !== undefined && (
            <p className="mt-1 text-[10px] text-muted-foreground">
              Gas: ${tx.gasCostUsd.toFixed(2)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
