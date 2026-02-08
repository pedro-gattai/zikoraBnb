'use client'

import { useMemo } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { TransactionList } from '@/components/history/transaction-list'
import { TransactionFilters } from '@/components/history/transaction-filters'
import { useHistory } from '@/hooks/use-history'

export default function HistoryPage() {
  const { transactions, allTransactions, isLoading, filter, setFilter } = useHistory()

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

        <TransactionFilters
          filter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />

        <TransactionList transactions={transactions} isLoading={isLoading} />
      </div>
    </AppShell>
  )
}
