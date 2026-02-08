import { ArrowLeftRight, TrendingUp, BarChart3, Route } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { type AgentType } from '@/types'
import { AGENTS } from '@/lib/constants'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Route,
  ArrowLeftRight,
  TrendingUp,
  BarChart3,
}

export function AgentBadge({ agent }: { agent: AgentType }) {
  const config = AGENTS[agent]
  if (!config) return null

  const Icon = ICONS[config.icon]

  return (
    <Badge
      variant="outline"
      className="gap-1.5 text-xs font-medium"
      style={{ borderColor: `${config.color}40`, color: config.color }}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {config.name}
    </Badge>
  )
}
