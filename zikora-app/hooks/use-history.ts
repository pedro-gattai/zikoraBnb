'use client'

import { useState, useEffect } from 'react'
import { type Transaction, type AgentType } from '@/types'
import { getTransactions } from '@/services/history.service'
import { useAccount } from 'wagmi'

export function useHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<AgentType | 'all'>('all')
  const { address } = useAccount()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      try {
        const data = await getTransactions(address)
        if (!cancelled) setTransactions(data)
      } catch {
        if (!cancelled) setTransactions([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [address])

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter(tx => tx.agent === filter)

  return { transactions: filtered, allTransactions: transactions, isLoading, filter, setFilter }
}
