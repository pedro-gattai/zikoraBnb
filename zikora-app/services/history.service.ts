import { type Transaction } from '@/types'
import { isUsingMock, apiFetch } from './api'
import { getMockTransactions } from '@/mocks/history.mock'

export async function getTransactions(_walletAddress?: string): Promise<Transaction[]> {
  if (isUsingMock) {
    return getMockTransactions()
  }

  return apiFetch<Transaction[]>(`/transactions?address=${_walletAddress}`)
}
