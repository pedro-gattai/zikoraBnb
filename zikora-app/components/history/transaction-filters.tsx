'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type AgentType } from '@/types'

interface TransactionFiltersProps {
  filter: AgentType | 'all'
  onFilterChange: (filter: AgentType | 'all') => void
  counts: Record<string, number>
}

export function TransactionFilters({
  filter,
  onFilterChange,
  counts,
}: TransactionFiltersProps) {
  return (
    <Tabs
      value={filter}
      onValueChange={(v) => onFilterChange(v as AgentType | 'all')}
    >
      <TabsList className="h-9 bg-secondary">
        <TabsTrigger value="all" className="text-xs text-foreground/60 data-[state=active]:text-foreground">
          All ({counts.all || 0})
        </TabsTrigger>
        <TabsTrigger value="trading" className="text-xs text-foreground/60 data-[state=active]:text-foreground">
          Trading ({counts.trading || 0})
        </TabsTrigger>
        <TabsTrigger value="yield" className="text-xs text-foreground/60 data-[state=active]:text-foreground">
          Yield ({counts.yield || 0})
        </TabsTrigger>
        <TabsTrigger value="analytics" className="text-xs text-foreground/60 data-[state=active]:text-foreground">
          Analytics ({counts.analytics || 0})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
