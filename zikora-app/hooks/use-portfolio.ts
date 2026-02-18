'use client'

import { useState, useEffect, useCallback } from 'react'
import { type Portfolio } from '@/types'
import { getPortfolio } from '@/services/portfolio.service'
import { useAccount } from 'wagmi'

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { address } = useAccount()

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getPortfolio(address)
      setPortfolio(data)
    } catch (e) {
      setPortfolio(null)
      setError(e instanceof Error ? e.message : 'Failed to load portfolio')
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
        const data = await getPortfolio(address)
        if (!cancelled) setPortfolio(data)
      } catch (e) {
        if (!cancelled) {
          setPortfolio(null)
          setError(e instanceof Error ? e.message : 'Failed to load portfolio')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [address])

  return { portfolio, isLoading, error, refetch: load }
}
