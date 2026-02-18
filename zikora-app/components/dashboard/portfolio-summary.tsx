import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { type Portfolio } from '@/types'
import { cn } from '@/lib/utils'

interface PortfolioSummaryProps {
  portfolio: Portfolio | null
  isLoading: boolean
  error?: string | null
  onRetry?: () => void
}

export function PortfolioSummary({ portfolio, isLoading, error, onRetry }: PortfolioSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="skeleton-shimmer mb-2 h-4 w-24 rounded" />
              <div className="skeleton-shimmer h-8 w-32 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          <p className="flex-1 text-sm text-muted-foreground">{error}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm" className="btn-interactive shrink-0 gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!portfolio) return null

  const isPositive = portfolio.change24h >= 0

  const stats = [
    {
      label: 'Total Value',
      value: `$${portfolio.totalValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      label: '24h Change',
      value: `${isPositive ? '+' : ''}$${portfolio.change24h.toFixed(2)}`,
      sub: `${isPositive ? '+' : ''}${portfolio.change24hPercent.toFixed(2)}%`,
      positive: isPositive,
    },
    {
      label: 'Active Positions',
      value: String(portfolio.positions.length),
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-heading font-bold">{stat.value}</span>
              {stat.sub && (
                <span
                  className={cn(
                    'flex items-center gap-0.5 text-xs font-medium',
                    stat.positive ? 'text-[hsl(var(--success))]' : 'text-destructive',
                  )}
                >
                  {stat.positive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.sub}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
