import { type AgentConfig } from '@/types'

export const BSC_CHAIN_ID = 56

export const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://bscscan.com'

export const CONTRACTS = {
  vault: process.env.NEXT_PUBLIC_VAULT_ADDRESS || '',
  pancakeRouter: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4',
  pancakeFactory: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  venusComptroller: '0xfD36E2c2a6789Db23113685031d7F16329158384',
  usdt: '0x55d398326f99059fF775485246999027B3197955',
  wbnb: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  usdc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  busd: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
} as const

export const TOKENS: Record<string, { symbol: string; name: string; decimals: number }> = {
  BNB: { symbol: 'BNB', name: 'BNB', decimals: 18 },
  USDT: { symbol: 'USDT', name: 'Tether USD', decimals: 18 },
  USDC: { symbol: 'USDC', name: 'USD Coin', decimals: 18 },
  BUSD: { symbol: 'BUSD', name: 'Binance USD', decimals: 18 },
  WBNB: { symbol: 'WBNB', name: 'Wrapped BNB', decimals: 18 },
}

export const AGENTS: Record<string, AgentConfig> = {
  router: {
    type: 'router',
    name: 'Router',
    description: 'Classifies your intent and delegates to the right agent',
    color: '#FF6B2C',
    icon: 'Route',
  },
  trading: {
    type: 'trading',
    name: 'Trading Agent',
    description: 'Executes token swaps via PancakeSwap V3',
    color: '#00E676',
    icon: 'ArrowLeftRight',
  },
  yield: {
    type: 'yield',
    name: 'Yield Agent',
    description: 'Manages lending and yield via Venus Protocol',
    color: '#448AFF',
    icon: 'TrendingUp',
  },
  analytics: {
    type: 'analytics',
    name: 'Analytics Agent',
    description: 'Portfolio tracking, PnL analysis, and recommendations',
    color: '#AB47BC',
    icon: 'BarChart3',
  },
}

export const QUICK_PROMPTS = [
  { label: 'Swap tokens', prompt: 'Swap 0.1 BNB to USDT', agent: 'trading' as const },
  { label: 'Check portfolio', prompt: 'Show my portfolio summary', agent: 'analytics' as const },
  { label: 'Supply to Venus', prompt: 'Supply 10 USDT to Venus lending', agent: 'yield' as const },
  { label: 'Analyze PnL', prompt: 'What is my profit and loss?', agent: 'analytics' as const },
]
