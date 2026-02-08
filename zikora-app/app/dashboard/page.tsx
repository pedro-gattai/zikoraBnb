'use client'

import { AppShell } from '@/components/layout/app-shell'
import { PortfolioSummary } from '@/components/dashboard/portfolio-summary'
import { PositionsList } from '@/components/dashboard/positions-list'
import { PortfolioChart } from '@/components/dashboard/portfolio-chart'
import { usePortfolio } from '@/hooks/use-portfolio'

export default function DashboardPage() {
  const { portfolio, isLoading } = usePortfolio()

  return (
    <AppShell>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-xl font-heading font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your portfolio overview</p>
        </div>

        <PortfolioSummary portfolio={portfolio} isLoading={isLoading} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PortfolioChart
            data={portfolio?.chartData}
            isLoading={isLoading}
          />
          <PositionsList portfolio={portfolio} isLoading={isLoading} />
        </div>
      </div>
    </AppShell>
  )
}
