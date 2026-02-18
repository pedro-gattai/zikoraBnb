import { type Transaction } from '@/types'
import { TransactionCard } from './transaction-card'
import { Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TransactionListProps {
  transactions: Transaction[]
  isLoading: boolean
  error?: string | null
  onRetry?: () => void
}

export function TransactionList({ transactions, isLoading, error, onRetry }: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-24 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm" className="btn-interactive gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="rounded-full bg-secondary p-3">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <TransactionCard key={tx.id} tx={tx} />
      ))}
    </div>
  )
}
