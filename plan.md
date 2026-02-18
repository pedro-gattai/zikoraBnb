# 🐝 Zikora — DeFAI Multi-Agent Swarm for BNB Chain

> **Solana's "The Hive", rebuilt and enhanced for the BNB ecosystem.**

---

## 📋 TL;DR

Zikora is a DeFAI (DeFi + AI) platform that lets anyone interact with BNB Chain's DeFi ecosystem using natural language. Instead of navigating complex DEX interfaces and lending protocols, users simply chat with specialized AI agents that **prepare transactions** for the user to sign in MetaMask.

```
User: "Swap 100 USDT to BNB"
→ TradingAgent analyzes route, slippage, gas → prepares calldata → user signs in MetaMask → onchain tx

User: "Deposit 500 USDT into Venus to earn yield"
→ YieldAgent checks APY, utilization rate → prepares supply tx → user signs → shows estimated APY

User: "How's my portfolio doing?"
→ AnalyticsAgent fetches positions, calculates PnL → shows summary with recommendations
```

**Hackathon**: Good Vibes Only: OpenClaw Edition (BNB Chain)
**Prize Pool**: $100,000
**Deadline**: Feb 5-19, 2026
**Tracks**: AI Agents + DeFi

---

## 🎯 Problem

BNB Chain has **2.5M daily active users**, **$14B in stablecoins**, and dozens of DeFi protocols (PancakeSwap, Venus, Thena, Alpaca, etc). But the user experience is still:

1. **Manual and fragmented** — Users need to open PancakeSwap for swaps, Venus for lending, DexScreener for analytics — all separate
2. **Technical and intimidating** — Approving tokens, configuring slippage, understanding APY vs APR, calculating impermanent loss
3. **Zero intelligence** — No protocol says "hey, Venus USDT is paying 12% right now, want to take advantage?"
4. **No DeFAI** — Solana has The Hive ($122M mcap), Griffain, Neur, Cod3x. BNB has... nothing functional

The only project that tried (Bink AI) died — $83K mcap, $769/day volume. It was a dev SDK, not an end-user product.

---

## 💡 Solution

Zikora is an **end-user product** (web app) where users:

1. Connect their wallet (MetaMask/TrustWallet)
2. Chat in natural language with specialized agents
3. Backend prepares transaction calldata → frontend shows "Sign Transaction" card → user signs in MetaMask
4. Each agent executes onchain operations transparently — with reasoning explained

### Multi-Agent Architecture

This isn't a generic chatbot. These are **specialized agents** that collaborate:

| Agent | Responsibility | Protocols |
|-------|---------------|-----------|
| **🔄 TradingAgent** | Token swaps, route analysis, slippage optimization | PancakeSwap V3 |
| **💰 YieldAgent** | Supply/redeem on lending protocols, APY analysis | Venus Protocol |
| **📊 AnalyticsAgent** | Portfolio tracking, PnL, market data, recommendations | Onchain reads (PancakeSwap pools, Venus vTokens, ERC-20 balances) |
| **🧠 RouterAgent** | Receives user input, understands intent, delegates to the right agent | Orchestrates others |

### Flow

```
User Input (natural language)
    ↓
RouterAgent (LLM classifies intent)
    ↓
Specialized Agent (prepares calldata + reasoning)
    ↓
Frontend (shows "Sign Transaction" card)
    ↓
User signs in MetaMask
    ↓
Transaction confirmed on BSC
```

---

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND — Next.js 14 + TypeScript + wagmi + RainbowKit│
│  • Chat interface (conversational UI)                    │
│  • Portfolio dashboard                                   │
│  • Decision history + reasoning logs                     │
│  • Wallet connect + tx signing (non-custodial)           │
└─────────────┬───────────────────────────────────────────┘
              │ HTTP
┌─────────────▼───────────────────────────────────────────┐
│  BACKEND — NestJS + TypeScript                           │
│  ├─ RouterAgent (classifies user intent)                 │
│  ├─ TradingAgent (prepares swap calldata)                │
│  ├─ YieldAgent (prepares supply/redeem calldata)         │
│  ├─ AnalyticsAgent (portfolio, PnL, market data)         │
│  ├─ Market Data Service (onchain reads: prices, APYs)    │
│  ├─ Safety Validator (slippage, balance, allowance)      │
│  └─ Decision Logger (saves reasoning + outcome)          │
└─────────────────────────────────────────────────────────┘
              │ User signs tx in MetaMask
┌─────────────▼───────────────────────────────────────────┐
│  BNB SMART CHAIN                                         │
│  ├─ PancakeSwap V3 Smart Router (swaps)                  │
│  ├─ Venus Protocol (vUSDT, vBNB — lending)               │
│  └─ Token contracts (USDT, WBNB, USDC)                   │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contracts | Solidity 0.8.20 + Hardhat |
| Frontend | Next.js 14 + TypeScript + Tailwind + wagmi + RainbowKit |
| Backend | NestJS + TypeScript |
| AI/LLM | Google Gemini 2.5 Pro |
| Blockchain | BSC Mainnet/Testnet (gas ~$0.001/tx) |
| Hosting | Vercel (front) + Railway (back) |

### Smart Contract — ZikoraVault.sol

> **Note:** ZikoraVault.sol was built for the custodial v1 architecture. The current architecture is **non-custodial**: the backend prepares calldata and the user signs transactions directly in MetaMask. The vault contract exists in the repo but is not deployed or used.

```solidity
// Simplified concept (v1 — not used in current architecture)
contract ZikoraVault {
    address public owner;        // User — full control
    address public operator;     // Backend — executes operations

    uint256 public maxTradePercent = 25;  // Max 25% per operation
    uint256 public maxSlippageBps = 100;  // Max 1% slippage

    // Owner functions
    function deposit(address token, uint256 amount) external onlyOwner;
    function withdraw(address token, uint256 amount) external onlyOwner;
    function pause() external onlyOwner;
    function setOperator(address newOperator) external onlyOwner;

    // Operator functions (backend executes, limits enforced)
    function executeSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMin,
        uint24 fee
    ) external onlyOperator;

    function executeVenusSupply(address vToken, uint256 amount) external onlyOperator;
    function executeVenusRedeem(address vToken, uint256 amount) external onlyOperator;
}
```

### Launch Integrations (MVP)

Zikora launches with **two protocol integrations** — done well, not five done poorly. Every additional protocol is 1-2 days of extra dev time that doesn't add value for the hackathon.

| Protocol | Agent | Operations | Why |
|----------|-------|-----------|-----|
| **PancakeSwap V3** | TradingAgent | Swap tokens (exact input/output), quote prices | Dominant BSC DEX (~70% volume), mature contracts, judges expect it |
| **Venus Protocol** | YieldAgent | Supply, redeem, check APY/utilization | Largest BSC lending protocol ($2B+ TVL), verified contracts, straightforward integration |

**Post-hackathon expansions**: Thena (concentrated liquidity), Alpaca Finance (leveraged yield), ListaDAO (liquid staking), PancakeSwap LP positions.

### Onchain Data Sources (Zero External APIs)

All market data is read **directly from smart contracts** — no CoinGecko, no DexScreener, no third-party API dependencies. This is a key differentiator: fully onchain data, zero external dependencies.

| Data | Source | Contract Method |
|------|--------|----------------|
| Token prices (USD) | PancakeSwap V3 Quoter | `quoteExactInputSingle()` |
| Pool liquidity | PancakeSwap V3 Pool | `liquidity()`, `slot0()` |
| Supply APY | Venus vToken | `supplyRatePerBlock()` × blocks/year |
| Borrow APY | Venus vToken | `borrowRatePerBlock()` × blocks/year |
| Utilization rate | Venus vToken | `totalBorrows() / (totalBorrows() + getCash())` |
| User lending positions | Venus vToken | `balanceOfUnderlying(address)` |
| Collateral factor | Venus Comptroller | `markets(vToken)` |
| ERC-20 balances | Token contracts | `balanceOf(address)` |
| BNB balance | BSC RPC | `eth_getBalance(address)` |

### Protocol Addresses (BSC Mainnet)

| Protocol | Contract | Address |
|----------|----------|---------|
| PancakeSwap V3 | Smart Router | `0x13f4EA83D0bd40E75C8222255bc855a974568Dd4` |
| PancakeSwap V3 | QuoterV2 | `0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997` |
| PancakeSwap V3 | Factory | `0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865` |
| Venus | vUSDT | `0xfD5840Cd36d94D7229439859C0112a4185BC0255` |
| Venus | vBNB | `0xA07c5b74C9B40447a954e1466938b865b6BBea36` |
| Venus | Comptroller | `0xfD36E2c2a6789Db23113685031d7F16329158384` |
| Tokens | USDT (BSC) | `0x55d398326f99059fF775485246999027B3197955` |
| Tokens | WBNB | `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c` |
| Tokens | USDC (BSC) | `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d` |

---

## 🔄 Usage Examples

### Token Swap
```
User: "Swap 200 USDT to BNB"

RouterAgent: Intent detected → SWAP → delegating to TradingAgent

TradingAgent:
  📊 Analysis:
  • Pair: USDT → BNB
  • BNB Price: $650.32
  • Best route: USDT → WBNB (fee tier 0.05%)
  • Estimated slippage: 0.12%
  • Estimated gas: $0.003

  ✅ Transaction prepared. Sign in MetaMask to swap 200 USDT → ~0.3073 BNB

  💡 Reasoning: "Chose the 0.05% fee pool because it has $45M TVL
  and the best price for this order size. Slippage of 0.12%
  is within acceptable limits."
```

### Venus Supply
```
User: "I want to earn yield on my USDT, where's the best rate?"

RouterAgent: Intent detected → YIELD_ANALYSIS + SUPPLY → delegating to YieldAgent

YieldAgent:
  📊 Yield Analysis (BNB Chain):
  • Venus USDT: 8.2% APY (utilization 67% ✅)
  • Venus BNB: 3.1% APY (utilization 82% ⚠️)
  • PancakeSwap USDT-USDC: 12.1% APY (IL risk: low)

  💡 Recommendation: Venus USDT is the best risk-adjusted option.
  67% utilization indicates good liquidity for withdrawals anytime.

  Want me to prepare the transaction? If so, how much?

User: "Deposit 500 USDT"

YieldAgent:
  ✅ Transaction prepared. Sign in MetaMask to supply 500 USDT to Venus.
  📈 Estimated APY: 8.2% (~$41/year on 500 USDT)
```

### Portfolio Analytics
```
User: "Show me my portfolio"

AnalyticsAgent:
  📊 Zikora Portfolio
  ━━━━━━━━━━━━━━━━━━━
  💰 Total: $1,847.23
  📈 PnL: +$47.23 (+2.6%)

  Positions:
  • 1.2 BNB ($780.38) — 42.2%
  • 500 USDT on Venus ($503.41, +$3.41 yield) — 27.2%
  • 563.44 USDT liquid — 30.5%

  📊 Last 24h:
  • BNB: +1.8%
  • Venus USDT APY: 8.2% (stable)

  💡 Suggestion: You have 30% in idle USDT. At current Venus
  APY (8.2%), that could be earning ~$46/year extra.
```

---

## 🌱 Value to the BNB Ecosystem

### 1. Onboarding New Users
DeFi's biggest barrier is complexity. Zikora transforms "open 5 different sites, understand slippage, approve tokens" into "say what you want in plain English." This brings in users who would never use DeFi directly.

### 2. Increased TVL for Protocols
Every Zikora operation is a real transaction on PancakeSwap or Venus. More TVL, more volume, more fees for protocols and LPs.

### 3. AI + BNB Chain Showcase
BNB Chain is investing heavily in AI (ERC-8004, BAP-578, Eliza plugin, AI Agent Solution). Zikora is a **functional demonstration** that BNB Chain can compete with Solana in the DeFAI space.

### 4. Open Source Infrastructure for Builders
The codebase will be fully open-source. Other devs can fork it, add new agents (e.g., a Thena agent, an Alpaca agent), or integrate new protocols.

---

## 💰 Business Model (Post-Hackathon)

### Revenue Streams

| Stream | Description | Projection |
|--------|-------------|------------|
| **Performance Fee** | 1-2% on yield generated by agents | Scales with TVL |
| **Swap Fee** | 0.05% on executed swap volume | Volume-driven |
| **Premium Agents** | Advanced agents (arbitrage, cross-protocol) via subscription | $10-50/month |
| **Agent Marketplace** | Devs create agents, monetize them, platform takes 10% | Platform fee |
| **API/SDK** | Other dApps integrate our agents via API | B2B |

### Conservative Year 1 Projection

```
Scenario: 1,000 active users, $5M aggregate TVL
• Performance Fee (1% on $5M yield ~10%): $50K/year
• Swap Fee (0.05% on $2M volume/month): $12K/year
• Premium (100 users × $20/month): $24K/year
• Estimated total: ~$86K/year
```

### Token (Future — NOT during hackathon)
- Hackathon rules prohibit token launches during the event
- Possible governance token post-hackathon for community ownership of agents
- Staking for premium agent access
- Fee sharing with holders

---

## 🛣️ Roadmap

### Phase 1 — Hackathon MVP (Feb 5-19, 2026) ← WE ARE HERE

**Goal**: Functional end-to-end product with onchain proof

| Day | Task | Deliverable |
|-----|------|-------------|
| 1-2 | Repo setup + Smart Contracts | ZikoraVault.sol written (not deployed — non-custodial arch) |
| 3-5 | Backend + AI Agents | TradingAgent + YieldAgent + AnalyticsAgent working |
| 6-8 | Frontend | Chat UI + Dashboard + Wallet Connect + Signing flow |
| 9-10 | Integration | End-to-end functional, tests, bug fixes |
| 11-12 | Polish + Deploy | UI polish, deploy to cloud |
| 13-14 | Submission | Demo video, README, AI Build Log, submit DoraHacks |

**MVP Features**:
- ✅ Chat interface — natural language interaction
- ✅ Swap tokens via PancakeSwap V3
- ✅ Supply/redeem on Venus Protocol
- ✅ Portfolio tracking + PnL
- ✅ Transparent reasoning on every decision
- ✅ Onchain tx hash as proof
- ✅ Decision history

### Phase 2 — Growth (Mar-Apr 2026)

- More protocols: Thena, Alpaca Finance, ListaDAO
- Autonomous agent (automatic rebalancing with user permission)
- Opportunity notifications ("Venus APY jumped to 15%!")
- Multi-language support (EN, PT-BR, CN)
- Mobile-responsive

### Phase 3 — Platform (May-Jul 2026)

- Agent Marketplace — any dev creates and monetizes agents
- Agent-to-agent communication (FXN-style)
- Cross-chain (BSC ↔ opBNB ↔ Ethereum)
- Telegram bot integration
- Token + DAO governance

### Phase 4 — Scale (2026 H2)

- Institutional agents (treasury management)
- Fine-tuned AI model for BNB Chain DeFi
- Partnerships with PancakeSwap, Venus, BNB Chain officially
- Series A funding

---

## 🏆 Why We Will Win

### 1. Real Gap in the Ecosystem
BNB Chain literally has no functional end-user DeFAI product. Solana has 5+. We're filling an obvious gap that BNB Chain itself wants to see filled.

### 2. Product, Not Framework
Bink AI, TermiX, AgentKit — they're all SDKs/frameworks for developers. We're building a **product anyone can use**. Open the site, connect wallet, chat.

### 3. Strong Onchain Proof
Every operation is a verifiable transaction on BSC. Swap on PancakeSwap = tx hash. Supply on Venus = tx hash. Judges can verify everything.

### 4. AI Build Log
We'll use Claude Code to build and document every development decision. This earns extra recognition in the hackathon.

### 5. Build in Public
Daily posts on X with #VibingOnBNB, public GitHub, progressive demos. 40% of the score is community voting.

---

## 📐 Competitive Differentiation

| | **Zikora** | Bink AI | TermiX | ChainGPT |
|---|---|---|---|---|
| **Type** | End-user product | Dev SDK | No-code framework | Analytics chatbot |
| **DeFi Execution** | ✅ Swap + Lending | ✅ Swap + Bridge | ⚠️ Via DeFAI Kits | ❌ No execution |
| **Multi-Agent** | ✅ Specialized | ❌ Single agent | ⚠️ Workflows | ❌ Single chatbot |
| **Reasoning** | ✅ Transparent | ❌ Black box | ❌ Not shown | ❌ N/A |
| **Frontend** | ✅ Chat + Dashboard | ❌ Telegram bot | ⚠️ Drag-and-drop | ✅ Chatbot |
| **Custodial** | ❌ Non-custodial | ✅ Custodial | ⚠️ Varies | ❌ N/A |
| **Status** | 🟡 Building | 🔴 Dead ($83K mcap) | 🟡 Infra | 🟢 Active (analytics) |
| **Open Source** | ✅ Full | ✅ Framework | ✅ Kits | ⚠️ Partial |

---

## 🏗️ Repository Structure

```
zikora/
├── contracts/              # Smart Contracts (Hardhat)
│   ├── contracts/
│   │   └── ZikoraVault.sol
│   ├── scripts/
│   │   └── deploy.ts
│   ├── test/
│   │   └── ZikoraVault.test.ts
│   └── hardhat.config.ts
│
├── server/                 # Backend (NestJS)
│   ├── src/
│   │   ├── agents/
│   │   │   ├── router.agent.ts       # Classifies intent
│   │   │   ├── trading.agent.ts      # Swaps
│   │   │   ├── yield.agent.ts        # Lending
│   │   │   └── analytics.agent.ts    # Portfolio
│   │   ├── services/
│   │   │   ├── market-data.service.ts
│   │   │   ├── blockchain.service.ts
│   │   │   └── llm.service.ts
│   │   ├── validators/
│   │   │   └── safety.validator.ts
│   │   └── main.ts
│   └── package.json
│
├── client/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing
│   │   │   ├── chat/page.tsx         # Chat interface
│   │   │   └── dashboard/page.tsx    # Portfolio
│   │   ├── components/
│   │   │   ├── Chat.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── PortfolioDashboard.tsx
│   │   │   └── DecisionHistory.tsx
│   │   └── hooks/
│   │       └── useZikoraAgent.ts
│   └── package.json
│
├── PLAN.md                 # ← This document
├── AI_BUILD_LOG.md         # Development log with AI
├── README.md               # Setup instructions
└── .env.example
```

---

## ⚙️ Development Setup

### Prerequisites
- Node.js 18+
- pnpm
- Gemini API Key (free at aistudio.google.com)
- BNB Chain RPC (public or Ankr/NodeReal)

### Environment Variables
```env
# Blockchain
BSC_RPC_URL=https://data-seed-prebsc-1-s1.bnbchain.org:8545
CHAIN_ID=97

# AI
GEMINI_API_KEY=<your key from aistudio.google.com>

# Frontend
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📊 Estimated Costs

| Item | Cost |
|------|------|
| BSC gas (testnet) | $0 (faucet) |
| BSC gas (mainnet, ~200 txs) | ~$0.20 |
| Gemini API (free tier) | $0 |
| Vercel (frontend hosting) | $0 (free tier) |
| Railway (backend hosting) | $0 (free tier) |
| **Total hackathon** | **< $1** |

---

## 🔗 References

- **The Hive (Solana)**: https://github.com/ask-the-hive/the-hive — Primary inspiration
- **BNB Chain AgentKit**: https://github.com/node-real/bnb-chain-agentkit — BNB integration reference
- **BinkOS**: https://github.com/Bink-AI/BinkOS — Dead competitor, plugin reference
- **PancakeSwap V3**: https://github.com/pancakeswap/pancake-v3-contracts
- **Venus Protocol**: https://docs-v4.venus.io/
- **BAP-578 (NFA Standard)**: https://github.com/ChatAndBuild/non-fungible-agents-BAP-578
- **ERC-8004 (Trustless Agents)**: Deployed on BSC Mainnet (Feb 2026)
- **BNB Chain AI Agent Solution**: https://www.bnbchain.org/en/solutions/ai-agent
- **Good Vibes Only Hackathon**: https://dorahacks.io/hackathon/goodvibes/detail

---

## 👥 Team

- **Pedro** — CTO & Builder. Co-founder of Vault Capital (R$50M+ AUM, 250+ clients). 3x hackathon winner (Stellar Meridian, TON Payments, Stacks Vibe Coding). Full-stack developer (React, NestJS). Software Engineering @ Inteli, São Paulo.

---

## 📝 Notes

- **No token launch** during the hackathon (event rules)
- **Open source** from day 1 (public GitHub)
- **Build in public** — daily posts on X with progress
- **AI Build Log** — every dev decision documented (Claude Code)
- Non-custodial: backend never holds private keys. Users sign every transaction in MetaMask.
- Backend is read-only — prepares calldata only, no fund custody
