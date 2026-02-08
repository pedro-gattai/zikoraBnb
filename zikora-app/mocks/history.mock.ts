import { type Transaction } from '@/types'

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    hash: '0x8a3b7d2e1f4c6a9b0e3d5c8f7a2b1e4d6c9f0a3b5e8d7c6a9f0b3e2d1c4a5b6',
    type: 'swap',
    status: 'success',
    agent: 'trading',
    timestamp: new Date('2026-02-08T14:30:00'),
    summary: 'Swapped 0.1 BNB for 28.45 USDT',
    details: {
      fromToken: 'BNB',
      toToken: 'USDT',
      fromAmount: '0.1',
      toAmount: '28.45',
      protocol: 'PancakeSwap V3',
    },
    gasUsed: '0.0012',
    gasCostUsd: 0.34,
  },
  {
    id: '2',
    hash: '0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    type: 'approve',
    status: 'success',
    agent: 'yield',
    timestamp: new Date('2026-02-08T13:15:00'),
    summary: 'Approved USDT for Venus Protocol',
    details: {
      fromToken: 'USDT',
      protocol: 'Venus Protocol',
    },
    gasUsed: '0.0005',
    gasCostUsd: 0.14,
  },
  {
    id: '3',
    hash: '0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    type: 'supply',
    status: 'success',
    agent: 'yield',
    timestamp: new Date('2026-02-08T13:16:00'),
    summary: 'Supplied 10 USDT to Venus Protocol',
    details: {
      fromToken: 'USDT',
      toToken: 'vUSDT',
      fromAmount: '10',
      toAmount: '456.78',
      protocol: 'Venus Protocol',
    },
    gasUsed: '0.0018',
    gasCostUsd: 0.51,
  },
  {
    id: '4',
    hash: '0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    type: 'swap',
    status: 'success',
    agent: 'trading',
    timestamp: new Date('2026-02-07T10:22:00'),
    summary: 'Swapped 50 USDT for 0.176 BNB',
    details: {
      fromToken: 'USDT',
      toToken: 'BNB',
      fromAmount: '50',
      toAmount: '0.176',
      protocol: 'PancakeSwap V3',
    },
    gasUsed: '0.0012',
    gasCostUsd: 0.34,
  },
  {
    id: '5',
    hash: '0x4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    type: 'swap',
    status: 'failed',
    agent: 'trading',
    timestamp: new Date('2026-02-06T16:45:00'),
    summary: 'Swap 100 USDT to BNB failed (slippage exceeded)',
    details: {
      fromToken: 'USDT',
      toToken: 'BNB',
      fromAmount: '100',
      protocol: 'PancakeSwap V3',
    },
    gasUsed: '0.0008',
    gasCostUsd: 0.23,
  },
  {
    id: '6',
    hash: '0x5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    type: 'redeem',
    status: 'success',
    agent: 'yield',
    timestamp: new Date('2026-02-05T09:30:00'),
    summary: 'Redeemed 5 USDT from Venus Protocol',
    details: {
      fromToken: 'vUSDT',
      toToken: 'USDT',
      fromAmount: '228.39',
      toAmount: '5',
      protocol: 'Venus Protocol',
    },
    gasUsed: '0.0015',
    gasCostUsd: 0.43,
  },
]

export function getMockTransactions(): Promise<Transaction[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_TRANSACTIONS), 600)
  })
}
