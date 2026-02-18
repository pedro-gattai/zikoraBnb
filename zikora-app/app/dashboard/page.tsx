'use client'

import { AppShell } from '@/components/layout/app-shell'
import { PortfolioSummary } from '@/components/dashboard/portfolio-summary'
import { PositionsList } from '@/components/dashboard/positions-list'
import { PortfolioChart } from '@/components/dashboard/portfolio-chart'
import { usePortfolio } from '@/hooks/use-portfolio'
import { useAccount } from 'wagmi'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import { LoadingTimeout } from '@/components/shared/loading-timeout'

export default function DashboardPage() {
  const { portfolio, isLoading, error, refetch } = usePortfolio()
  const { isConnected } = useAccount()

  return (
    <AppShell>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-xl font-heading font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your portfolio overview</p>
        </div>

        {!isConnected ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="rounded-full bg-secondary p-3">
                <Wallet className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Connect your wallet to view portfolio</p>
              <p className="text-xs text-muted-foreground">
                Your holdings, positions, and performance will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <PortfolioSummary portfolio={portfolio} isLoading={isLoading} error={error} onRetry={refetch} />
            <LoadingTimeout isLoading={isLoading} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PortfolioChart
                data={portfolio?.chartData}
                isLoading={isLoading}
              />
              <PositionsList portfolio={portfolio} isLoading={isLoading} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
