import { type Portfolio } from '@/types'
import { apiFetch } from './api'

export async function getPortfolio(_walletAddress?: string): Promise<Portfolio> {
  return apiFetch<Portfolio>(`/portfolio?address=${_walletAddress}`)
}
