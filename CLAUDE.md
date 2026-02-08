# CLAUDE.md — Zikora Monorepo

## What is this project?

Zikora is a DeFAI (DeFi + AI) platform for BNB Chain. Users connect a wallet and interact with specialized AI agents via natural language chat to execute DeFi operations (swaps on PancakeSwap V3, lending on Venus Protocol, portfolio analytics). The backend prepares transaction calldata that users sign directly in MetaMask (non-custodial).

**Name origin:** "Zikora" means "show the way" in Igbo (Nigeria). The mascot is a geometric ant.

**Hackathon:** Good Vibes Only: OpenClaw Edition (BNB Chain) — Feb 5-19, 2026 — $100K prize pool.

---

## Monorepo Structure

```
zikoraBnb/
├── zikora-landing-page/   # Marketing landing page (Next.js + Tailwind + shadcn/ui)
├── zikora-app/            # Product frontend (Next.js + wagmi + RainbowKit)
├── zikora-server/         # Backend + AI agents (NestJS + TypeScript)
├── zikora-contracts/      # Smart contracts (Hardhat + Solidity)
├── zikora-brand/          # Brand assets (logos, colors, design system)
├── plan.md                # Full project plan & architecture
├── BENCHMARKS.md          # Progress tracker
└── use-of-ai.md           # AI build log (hackathon requirement)
```

Each subfolder is an independent project with its own `package.json`. There is no root-level package manager workspace — run installs and scripts inside each folder.

---

## Tech Stack

| Layer | Technology | Folder |
|-------|-----------|--------|
| Smart Contracts | Solidity 0.8.20 + Hardhat | `zikora-contracts/` |
| Backend | NestJS + TypeScript | `zikora-server/` |
| App Frontend | Next.js + TypeScript + wagmi + RainbowKit | `zikora-app/` |
| Landing Page | Next.js + TypeScript + Tailwind + shadcn/ui | `zikora-landing-page/` |
| AI/LLM | Anthropic Claude API (Sonnet 4.5) | `zikora-server/` |
| Blockchain | BNB Smart Chain (BSC) Mainnet/Testnet | All |

---

## Brand & Design Rules

See `zikora-brand/CLAUDE.md` for the full design system. Key rules:

- **Dark theme only** — never use light backgrounds
- **Colors:** `#12121A` (bg), `#1A1A26` (surface), `#FF6B2C` (accent/orange), `#F0EDE6` (text)
- **Fonts:** Syne (headings), DM Sans (body), Space Mono (code/addresses)
- **Orange sparingly** — only CTAs, highlights, and logo

---

## Key Protocols & Addresses (BSC)

| Contract | Address |
|----------|---------|
| PancakeSwap V3 Smart Router | `0x13f4EA83D0bd40E75C8222255bc855a974568Dd4` |
| PancakeSwap V3 QuoterV2 | `0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997` |
| PancakeSwap V3 Factory | `0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865` |
| Venus vUSDT | `0xfD5840Cd36d94D7229439859C0112a4185BC0255` |
| Venus vBNB | `0xA07c5b74C9B40447a954e1466938b865b6BBea36` |
| Venus Comptroller | `0xfD36E2c2a6789Db23113685031d7F16329158384` |
| USDT (BSC) | `0x55d398326f99059fF775485246999027B3197955` |
| WBNB | `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c` |
| USDC (BSC) | `0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d` |

---

## Agent Architecture

```
User Input (natural language)
    |
RouterAgent (classifies intent via LLM)
    |
Specialized Agent (prepares calldata + reasoning)
    |
Frontend (shows "Sign Transaction" card)
    |
User signs in MetaMask
    |
Transaction confirmed on BSC
```

**Agents:**
- **RouterAgent** — intent classification, delegation
- **TradingAgent** — token swaps via PancakeSwap V3
- **YieldAgent** — supply/redeem via Venus Protocol
- **AnalyticsAgent** — portfolio tracking, PnL, recommendations

**Security:** Backend is read-only (no private keys). Slippage capped at 1%. Balance and allowance checks before every operation.

---

## Development Commands

```bash
# Landing page
cd zikora-landing-page && pnpm install && pnpm dev

# App (once initialized)
cd zikora-app && pnpm install && pnpm dev

# Backend (once initialized)
cd zikora-server && pnpm install && pnpm start:dev

# Contracts (once initialized)
cd zikora-contracts && pnpm install && npx hardhat compile
```

---

## Code Conventions

- TypeScript everywhere (frontend, backend, contract scripts)
- Functional components with hooks (React)
- Tailwind utility classes with custom theme tokens
- All market data read directly from smart contracts (no external API dependencies)
- Every agent operation must include transparent reasoning in the response
- Every onchain operation must return a tx hash as proof

---

## Current Stage (Feb 8, 2026)

- **Landing page:** Done, deployed. Documentation page (`/docs`) with 9 sections and sidebar TOC.
- **App frontend (`zikora-app/`):** Done — wallet connect, chat, portfolio dashboard, decision history, non-custodial signing flow (TxAction → MetaMask). Currently uses mock data.
- **Smart contracts (`zikora-contracts/`):** ZikoraVault.sol exists but is not used in current non-custodial architecture. Backend interacts directly with PancakeSwap V3 and Venus Protocol contracts.
- **Backend (`zikora-server/`):** Done — NestJS with BlockchainService, MarketDataService, LLMService (Claude Sonnet 4.5), RouterAgent, TradingAgent, YieldAgent, AnalyticsAgent, StoreService (in-memory). Non-custodial: prepares calldata only, no private keys. REST endpoints: POST /chat, GET /portfolio, GET /transactions, POST /transactions. Not yet deployed.
- **Network:** BSC Testnet only. No mainnet deployment yet.
- **Data:** Frontend uses mock/placeholder data until backend is connected.
