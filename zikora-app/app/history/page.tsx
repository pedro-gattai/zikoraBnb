'use client'

import { useMemo } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { TransactionList } from '@/components/history/transaction-list'
import { TransactionFilters } from '@/components/history/transaction-filters'
import { useHistory } from '@/hooks/use-history'
import { useAccount } from 'wagmi'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import { LoadingTimeout } from '@/components/shared/loading-timeout'

export default function HistoryPage() {
  const { transactions, allTransactions, isLoading, error, filter, setFilter, refetch } = useHistory()
  const { isConnected } = useAccount()

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: allTransactions.length }
    for (const tx of allTransactions) {
      c[tx.agent] = (c[tx.agent] || 0) + 1
    }
    return c
  }, [allTransactions])

  return (
    <AppShell>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-xl font-heading font-bold">Transaction History</h1>
          <p className="text-sm text-muted-foreground">All your DeFi operations</p>
        </div>

        {!isConnected ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="rounded-full bg-secondary p-3">
                <Wallet className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Connect your wallet to view transaction history</p>
              <p className="text-xs text-muted-foreground">
                Your swaps, supplies, and other operations will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <TransactionFilters
              filter={filter}
              onFilterChange={setFilter}
              counts={counts}
            />

            <TransactionList transactions={transactions} isLoading={isLoading} error={error} onRetry={refetch} />
            <LoadingTimeout isLoading={isLoading} />
          </>
        )}
      </div>
    </AppShell>
  )
}
