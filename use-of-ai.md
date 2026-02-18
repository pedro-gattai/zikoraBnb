# Zikora — AI Build Log

> Required by: Good Vibes Only: OpenClaw Edition (BNB Chain) Hackathon
> Builder: Pedro Gattai
> Period: Feb 5-19, 2026

---

## Summary

Zikora was built almost entirely with AI assistance — from ideation to production code. The primary tools used were **Claude** (web interface + Claude Code CLI in VS Code) and **V0** (Vercel's AI frontend generator). Below is a detailed log of how AI was used at each stage.

---

## Phase 1 — Ideation & Research (Feb 5-6)

**Tool:** Claude web interface (claude.ai)

- Brainstormed the DeFAI concept for BNB Chain — analyzed the competitive landscape (Bink AI, TermiX, ChainGPT) and identified the gap: no functional end-user DeFAI product on BNB Chain
- Chose the name "Zikora" (Igbo for "show the way") — Claude generated 20+ name options, evaluated them for domain availability, memorability, and cultural meaning
- Designed the multi-agent architecture: RouterAgent → TradingAgent / YieldAgent / AnalyticsAgent
- Decided on non-custodial approach (backend prepares calldata, user signs in MetaMask) after discussing security trade-offs with Claude
- Selected PancakeSwap V3 + Venus Protocol as the two launch integrations — Claude helped evaluate protocol maturity, TVL, and contract documentation quality

## Phase 2 — Brand & Design System (Feb 6-7)

**Tool:** Claude web interface

- Created full brand kit: logo concept (geometric ant), color palette (#12121A dark bg, #FF6B2C orange accent, #F0EDE6 text), typography (Syne headings, DM Sans body, Space Mono code)
- Generated design system document (`zikora-brand/CLAUDE.md`) with spacing scale, component guidelines, animation tokens
- All brand decisions were collaborative — I described the vibe ("techy, minimal, dark, BNB-aligned") and Claude proposed options that I refined

## Phase 3 — Landing Page (Feb 7)

**Tool:** V0 (Vercel AI) + Claude Code (VS Code)

- Used V0 to generate the initial landing page structure (hero, features, CTA sections) from the brand kit
- Iterated on V0 output with specific prompts: "make the CTA section have a radial glow effect", "add the ant mascot silhouette"
- Used Claude Code in VS Code to fix styling issues, organize components, and add the documentation page (`/docs`) with 9 sections and sidebar table of contents
- Claude Code handled mobile responsiveness fixes and Tailwind class optimization

## Phase 4 — Smart Contracts (Feb 7-8)

**Tool:** Claude Code (VS Code)

- Claude Code wrote `ZikoraVault.sol` — a vault contract with owner/operator pattern, PancakeSwap V3 swap execution, Venus Protocol supply/redeem, safety limits (25% max trade, 1% max slippage), and pause/unpause
- Claude Code also wrote the full test suite (`ZikoraVault.test.ts`) and deploy script
- After architectural review, we decided the vault isn't needed for MVP (non-custodial approach is simpler and more secure). The contract remains in the repo as future infrastructure but is not deployed

## Phase 5 — Backend / AI Agents (Feb 8)

**Tool:** Claude Code (VS Code)

This was the most intensive AI-assisted phase. Claude Code built the entire NestJS backend (~37 files) in a single session:

- **BlockchainService:** ethers.js v6 provider, contract factories for PancakeSwap V3 Router/Quoter/Factory and Venus vTokens/Comptroller, calldata encoding helpers
- **MarketDataService:** onchain price quotes via PancakeSwap V3 QuoterV2, Venus APY calculation from `supplyRatePerBlock()`, token balances, TTL cache (60s prices, 5min APY)
- **LLMService:** Integration with Google Gemini 2.5 Pro for intent classification and reasoning generation. Uses structured JSON output for reliable intent parsing
- **RouterAgent:** Receives user message, calls LLM to classify intent (SWAP, YIELD, ANALYTICS, GENERAL), extracts parameters (tokens, amounts, actions), delegates to the right specialized agent
- **TradingAgent:** Prepares PancakeSwap V3 swap transactions — checks wallet balance, gets price quote, calculates slippage, builds approve + swap calldata steps
- **YieldAgent:** Handles Venus Protocol supply/redeem — checks balances, fetches APY, builds approve + mint/redeemUnderlying calldata
- **AnalyticsAgent:** Builds portfolio summary from onchain data, passes to LLM for insights and recommendations
- **StoreService:** In-memory storage for chat history and transaction records
- **Config:** Dynamic chain addresses (mainnet/testnet), token metadata, ABI files

Key AI decisions:
- Claude suggested the TxAction/TxStep pattern for the signing flow — each agent returns structured transaction steps that the frontend renders as a "Sign Transaction" card
- Claude implemented pre-flight safety checks (balance verification, slippage caps) in each agent before preparing transactions
- All market data reads directly from smart contracts — zero external API dependencies (no CoinGecko, no DexScreener)

## Phase 6 — App Frontend (Feb 8)

**Tool:** Claude Code (VS Code)

Claude Code built the complete app frontend (~55 files):

- **Wallet Connect:** RainbowKit + wagmi with BSC Mainnet and Testnet chains
- **Chat Interface:** Message bubbles with markdown rendering, agent identification badges, suggested prompt buttons, streaming response simulation
- **Portfolio Dashboard:** Token balances table, Venus lending positions, portfolio value chart, 24h change indicators
- **Decision History:** Past operations with reasoning logs, tx hash links to BscScan, status badges
- **Non-custodial Signing Flow:** `ChatTxAction` component renders TxAction steps → user clicks "Sign" → wagmi `sendTransaction` → tx confirmation → status update
- **Mock Data Layer:** Complete mock responses for development without backend connection

## Phase 7 — Code Review & Bug Fixes (Feb 17)

**Tool:** Claude Code (VS Code)

Full codebase review identified 3 bugs that Claude Code then fixed:

1. **Token address mismatch (critical):** `tokens.ts` had hardcoded mainnet addresses but `CHAIN_ID=97` (testnet) in `.env.example`. On testnet, all balance checks would return 0. Fix: refactored to `getTokens(chainId)` function that pulls addresses from the chain-aware `addresses.ts`
2. **CORS missing production URLs:** Added `CORS_ORIGINS` env var support for comma-separated custom domains
3. **Documentation inconsistency:** Code uses Google Gemini 2.5 Pro but docs said "Claude Sonnet 4.5". Corrected all references across CLAUDE.md, BENCHMARKS.md, and plan.md

Also fixed a hardcoded WBNB address in `trading.agent.ts` and added `BlockchainService` dependency to `AnalyticsAgent` for proper chainId access.

---

## AI Tools Used

| Tool | Purpose | Usage |
|------|---------|-------|
| **Claude** (claude.ai) | Ideation, architecture, brand design, planning | ~10 conversations |
| **Claude Code** (CLI in VS Code) | All code generation, debugging, refactoring | Primary development tool |
| **V0** (Vercel AI) | Landing page initial generation | 1 session, then refined with Claude Code |
| **Google Gemini 2.5 Pro** | Runtime LLM in the product itself | Intent classification + reasoning for DeFi agents |

---

## Key Takeaways

1. **AI as a force multiplier:** A solo developer built a full-stack DeFAI platform (landing page, app, backend with 4 AI agents, smart contracts) in ~2 weeks. Without AI assistance, this would have taken a team of 3-4 developers several weeks.

2. **Human judgment still essential:** AI generated the code, but every architectural decision (non-custodial vs custodial, which protocols to integrate, safety limits) required human evaluation of trade-offs.

3. **AI catches its own bugs:** The code review phase showed AI can identify bugs in AI-generated code — the token address mismatch was a subtle issue that would have caused silent failures on testnet.

4. **Documentation drift is real:** Even with AI, docs and code can diverge. The LLM provider changed during development (Claude → Gemini for cost reasons) but docs weren't updated until the review phase.
