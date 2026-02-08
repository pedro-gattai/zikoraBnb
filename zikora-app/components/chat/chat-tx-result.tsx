import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { TxHashLink } from '@/components/shared/tx-hash-link'
import { type TxResult } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-green-500', label: 'Success' },
  failed: { icon: XCircle, color: 'text-red-500', label: 'Failed' },
  pending: { icon: Clock, color: 'text-yellow-500', label: 'Pending' },
}

export function ChatTxResult({ result }: { result: TxResult }) {
  const status = STATUS_CONFIG[result.status]
  const StatusIcon = status.icon

  return (
    <Card className="mt-2 border-border bg-secondary/30">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <StatusIcon className={cn('h-4 w-4', status.color)} />
            <span className="text-sm font-medium">{result.summary}</span>
          </div>
        </div>

        {result.details && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {result.details.fromToken && result.details.fromAmount && (
              <span>From: {result.details.fromAmount} {result.details.fromToken}</span>
            )}
            {result.details.toToken && result.details.toAmount && (
              <span>To: {result.details.toAmount} {result.details.toToken}</span>
            )}
            {result.details.protocol && (
              <span>Via: {result.details.protocol}</span>
            )}
          </div>
        )}

        <div className="mt-2">
          <TxHashLink hash={result.hash} />
        </div>
      </CardContent>
    </Card>
  )
}
