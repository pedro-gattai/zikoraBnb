import { apiFetch, isUsingMock } from './api'

export async function reportTransaction(body: {
  walletAddress: string
  hash: string
  type: 'swap' | 'supply' | 'redeem' | 'approve'
  status: 'success' | 'failed'
  summary: string
  details?: {
    fromToken?: string
    toToken?: string
    fromAmount?: string
    toAmount?: string
    protocol?: string
  }
  gasUsed?: string
}): Promise<void> {
  if (isUsingMock) return
  await apiFetch('/transactions', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
