'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Transaction, type AgentType } from '@/types'
import { getTransactions } from '@/services/history.service'
import { useAccount } from 'wagmi'

export function useHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<AgentType | 'all'>('all')
  const { address } = useAccount()

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getTransactions(address)
      setTransactions(data)
    } catch (e) {
      setTransactions([])
      setError(e instanceof Error ? e.message : 'Failed to load transactions')
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    let cancelled = false

    async function init() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getTransactions(address)
        if (!cancelled) setTransactions(data)
      } catch (e) {
        if (!cancelled) {
          setTransactions([])
          setError(e instanceof Error ? e.message : 'Failed to load transactions')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [address])

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter(tx => tx.agent === filter)

  return { transactions: filtered, allTransactions: transactions, isLoading, error, filter, setFilter, refetch: load }
}
