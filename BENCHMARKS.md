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
- [x] Configure BSC Testnet RPC + faucet BNB ✅

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
- [x] Implement `LLMService` (Claude Haiku 4.5 — intent classification + reasoning)
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
- [x] Connect frontend to backend API (`NEXT_PUBLIC_API_URL`) ✅

### Integration & Testing (Days 9-10)
- [x] Fix tokens.ts — token addresses dynamic by chainId (mainnet vs testnet)
- [x] Fix CORS — add CORS_ORIGINS env var for production URLs
- [x] Fix docs — correct LLM references (Claude → Gemini)
- [ ] End-to-end: user chat -> agent reasoning -> onchain tx -> UI update 👤
- [ ] Test swap flow (USDT -> BNB via PancakeSwap V3) 👤
- [ ] Test supply flow (USDT -> Venus vUSDT) 👤
- [ ] Test redeem flow (Venus vUSDT -> USDT) 👤
- [ ] Test portfolio analytics (multi-token balance, yield tracking) 👤
- [ ] Test error handling (insufficient balance, high slippage, contract paused) 👤
- [ ] Test safety limits (slippage check, balance check) 👤

### Polish & Deploy (Days 11-12)
- [x] UI polish (animations, loading states, error states)
- [x] Mobile responsive pass
- [x] Deploy landing page to Vercel ✅
- [x] Deploy app frontend to Vercel ✅
- [x] Deploy backend to Railway/Render ✅
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
| `zikora-contracts/` | ZikoraRouter + tests + deploy (28 tests passing) | ~10 files |
| `zikora-server/` | Full backend + agents (non-custodial, calldata-only) | ~37 files |

### 👤 YOU NEED TO DO (requires keys, accounts, manual steps)

#### Priority 1 — Connect backend
1. Fill `zikora-server/.env`:
   - `BSC_RPC_URL=https://bsc-dataseed1.binance.org` (or testnet RPC)
   - `ANTHROPIC_API_KEY=<your Anthropic key>`
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
| Frontend deployed | Yes | Yes ✅ |
| Backend deployed | Yes | Yes ✅ |
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
  - LLMService: Google Gemini 2.5 Pro for intent classification + reasoning generation
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

### Feb 17, 2026
- Full code review of all 4 components — identified 3 bugs:
  1. `tokens.ts` used hardcoded mainnet addresses even when `CHAIN_ID=97` (testnet) — balance checks returned 0
  2. CORS config had no support for custom production domains
  3. Docs referenced "Claude Sonnet 4.5" but backend actually uses Google Gemini 2.5 Pro
- Fixed `tokens.ts`: refactored to `getTokens(chainId)` and `resolveToken(symbol, chainId)`, pulling addresses from `addresses.ts`
- Fixed `trading.agent.ts`: removed hardcoded WBNB address, now uses `blockchain.addresses.WBNB`
- Updated all 5 consumer files (trading, yield, analytics, portfolio, market-data agents)
- Added `BlockchainService` dependency to `AnalyticsAgent` for chainId access
- Fixed CORS: added `CORS_ORIGINS` env var support for comma-separated production URLs
- Updated docs (CLAUDE.md, BENCHMARKS.md, plan.md): corrected all LLM references to Google Gemini 2.5 Pro
- Updated plan.md env vars section and cost estimates (Gemini = free)
- Expanded `use-of-ai.md` with detailed AI build log for hackathon submission
- **Next steps:** configure .env, test locally, deploy, record demo, submit

### Feb 18, 2026
- UI polish complete (animations, loading states, mobile responsive)
- **ZikoraRouter contract:** non-custodial fee router (0.10% / 10 bps) for PancakeSwap V3 + Venus Protocol
  - `swapExactInput()`, `swapExactInputBNB()`, `supplyToVenus()`, `redeemFromVenus()`
  - Admin: `setFeeBps()`, `setFeeRecipient()`, `withdrawFees()`, `rescueToken()`
  - OZ 5.x (Ownable, ReentrancyGuard, SafeERC20), `forceApprove`, deadline=`block.timestamp`
  - Mock contracts + full test suite
  - Deploy script for BSC Testnet
- **Backend integration:** TradingAgent + YieldAgent now route through ZikoraRouter
  - 4 new encode methods in BlockchainService
  - Quote adjustment for 0.10% fee (amountIn * 9990 / 10000)
  - vToken exchange rate calculation for redeem
- **LLM migration:** Google Gemini 2.5 Pro → Claude Haiku 4.5 ($0.003/msg)
  - @google/generative-ai → @anthropic-ai/sdk
  - GEMINI_API_KEY → ANTHROPIC_API_KEY

### Smart Contracts — ZikoraRouter
- [x] `ZikoraRouter.sol` — multi-protocol fee router (0.10% fee)
- [x] `IWBNB.sol` interface
- [x] `IPancakeV3Router.sol` — add `deadline` field
- [x] Mock contracts (`MockPancakeRouter.sol`, `MockVToken.sol`)
- [x] `ZikoraRouter.test.ts` — comprehensive test suite
- [x] `deploy-router.ts` — deployment script
- [x] Deploy to BSC Testnet ✅ (`0x57491f59f41121f907e3820c6e57080D9BCaF5a9`)

### Backend — ZikoraRouter Integration
- [x] `ZikoraRouter.json` ABI for ethers.js encoding
- [x] `addresses.ts` — add `zikoraRouter` placeholder
- [x] `blockchain.service.ts` — 4 new encode methods
- [x] `trading.agent.ts` — route swaps via ZikoraRouter
- [x] `yield.agent.ts` — route supply/redeem via ZikoraRouter
- [x] `market-data.service.ts` — add `getVTokenExchangeRate()`

### LLM Migration
- [x] `llm.service.ts` — Gemini → Claude Haiku 4.5
- [x] `package.json` — @google/generative-ai → @anthropic-ai/sdk
- [x] **ZikoraRouter deployed to BSC Testnet** — `0x57491f59f41121f907e3820c6e57080D9BCaF5a9` (fee recipient: `0xD776060a35c0b91b2E456e92180a184f50e99324`)
- [x] Updated `addresses.ts` with deployed ZikoraRouter address (chain 97)

### Deploys & Verification
- [x] ZikoraRouter verified on BSCScan Testnet ✅
- [x] Backend deployed to cloud ✅
- [x] App frontend deployed to Vercel ✅
- [x] Landing page deployed to Vercel ✅
- [x] Frontend connected to backend API ✅
- [ ] E2E testing on deployed environment 👤 (in progress)
