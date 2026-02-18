'use client'

import { useState, useEffect } from 'react'

interface LoadingTimeoutProps {
  isLoading: boolean
  delay?: number
}

export function LoadingTimeout({ isLoading, delay = 8000 }: LoadingTimeoutProps) {
  const [showTimeout, setShowTimeout] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShowTimeout(false)
      return
    }

    const timer = setTimeout(() => setShowTimeout(true), delay)
    return () => clearTimeout(timer)
  }, [isLoading, delay])

  if (!isLoading || !showTimeout) return null

  return (
    <p className="animate-fade-in-up text-center text-xs text-muted-foreground">
      Taking longer than expected...
    </p>
  )
}
