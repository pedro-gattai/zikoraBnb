export type AgentType = 'router' | 'trading' | 'yield' | 'analytics'

export interface TxStep {
  to: string
  data: string
  value: string
  description: string
}

export interface TxAction {
  type: 'swap' | 'supply' | 'redeem'
  summary: string
  steps: TxStep[]
  details: {
    fromToken?: string
    toToken?: string
    fromAmount?: string
    toAmount?: string
    protocol?: string
    slippageBps?: number
  }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  agent?: AgentType
  reasoning?: string
  txResult?: TxResult
  txAction?: TxAction
  txStatus?: 'idle' | 'signing' | 'confirming' | 'success' | 'error'
  txHash?: string
  txError?: string
  isLoading?: boolean
}

export interface TxResult {
  hash: string
  status: 'success' | 'failed' | 'pending'
  type: 'swap' | 'supply' | 'redeem' | 'approve'
  summary: string
  details: {
    fromToken?: string
    toToken?: string
    fromAmount?: string
    toAmount?: string
    protocol?: string
  }
}

export interface TokenBalance {
  symbol: string
  name: string
  balance: string
  balanceUsd: number
  price: number
  change24h: number
  icon?: string
}

export interface Position {
  id: string
  protocol: string
  type: 'lending' | 'liquidity' | 'staking'
  token: string
  amount: string
  valueUsd: number
  apy: number
  earnings: number
}

export interface Portfolio {
  totalValueUsd: number
  change24h: number
  change24hPercent: number
  tokens: TokenBalance[]
  positions: Position[]
  chartData: ChartDataPoint[]
}

export interface ChartDataPoint {
  date: string
  value: number
}

export interface Transaction {
  id: string
  hash: string
  type: 'swap' | 'supply' | 'redeem' | 'approve' | 'deposit' | 'withdraw'
  status: 'success' | 'failed' | 'pending'
  agent: AgentType
  timestamp: Date
  summary: string
  details: {
    fromToken?: string
    toToken?: string
    fromAmount?: string
    toAmount?: string
    protocol?: string
  }
  gasUsed?: string
  gasCostUsd?: number
}

export interface AgentConfig {
  type: AgentType
  name: string
  description: string
  color: string
  icon: string
}
