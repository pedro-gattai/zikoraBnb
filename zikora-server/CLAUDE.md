# CLAUDE.md — Zikora Server (Backend + AI Agents)

## What is this?

NestJS backend that powers the Zikora DeFAI platform. Receives natural language messages, classifies intent via LLM, prepares transaction calldata for user signing. Non-custodial — no private keys, read-only blockchain access.

---

## Tech Stack

- **NestJS 10** + **TypeScript** (ES2021 target, commonjs)
- **ethers.js 6** — read-only blockchain interactions
- **@google/generative-ai 0.21** — Google Gemini 2.5 Pro
- **@nestjs/config** — environment variables
- **@nestjs/throttler** — rate limiting (20 req / 10 min on /chat)

---

## Source Structure

```
src/
├── main.ts                      # Bootstrap (CORS, ValidationPipe, port)
├── app.module.ts                # Root module (imports all modules)
├── config/
│   ├── addresses.ts             # Chain-specific contract addresses (by chainId)
│   └── tokens.ts                # Token metadata, getTokens(chainId), resolveToken()
├── abis/                        # Contract ABIs (JSON, copied to dist via nest-cli)
│   ├── ERC20.json
│   ├── PancakeV3Router.json     # exactInputSingle
│   ├── PancakeV3Quoter.json     # quoteExactInputSingle
│   ├── VToken.json              # mint, redeemUnderlying, supplyRatePerBlock
│   ├── VenusComptroller.json
│   └── ZikoraVault.json         # Legacy — not used in current architecture
├── blockchain/                  # @Global() — ethers provider + calldata encoding
│   ├── blockchain.service.ts
│   └── blockchain.module.ts
├── market-data/                 # Price quotes, balances, APYs (in-memory cache)
│   ├── market-data.service.ts
│   └── market-data.module.ts
├── llm/                         # @Global() — Google Gemini integration
│   ├── llm.service.ts           # classifyIntent(), generateResponse()
│   └── llm.module.ts
├── agents/                      # AI agent pipeline
│   ├── router.agent.ts          # Intent classification → delegation
│   ├── trading.agent.ts         # PancakeSwap V3 swaps
│   ├── yield.agent.ts           # Venus Protocol supply/redeem
│   ├── analytics.agent.ts       # Portfolio analysis + LLM insights
│   └── agents.module.ts
├── chat/                        # POST /chat endpoint
│   ├── chat.controller.ts
│   ├── chat.service.ts
│   └── chat.module.ts
├── portfolio/                   # GET /portfolio/:address endpoint
│   ├── portfolio.controller.ts
│   ├── portfolio.service.ts
│   └── portfolio.module.ts
├── transactions/                # GET/POST /transactions endpoint
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   └── transactions.module.ts
└── store/                       # @Global() — in-memory storage (Maps)
    ├── store.service.ts
    └── store.module.ts
```

---

## Agent Architecture

```
User message (POST /chat)
    ↓
RouterAgent.handleMessage()
    ↓
LlmService.classifyIntent()  →  Gemini 2.5 Pro (256 tokens max)
    ↓
Switch: 'trading' | 'yield' | 'analytics' | 'general'
    ↓
Specialized Agent
    ↓
MarketDataService (quotes, balances, APYs)
    ↓
BlockchainService.encode*() (calldata)
    ↓
AgentResponse { content, agent, txAction?, reasoning? }
```

**Agents:**
- **RouterAgent** — classifies intent, delegates to specialized agent
- **TradingAgent** — validates tokens, checks balance, gets quote, encodes swap calldata
- **YieldAgent** — Venus supply/redeem, APY info, encodes mint/redeem calldata
- **AnalyticsAgent** — aggregates portfolio data, uses LLM for insights

---

## REST Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/chat` | POST | Send message, get agent response (rate-limited: 20/10min) |
| `/portfolio` | GET | Portfolio breakdown (`?address=0x...`) |
| `/transactions` | GET | Transaction history (`?address=0x...`) |
| `/transactions` | POST | Report completed transaction |

**POST /chat body:** `{ message: string, walletAddress?: string }`
**POST /chat response:** `{ role, content, agent, txAction?, reasoning? }`

---

## Module Organization

**@Global() modules** (available everywhere):
- `StoreModule` — in-memory Maps (transactions, chatHistory)
- `BlockchainModule` — ethers.js provider, contract interfaces, calldata encoding
- `LlmModule` — Google Gemini integration

**Non-global modules:**
- `MarketDataModule` — quotes, balances, prices, APYs (60s/5min cache)
- `AgentsModule` — RouterAgent, TradingAgent, YieldAgent, AnalyticsAgent
- `ChatModule` → `PortfolioModule` → `TransactionsModule`

---

## Config System

**`config/addresses.ts`** — contract addresses keyed by chainId:
- Chain 56 (BSC Mainnet): PancakeSwap V3, Venus Protocol, tokens
- Chain 97 (BSC Testnet): testnet equivalents

**`config/tokens.ts`** — token metadata:
- `getTokens(chainId)` → `Record<symbol, TokenMeta>`
- `resolveToken(symbolOrAddress, chainId)` → `TokenMeta | undefined`
- Supported: BNB, WBNB, USDT, USDC

---

## LLM Integration

**Model:** Google Gemini 2.5 Pro (`gemini-2.5-pro`)
**Env var:** `GEMINI_API_KEY`

Two methods:
1. `classifyIntent(message)` → `{ agent, params: { fromToken, toToken, amount, action } }`
2. `generateResponse(systemPrompt, userMessage, context?)` → string (1024 tokens max)

Regex fallback if API is unavailable.

---

## Safety Checks

- **Slippage:** Capped at 1% (100 BPS) — hard-coded in TradingAgent
- **Balance check:** Before every swap/supply operation
- **Allowance check:** Prepares approve step if needed
- **Token whitelist:** Only BNB, WBNB, USDT, USDC
- **Non-custodial:** No private keys. Only encodes calldata for frontend signing
- **Read-only:** All blockchain calls are view functions

---

## Environment Variables

```bash
# .env.example
PORT=3001
BSC_RPC_URL=https://data-seed-prebsc-1-s1.bnbchain.org:8545
GEMINI_API_KEY=your-key-here
CHAIN_ID=97
CORS_ORIGINS=https://zikora.vercel.app,https://zikora-app.vercel.app
```

CORS also allows `localhost:3000`, `localhost:3001`, `*.vercel.app`, `*.pages.dev` by default.

---

## Commands

```bash
pnpm install
pnpm start:dev    # Dev with watch mode (port 3001)
pnpm build        # Compile to dist/
pnpm start:prod   # Run compiled (node dist/main)
```

---

## Key Files

- `nest-cli.json` — copies `abis/**/*.json` to dist, watchAssets enabled
- `tsconfig.json` — ES2021, commonjs, resolveJsonModule (for ABI imports)
- ABIs use ethers.js human-readable format (ERC20) and full ABI format (Router, VToken)

---

## Conventions

- NestJS module pattern: each feature has controller, service, module
- Dependency injection via constructor
- All agents return `AgentResponse` type
- Every operation includes transparent reasoning in the response
- In-memory storage only (StoreService) — no database
- Market data cached with TTL (60s prices, 5min APYs)
