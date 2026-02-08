import { type ChatMessage, type AgentType, type TxAction } from '@/types'

interface MockResponse {
  agent: AgentType
  content: string
  reasoning: string
  txResult?: ChatMessage['txResult']
  txAction?: TxAction
}

const SWAP_RESPONSE: MockResponse = {
  agent: 'trading',
  content: 'Ready to swap **0.1 BNB** for ~**28.45 USDT** via PancakeSwap V3.\n\nMinimum output: 28.17 USDT (1% max slippage)\n\nPlease sign the transaction to proceed.',
  reasoning: 'Swap 0.1 BNB → USDT via PancakeSwap V3.\nExpected output: 28.45 USDT\nMinimum output (1% slippage): 28.17 USDT\nWallet balance sufficient. Transaction prepared for signing.',
  txAction: {
    type: 'swap',
    summary: 'Swap 0.1 BNB for ~28.45 USDT',
    steps: [
      {
        to: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4',
        data: '0x414bf389000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c00000000000000000000000055d398326f99059ff775485246999027b31979550000000000000000000000000000000000000000000000000000000000000000',
        value: '100000000000000000',
        description: 'Swap 0.1 BNB for ~28.45 USDT',
      },
    ],
    details: {
      fromToken: 'BNB',
      toToken: 'USDT',
      fromAmount: '0.1',
      toAmount: '28.45',
      protocol: 'PancakeSwap V3',
      slippageBps: 100,
    },
  },
}

const YIELD_RESPONSE: MockResponse = {
  agent: 'yield',
  content: 'Ready to supply **10 USDT** to Venus Protocol at **3.45% APY**.\n\nPlease sign the transaction to proceed.',
  reasoning: 'Supplying 10 USDT to Venus Protocol.\nCurrent APY: 3.45%\nWallet balance sufficient. Transaction prepared for signing.',
  txAction: {
    type: 'supply',
    summary: 'Supply 10 USDT to Venus (3.45% APY)',
    steps: [
      {
        to: '0x55d398326f99059fF775485246999027B3197955',
        data: '0x095ea7b3000000000000000000000000fd5840cd36d94d7229439859c0112a4185bc025500000000000000000000000000000000000000000000008ac7230489e80000',
        value: '0',
        description: 'Approve 10 USDT for Venus Protocol',
      },
      {
        to: '0xfD5840Cd36d94D7229439859C0112a4185BC0255',
        data: '0xa0712d6800000000000000000000000000000000000000000000008ac7230489e80000',
        value: '0',
        description: 'Supply 10 USDT to Venus (3.45% APY)',
      },
    ],
    details: {
      fromToken: 'USDT',
      fromAmount: '10',
      protocol: 'Venus Protocol',
    },
  },
}

const ANALYTICS_RESPONSE: MockResponse = {
  agent: 'analytics',
  content: `Here's your portfolio summary:\n\n**Total Value:** $1,234.56\n**24h Change:** +$12.34 (+1.01%)\n\n**Holdings:**\n- 0.5 BNB ($142.25)\n- 500 USDT ($500.00)\n- 200 USDC ($200.00)\n\n**Active Positions:**\n- Venus USDT Supply: $392.31 (APY 3.45%)\n\nYour portfolio is well-diversified with a mix of stablecoins and BNB exposure. Consider increasing your yield positions to maximize returns.`,
  reasoning: 'User is asking about their portfolio. I\'ll pull data from their wallet balances on BSC Testnet. Calculating total value, 24h changes, and active DeFi positions. Generating a comprehensive summary with actionable insights.',
}

const DEFAULT_RESPONSE: MockResponse = {
  agent: 'router',
  content: 'I can help you with DeFi operations on BSC Testnet. Here\'s what I can do:\n\n- **Swap tokens** — "Swap 0.1 BNB to USDT"\n- **Supply for yield** — "Supply 10 USDT to Venus"\n- **Check portfolio** — "Show my portfolio"\n- **Analyze performance** — "What\'s my PnL?"\n\nJust type what you\'d like to do in natural language!',
  reasoning: 'The user\'s message doesn\'t match a specific DeFi intent. Providing a helpful guide of available capabilities so they know what they can ask for.',
}

function classifyIntent(message: string): MockResponse {
  const lower = message.toLowerCase()

  if (lower.match(/swap|trade|exchange|convert|buy|sell/)) {
    return SWAP_RESPONSE
  }
  if (lower.match(/supply|deposit|lend|yield|venus|earn|stake/)) {
    return YIELD_RESPONSE
  }
  if (lower.match(/portfolio|balance|holding|position|pnl|profit|loss|performance|summary|analyz/)) {
    return ANALYTICS_RESPONSE
  }

  return DEFAULT_RESPONSE
}

export function getMockResponse(userMessage: string): Promise<MockResponse> {
  return new Promise((resolve) => {
    const delay = 1000 + Math.random() * 1500
    setTimeout(() => resolve(classifyIntent(userMessage)), delay)
  })
}
