import { type AgentConfig } from '@/types'

export const BSC_TESTNET_CHAIN_ID = 97

export const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://testnet.bscscan.com'

export const CONTRACTS = {
  vault: process.env.NEXT_PUBLIC_VAULT_ADDRESS || '',
  pancakeRouter: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
  pancakeFactory: '0x6725f303b657a9451d8BA641348b6761A6CC7a17',
  venusComptroller: '0xfD36E2c2a6789Db23113685031d7F16329158384',
  usdt: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
  wbnb: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  usdc: '0x64544969ed7EBf5f083679233325356EbE738930',
  busd: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
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
