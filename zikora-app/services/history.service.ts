import { type Transaction } from '@/types'
import { apiFetch } from './api'

export async function getTransactions(_walletAddress?: string): Promise<Transaction[]> {
  return apiFetch<Transaction[]>(`/transactions?address=${_walletAddress}`)
}
