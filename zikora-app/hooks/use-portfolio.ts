'use client'

import { useState, useEffect } from 'react'
import { type Portfolio } from '@/types'
import { getPortfolio } from '@/services/portfolio.service'
import { useAccount } from 'wagmi'

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { address } = useAccount()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      try {
        const data = await getPortfolio(address)
        if (!cancelled) setPortfolio(data)
      } catch {
        if (!cancelled) setPortfolio(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [address])

  return { portfolio, isLoading }
}
