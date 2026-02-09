# ZIKORA — Pitch Deck para Good Vibes Only Hackathon

## Prompt para Gamma App

Create a professional pitch deck for "Zikora" — a DeFAI (DeFi + AI) platform for BNB Chain. Use a DARK theme with these exact brand colors: background #12121A, surface cards #1A1A26, primary accent orange #FF6B2C, text #F0EDE6, secondary text #A8A4B8. The style should be sleek, modern, crypto/Web3 aesthetic with geometric elements. Use minimal text per slide, bold headings, and impactful visuals. This is for a $100K hackathon competition.

---

## SLIDE 1 — COVER
**ZIKORA**
*DeFAI Multi-Agent Platform for BNB Chain*

"Your AI-powered DeFi assistant — chat to swap, lend, and track your portfolio on BNB Chain"

Hackathon: Good Vibes Only: OpenClaw Edition
Prize Pool: $100,000

Tagline: "Zikora means 'show the way' in Igbo (Nigeria)"
Mascot: Geometric ant — representing collective intelligence and tireless execution

---

## SLIDE 2 — THE PROBLEM
**BNB Chain has $14B in stablecoins and 2.5M daily users. But DeFi is still broken.**

4 key pain points:
1. **Fragmented UX** — Users juggle PancakeSwap, Venus, DexScreener separately
2. **Technical complexity** — Approving tokens, configuring slippage, understanding APY vs APR
3. **Zero intelligence** — No protocol proactively suggests better yield opportunities
4. **No DeFAI on BNB** — Solana has The Hive ($122M mcap), Griffain, Neur. BNB Chain has nothing functional

The only attempt (Bink AI) is dead — $83K mcap, $769/day volume. It was a dev SDK, not an end-user product.

---

## SLIDE 3 — THE SOLUTION
**Zikora: Chat with AI agents to execute DeFi operations on BNB Chain**

Simple 4-step flow:
1. Connect wallet (MetaMask / TrustWallet)
2. Chat in natural language ("Swap 100 USDT to BNB")
3. AI agent analyzes, prepares transaction, explains reasoning
4. User signs in MetaMask → confirmed onchain

Key differentiators:
- End-user PRODUCT, not a dev SDK
- Non-custodial — backend never holds private keys
- Transparent AI reasoning on every decision
- Every operation = verifiable tx hash on BSC

---

## SLIDE 4 — MULTI-AGENT ARCHITECTURE
**Specialized AI agents that collaborate — not a generic chatbot**

| Agent | What it does | Protocol |
|-------|-------------|----------|
| RouterAgent | Classifies user intent via LLM, delegates to specialist | Orchestrator |
| TradingAgent | Token swaps, route optimization, slippage protection | PancakeSwap V3 |
| YieldAgent | Supply/redeem, APY analysis, yield recommendations | Venus Protocol |
| AnalyticsAgent | Portfolio tracking, PnL, market insights | Onchain reads |

Flow diagram:
User Input → RouterAgent (LLM intent classification) → Specialized Agent (prepares calldata + reasoning) → Frontend (Sign Transaction card) → User signs in MetaMask → Transaction confirmed on BSC

---

## SLIDE 5 — LIVE DEMO EXAMPLES
**Real conversations, real transactions**

Example 1 — Token Swap:
User: "Swap 200 USDT to BNB"
Agent: Analyzes route → USDT→WBNB 0.05% fee pool → $45M TVL → 0.12% slippage → prepares tx → user signs

Example 2 — Yield:
User: "Where can I earn yield on USDT?"
Agent: Venus USDT 8.2% APY (utilization 67%) → recommends supply → prepares tx

Example 3 — Portfolio:
User: "Show my portfolio"
Agent: Total $1,847 → 1.2 BNB + 500 USDT on Venus + 563 USDT liquid → suggests deploying idle capital

---

## SLIDE 6 — TECHNICAL ARCHITECTURE
**Full-stack DeFAI platform**

Frontend: Next.js 14 + TypeScript + wagmi + RainbowKit
Backend: NestJS + TypeScript + AI Agents
AI/LLM: Anthropic Claude API (Sonnet 4.5) + Google Gemini 2.5 Pro
Blockchain: BNB Smart Chain (BSC)
Protocols: PancakeSwap V3 (swaps) + Venus Protocol (lending)

Key technical highlights:
- Zero external API dependencies — all market data read directly from smart contracts
- Non-custodial architecture — backend prepares calldata only, no private keys
- In-memory caching (60s prices, 5min APY) for performance
- Safety validator: 1% max slippage, balance checks, allowance verification
- Rate limiting: 20 requests/10 minutes

---

## SLIDE 7 — ONCHAIN DATA (Zero External APIs)
**All data sourced directly from smart contracts**

| Data | Source | Method |
|------|--------|--------|
| Token prices | PancakeSwap V3 Quoter | quoteExactInputSingle() |
| Pool liquidity | PancakeSwap V3 Pool | liquidity(), slot0() |
| Supply APY | Venus vToken | supplyRatePerBlock() × blocks/year |
| Borrow APY | Venus vToken | borrowRatePerBlock() × blocks/year |
| User positions | Venus vToken | balanceOfUnderlying(address) |
| Token balances | ERC-20 contracts | balanceOf(address) |

No CoinGecko. No DexScreener. No third-party dependencies. Fully onchain.

---

## SLIDE 8 — COMPETITIVE LANDSCAPE
**Zikora fills a clear gap in the BNB ecosystem**

| Feature | Zikora | Bink AI | TermiX | ChainGPT |
|---------|--------|---------|--------|----------|
| Type | End-user product | Dev SDK (dead) | No-code framework | Analytics chatbot |
| DeFi Execution | Swap + Lending | Swap + Bridge | Via DeFAI Kits | No execution |
| Multi-Agent | Specialized agents | Single agent | Workflows | Single chatbot |
| Reasoning | Transparent | Black box | Not shown | N/A |
| Custodial | Non-custodial | Custodial | Varies | N/A |
| Status | Building | Dead ($83K mcap) | Infra only | Active (analytics) |

---

## SLIDE 9 — VALUE TO BNB ECOSYSTEM
**Why BNB Chain needs Zikora**

1. **Onboarding new users** — Transforms complex DeFi into plain English conversations. Brings in users who would never use DeFi directly.

2. **Increased TVL for protocols** — Every Zikora operation is a real transaction on PancakeSwap or Venus. More volume, more fees, more TVL.

3. **AI + BNB Chain showcase** — BNB Chain is investing heavily in AI (ERC-8004, BAP-578, AI Agent Solution). Zikora is a functional demonstration.

4. **Open source infrastructure** — Fully open-source. Other devs can fork, add new agents, integrate new protocols.

---

## SLIDE 10 — BUSINESS MODEL
**Revenue streams post-hackathon**

| Stream | Description | Model |
|--------|-------------|-------|
| Performance Fee | 1-2% on yield generated | Scales with TVL |
| Swap Fee | 0.05% on executed volume | Volume-driven |
| Premium Agents | Advanced agents (arbitrage, cross-protocol) | $10-50/month subscription |
| Agent Marketplace | Devs create & monetize agents, 10% platform fee | Platform fee |
| API/SDK | Other dApps integrate our agents | B2B licensing |

Year 1 Conservative Projection:
1,000 active users, $5M aggregate TVL → ~$86K/year revenue

---

## SLIDE 11 — ROADMAP
**From hackathon MVP to full platform**

Phase 1 — Hackathon MVP (Feb 2026) ← WE ARE HERE
- Chat interface + wallet connect
- PancakeSwap V3 swaps + Venus lending
- Portfolio analytics + decision history
- Onchain proof for every operation

Phase 2 — Growth (Mar-Apr 2026)
- More protocols: Thena, Alpaca Finance, ListaDAO
- Autonomous rebalancing agent
- Opportunity notifications
- Multi-language (EN, PT-BR, CN)

Phase 3 — Platform (May-Jul 2026)
- Agent Marketplace
- Cross-chain (BSC ↔ opBNB ↔ Ethereum)
- Telegram bot integration
- Token + DAO governance

Phase 4 — Scale (2026 H2)
- Institutional agents
- Fine-tuned AI model for BNB DeFi
- Official partnerships
- Series A funding

---

## SLIDE 12 — TEAM
**Pedro** — CTO & Builder
- Co-founder of Vault Capital (R$50M+ AUM, 250+ clients)
- 3x Hackathon Winner:
  - Stellar Meridian
  - TON Payments
  - Stacks Vibe Coding
- Full-stack developer (React, NestJS, Solidity)
- Software Engineering @ Inteli, São Paulo, Brazil

Solo builder with proven track record of shipping and winning.

---

## SLIDE 13 — WHY WE WILL WIN
**5 reasons Zikora stands out**

1. **Real gap** — BNB Chain has ZERO functional end-user DeFAI products. Solana has 5+. We fill an obvious need.

2. **Product, not framework** — Unlike Bink AI, TermiX, AgentKit (all SDKs), we built a product anyone can use. Open site, connect wallet, chat.

3. **Strong onchain proof** — Every operation is a verifiable BSC transaction. Judges can verify everything.

4. **AI-first build** — Built with Claude Code + AI assistants. Full AI build log documenting every decision.

5. **Community-driven** — Building in public with #VibingOnBNB. 40% of hackathon score = community voting.

---

## SLIDE 14 — CALL TO ACTION
**Try Zikora today**

- GitHub: [open source]
- Live Demo: [deployed app link]
- X/Twitter: @zikora_defi #VibingOnBNB

"Zikora means 'show the way' — and we're showing BNB Chain the way to DeFAI."

Vote for us on DoraHacks!

---

## DESIGN NOTES FOR GAMMA:
- Dark background throughout (#12121A)
- Orange (#FF6B2C) ONLY for CTAs, highlights, accent elements
- Clean geometric style matching the ant mascot
- Minimal text per slide — use icons and visual layouts
- Include BNB Chain logo where relevant
- Professional Web3/DeFi aesthetic
- Font preference: clean sans-serif similar to Syne/DM Sans
