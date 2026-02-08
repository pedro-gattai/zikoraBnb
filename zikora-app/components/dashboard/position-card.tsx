import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TokenIcon } from '@/components/shared/token-icon'
import { type Position } from '@/types'

export function PositionCard({ position }: { position: Position }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <TokenIcon symbol={position.token} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{position.protocol}</span>
            <Badge variant="secondary" className="text-[10px]">
              {position.type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {position.amount} {position.token}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">
            ${position.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-green-500">
            APY {position.apy}% (+${position.earnings.toFixed(2)})
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
