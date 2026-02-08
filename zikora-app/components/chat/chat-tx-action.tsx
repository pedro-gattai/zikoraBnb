'use client'

import { ArrowRight, CheckCircle2, Loader2, XCircle, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TxHashLink } from '@/components/shared/tx-hash-link'
import { type TxAction } from '@/types'
import { cn } from '@/lib/utils'

interface ChatTxActionProps {
  txAction: TxAction
  txStatus?: 'idle' | 'signing' | 'confirming' | 'success' | 'error'
  txHash?: string
  txError?: string
  onSign: () => void
}

const TYPE_LABELS: Record<string, string> = {
  swap: 'Token Swap',
  supply: 'Supply to Venus',
  redeem: 'Redeem from Venus',
}

export function ChatTxAction({
  txAction,
  txStatus = 'idle',
  txHash,
  txError,
  onSign,
}: ChatTxActionProps) {
  const isDone = txStatus === 'success'
  const isError = txStatus === 'error'
  const isBusy = txStatus === 'signing' || txStatus === 'confirming'

  return (
    <Card className="mt-2 border-primary/30 bg-primary/5">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm font-medium">
          <Wallet className="h-4 w-4 text-primary" />
          <span>{TYPE_LABELS[txAction.type] || 'Transaction'}</span>
        </div>

        {/* Summary */}
        <p className="mt-1 text-sm text-muted-foreground">{txAction.summary}</p>

        {/* Details */}
        {txAction.details && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {txAction.details.fromToken && txAction.details.fromAmount && (
              <span>From: {txAction.details.fromAmount} {txAction.details.fromToken}</span>
            )}
            {txAction.details.toToken && txAction.details.toAmount && (
              <span className="flex items-center gap-1">
                <ArrowRight className="h-3 w-3" />
                {txAction.details.toAmount} {txAction.details.toToken}
              </span>
            )}
            {txAction.details.protocol && (
              <span>Via: {txAction.details.protocol}</span>
            )}
            {txAction.details.slippageBps != null && (
              <span>Slippage: {txAction.details.slippageBps / 100}%</span>
            )}
          </div>
        )}

        {/* Steps */}
        <div className="mt-3 space-y-1">
          {txAction.steps.map((step, i) => (
            <div key={i} className="text-xs text-muted-foreground">
              <span className="font-mono text-primary/70">Step {i + 1}:</span>{' '}
              {step.description}
            </div>
          ))}
        </div>

        {/* Action / Status */}
        <div className="mt-3">
          {isDone && txHash && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">Confirmed</span>
              <TxHashLink hash={txHash} />
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-500">
                {txError || 'Transaction failed'}
              </span>
            </div>
          )}

          {isBusy && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                {txStatus === 'signing'
                  ? 'Waiting for signature...'
                  : 'Confirming on-chain...'}
              </span>
            </div>
          )}

          {txStatus === 'idle' && (
            <Button
              onClick={onSign}
              size="sm"
              className={cn(
                'w-full gap-2',
              )}
            >
              <Wallet className="h-4 w-4" />
              Sign Transaction ({txAction.steps.length} step{txAction.steps.length > 1 ? 's' : ''})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
