import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TokenIcon } from '@/components/shared/token-icon'
import { type Portfolio } from '@/types'
import { PositionCard } from './position-card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PositionsListProps {
  portfolio: Portfolio | null
  isLoading: boolean
}

export function PositionsList({ portfolio, isLoading }: PositionsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!portfolio) return null

  return (
    <div className="space-y-4">
      {/* Token Balances */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading">Holdings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {portfolio.tokens.map((token) => (
            <div key={token.symbol} className="flex items-center gap-3">
              <TokenIcon symbol={token.symbol} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{token.name}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {token.balance} {token.symbol}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  ${token.balanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <span
                  className={cn(
                    'flex items-center justify-end gap-0.5 text-xs',
                    token.change24h >= 0 ? 'text-green-500' : 'text-red-500',
                  )}
                >
                  {token.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* DeFi Positions */}
      {portfolio.positions.length > 0 && (
        <div>
          <h3 className="mb-3 text-base font-heading font-bold">DeFi Positions</h3>
          <div className="space-y-2">
            {portfolio.positions.map((pos) => (
              <PositionCard key={pos.id} position={pos} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
