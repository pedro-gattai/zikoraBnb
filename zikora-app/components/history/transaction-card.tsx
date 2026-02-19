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
  success: { icon: CheckCircle2, color: 'text-[hsl(var(--success))]' },
  failed: { icon: XCircle, color: 'text-destructive' },
  pending: { icon: Clock, color: 'text-[hsl(var(--warning))]' },
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

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <StatusIcon className={cn('h-3.5 w-3.5 shrink-0', status.color)} />
            <span className="min-w-0 truncate text-sm font-medium">{tx.summary}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <AgentBadge agent={tx.agent} />
            <TxHashLink hash={tx.hash} />
          </div>
          {tx.details.protocol && (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              via {tx.details.protocol}
            </p>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs text-muted-foreground">
            {new Date(tx.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {new Date(tx.timestamp).toLocaleTimeString([], {
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
