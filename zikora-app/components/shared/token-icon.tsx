import { cn } from '@/lib/utils'

const TOKEN_COLORS: Record<string, string> = {
  BNB: 'bg-yellow-500/20 text-yellow-500',
  WBNB: 'bg-yellow-500/20 text-yellow-500',
  USDT: 'bg-green-500/20 text-green-500',
  USDC: 'bg-blue-500/20 text-blue-500',
  BUSD: 'bg-yellow-400/20 text-yellow-400',
}

export function TokenIcon({ symbol, className }: { symbol: string; className?: string }) {
  const colors = TOKEN_COLORS[symbol] || 'bg-muted text-muted-foreground'

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full text-xs font-bold',
        'h-8 w-8',
        colors,
        className,
      )}
    >
      {symbol.slice(0, 2)}
    </div>
  )
}
