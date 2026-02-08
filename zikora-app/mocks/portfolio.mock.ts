import { type Portfolio } from '@/types'

export const MOCK_PORTFOLIO: Portfolio = {
  totalValueUsd: 1234.56,
  change24h: 12.34,
  change24hPercent: 1.01,
  tokens: [
    {
      symbol: 'BNB',
      name: 'BNB',
      balance: '0.5',
      balanceUsd: 142.25,
      price: 284.50,
      change24h: 2.3,
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      balance: '500.00',
      balanceUsd: 500.00,
      price: 1.00,
      change24h: 0.01,
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '200.00',
      balanceUsd: 200.00,
      price: 1.00,
      change24h: -0.02,
    },
  ],
  positions: [
    {
      id: '1',
      protocol: 'Venus Protocol',
      type: 'lending',
      token: 'USDT',
      amount: '392.31',
      valueUsd: 392.31,
      apy: 3.45,
      earnings: 4.52,
    },
  ],
  chartData: [
    { date: '2026-02-01', value: 1180 },
    { date: '2026-02-02', value: 1195 },
    { date: '2026-02-03', value: 1210 },
    { date: '2026-02-04', value: 1190 },
    { date: '2026-02-05', value: 1205 },
    { date: '2026-02-06', value: 1220 },
    { date: '2026-02-07', value: 1228 },
    { date: '2026-02-08', value: 1234.56 },
  ],
}

export function getMockPortfolio(): Promise<Portfolio> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PORTFOLIO), 800)
  })
}
