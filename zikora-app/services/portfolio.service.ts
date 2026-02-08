import { type Portfolio } from '@/types'
import { isUsingMock, apiFetch } from './api'
import { getMockPortfolio } from '@/mocks/portfolio.mock'

export async function getPortfolio(_walletAddress?: string): Promise<Portfolio> {
  if (isUsingMock) {
    return getMockPortfolio()
  }

  return apiFetch<Portfolio>(`/portfolio?address=${_walletAddress}`)
}
