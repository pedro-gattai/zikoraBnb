'use client'

import React, { useState } from 'react'
import { AppHeader } from './app-header'
import { AppSidebar, MobileNav } from './app-sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-1 items-center justify-center p-8">
          <Card className="max-w-md w-full">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-bold">Something went wrong</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {this.state.error?.message || 'An unexpected error occurred.'}
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                className="btn-interactive"
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      <AppHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-auto pb-14 md:pb-0">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
