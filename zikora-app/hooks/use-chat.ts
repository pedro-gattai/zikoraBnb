'use client'

import { useState, useCallback } from 'react'
import { type ChatMessage, type TxAction } from '@/types'
import { sendMessage } from '@/services/chat.service'
import { reportTransaction } from '@/services/transactions.service'
import { useAccount } from 'wagmi'
import { sendTransaction, waitForTransactionReceipt } from '@wagmi/core'
import { config } from '@/lib/wagmi'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()

  const updateMessage = useCallback(
    (id: string, updates: Partial<ChatMessage>) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      )
    },
    [],
  )

  const signTxAction = useCallback(
    async (messageId: string, txAction: TxAction) => {
      if (!address) return

      updateMessage(messageId, { txStatus: 'signing' })

      try {
        let lastHash: string | undefined

        for (const step of txAction.steps) {
          updateMessage(messageId, { txStatus: 'signing' })

          const hash = await sendTransaction(config, {
            to: step.to as `0x${string}`,
            data: step.data as `0x${string}`,
            value: BigInt(step.value),
          })

          updateMessage(messageId, { txStatus: 'confirming', txHash: hash })

          await waitForTransactionReceipt(config, { hash })

          lastHash = hash
        }

        updateMessage(messageId, {
          txStatus: 'success',
          txHash: lastHash,
        })

        // Report to backend
        reportTransaction({
          walletAddress: address,
          hash: lastHash!,
          type: txAction.type as 'swap' | 'supply' | 'redeem' | 'approve',
          status: 'success',
          summary: txAction.summary,
          details: txAction.details,
        }).catch(() => {})
      } catch (err: any) {
        const errorMsg =
          err?.shortMessage || err?.message || 'Transaction rejected'
        updateMessage(messageId, {
          txStatus: 'error',
          txError: errorMsg,
        })
      }
    },
    [address, updateMessage],
  )

  const send = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await sendMessage(content, address)

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          timestamp: new Date(),
          ...response,
          txStatus: response.txAction ? 'idle' : undefined,
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch {
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'system',
          content: 'Something went wrong. Please try again.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, address],
  )

  const clear = useCallback(() => {
    setMessages([])
  }, [])

  return { messages, isLoading, send, clear, signTxAction }
}
