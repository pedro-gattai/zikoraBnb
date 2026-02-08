# Zikora — Benchmarks & Progress Tracker

> Hackathon: Good Vibes Only: OpenClaw Edition (BNB Chain)
> Deadline: Feb 19, 2026
> Started: Feb 5, 2026

---

## Phase 1 — Hackathon MVP (Feb 5-19)

### Infra & Repo Setup (Days 1-2)
- [x] Create brand kit (logo, colors, fonts, design system)
- [x] Build landing page with V0
- [x] Organize monorepo structure (`zikora-landing-page/`, `zikora-brand/`)
- [x] Create CLAUDE.md and BENCHMARKS.md
- [x] Initialize `zikora-contracts/` (Hardhat + Solidity setup)
- [x] Initialize `zikora-server/` (NestJS project)
- [x] Initialize `zikora-app/` (Next.js + wagmi + RainbowKit)
- [x] Set up `.env.example` with all required variables
- [ ] Configure BSC Testnet RPC + faucet BNB 👤

### Smart Contracts (Days 1-3)
- [x] Write `ZikoraVault.sol` (deposit, withdraw, executeSwap, executeSupply, executeRedeem)
- [x] Implement operator pattern (owner vs operator roles)
- [x] Add safety limits (maxTradePercent 25%, maxSlippageBps 100)
- [x] Add pause/unpause functionality
- [x] Write unit tests for ZikoraVault

> **Note:** ZikoraVault.sol was built for the custodial v1 architecture. The current architecture is **non-custodial**: the backend prepares calldata and the user signs transactions directly in MetaMask. The vault contract exists in the repo but is not deployed or used.

### Backend — AI Agents (Days 3-5)
- [x] Set up NestJS project structure (modules, services, controllers)
- [x] Implement `BlockchainService` (ethers.js provider, contract interactions)
- [x] Implement `MarketDataService` (onchain reads: prices, APYs, pool data)
- [x] Implement `LLMService` (Claude API integration — Sonnet 4.5)
- [x] Implement `RouterAgent` (intent classification, delegation)
- [x] Implement `TradingAgent` (PancakeSwap V3 swap execution + reasoning)
- [x] Implement `YieldAgent` (Venus Protocol supply/redeem + APY analysis)
- [x] Implement `AnalyticsAgent` (portfolio tracking, PnL, recommendations)
- [x] Implement safety checks (pre-flight balance/limit checks in each agent)
- [x] Implement `StoreService` (in-memory tx + chat logging)
- [x] In-memory cache for market data (60s prices, 300s APY)
- [x] Refactor to non-custodial architecture (calldata-only, no private keys)
- [x] Add TxAction/TxStep types for frontend signing
- [x] Add POST /transactions endpoint (frontend reports confirmed txs)

### Frontend — App (Days 6-8)
- [x] Set up Next.js with wagmi + RainbowKit (wallet connect)
- [x] Apply Zikora brand kit (colors, fonts, design tokens from `zikora-brand/`)
- [x] Build Chat interface (message bubbles, input, streaming responses)
- [x] Build Portfolio Dashboard (positions, PnL, total value)
- [x] Build Decision History (past operations, reasoning logs, tx hashes)
- [x] Build non-custodial signing flow (TxAction → MetaMask via wagmi)
- [x] Handle tx confirmations and status updates in UI
- [ ] Connect frontend to backend API (`NEXT_PUBLIC_API_URL`) 👤

### Integration & Testing (Days 9-10)
- [ ] End-to-end: user chat -> agent reasoning -> onchain tx -> UI update 👤
- [ ] Test swap flow (USDT -> BNB via PancakeSwap V3) 👤
- [ ] Test supply flow (USDT -> Venus vUSDT) 👤
- [ ] Test redeem flow (Venus vUSDT -> USDT) 👤
- [ ] Test portfolio analytics (multi-token balance, yield tracking) 👤
- [ ] Test error handling (insufficient balance, high slippage, contract paused) 👤
- [ ] Test safety limits (slippage check, balance check) 👤

### Polish & Deploy (Days 11-12)
- [ ] UI polish (animations, loading states, error states) 👤
- [ ] Mobile responsive pass 👤
- [ ] Deploy landing page to Vercel 👤
- [ ] Deploy app frontend to Vercel 👤
- [ ] Deploy backend to Railway/Render 👤
- [ ] Deploy to BSC Mainnet (if confident) 👤
- [ ] Update landing page CTA links to deployed app URL 👤
- [ ] Final end-to-end test on production 👤

### Submission (Days 13-14)
- [ ] Record demo video (2-3 min walkthrough) 👤
- [ ] Write README.md with setup instructions 👤
- [ ] Finalize AI Build Log (`use-of-ai.md`) 👤
- [ ] Submit to DoraHacks 👤
- [ ] Post on X with #VibingOnBNB 👤

---

## What's Done vs What You Need To Do

### ✅ CODE COMPLETE (built by AI)
| Component | Status | Files |
|-----------|--------|-------|
| `zikora-landing-page/` | UI complete + docs page | ~25 files |
| `zikora-app/` | UI complete (mock data) + signing flow | ~55 files |
| `zikora-contracts/` | Vault + tests + deploy script (not used in non-custodial arch) | ~10 files |
| `zikora-server/` | Full backend + agents (non-custodial, calldata-only) | ~37 files |

### 👤 YOU NEED TO DO (requires keys, accounts, manual steps)

#### Priority 1 — Connect backend
1. Fill `zikora-server/.env`:
   - `BSC_RPC_URL=https://bsc-dataseed1.binance.org` (or testnet RPC)
   - `ANTHROPIC_API_KEY=sk-ant-...`
2. `cd zikora-server && pnpm start:dev` → runs on port 3001

#### Priority 2 — Connect frontend
1. Set `NEXT_PUBLIC_API_URL=http://localhost:3001` in `zikora-app/.env.local`
2. `cd zikora-app && pnpm dev` → now calls real backend instead of mock data
3. Test chat, portfolio, history endpoints

#### Priority 3 — Deploy & submit
- Landing page → Vercel (update CTA links after)
- App → Vercel (set `NEXT_PUBLIC_API_URL` env var)
- Backend → Railway or Render (set all env vars)
- Record demo video
- Submit to DoraHacks

---

## Key Metrics to Track

| Metric | Target | Current |
|--------|--------|---------|
| Non-custodial architecture | Yes | Yes ✅ |
| Agents functional (testnet) | 4/4 | 4/4 code ready, 0/4 tested |
| End-to-end swap working | Yes | No |
| End-to-end lending working | Yes | No |
| Portfolio tracking working | Yes | No |
| Frontend deployed | Yes | No |
| Backend deployed | Yes | No |
| Demo video recorded | Yes | No |
| Submitted to DoraHacks | Yes | No |

---

## Protocol Integration Status

| Protocol | Status | Notes |
|----------|--------|-------|
| PancakeSwap V3 (swaps) | Backend ready | Backend prepares calldata, user signs in MetaMask. Smart Router: `0x13f4EA83D0bd40E75C8222255bc855a974568Dd4` |
| Venus Protocol (lending) | Backend ready | Backend prepares calldata, user signs in MetaMask. vUSDT: `0xfD5840Cd36d94D7229439859C0112a4185BC0255` |

---

## Daily Log

### Feb 8, 2026
- Created brand kit (logo variants, colors, fonts, design system)
- Built landing page with V0 (Next.js + Tailwind + shadcn/ui)
- Organized monorepo: `zikora-landing-page/`, `zikora-brand/`
- Created CLAUDE.md and BENCHMARKS.md
- Built `zikora-app/` — full app frontend (55 files):
  - Wallet connect with RainbowKit (BSC Mainnet + Testnet)
  - Chat interface with message bubbles, streaming responses, suggested prompts
  - Portfolio Dashboard with positions, PnL chart, total value
  - Decision History with operation logs, reasoning, tx hash links
  - Full Zikora brand applied (dark theme, Syne/DM Sans fonts, orange accents)
  - Mock data layer (backend not connected yet)
- Created `zikora-contracts/` — Hardhat project with ZikoraVault.sol:
  - Owner/operator role pattern
  - PancakeSwap V3 swap execution
  - Venus Protocol supply/redeem
  - Safety limits (25% max trade, 1% max slippage)
  - Pause/unpause emergency controls
  - Full test suite + deploy script
- Built `zikora-server/` — full NestJS backend (37 files):
  - BlockchainService: ethers.js v6 provider + contract factories
  - MarketDataService: onchain price quotes (PancakeSwap V3 QuoterV2), Venus APY, token balances, TTL cache
  - LLMService: Claude API (Sonnet 4.5) for intent classification + reasoning generation
  - RouterAgent: classifies intent via LLM, delegates to specialized agents
  - TradingAgent: PancakeSwap V3 swaps with pre-flight checks
  - YieldAgent: Venus Protocol supply/redeem with APY analysis
  - AnalyticsAgent: portfolio summary, LLM-powered insights
  - StoreService: in-memory transaction + chat history storage
  - REST endpoints: POST /chat, GET /portfolio, GET /transactions, POST /transactions
  - CORS configured, ValidationPipe, port 3001
- Refactored to non-custodial architecture (backend read-only, no private keys)
- Frontend signing flow: TxAction → ChatTxAction component → wagmi sendTransaction
- Built documentation page (/docs) with 9 sections, sidebar TOC, mobile Sheet
- **All code is written.** Next steps are all manual: fill .env files, connect frontend, deploy to cloud, record demo.
