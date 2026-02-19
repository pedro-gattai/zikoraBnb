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

Each subfolder has its own `CLAUDE.md` with module-specific conventions.

---

## Tech Stack

| Layer | Technology | Folder |
|-------|-----------|--------|
| Smart Contracts | Solidity 0.8.20 + Hardhat | `zikora-contracts/` |
| Backend | NestJS + TypeScript | `zikora-server/` |
| App Frontend | Next.js + TypeScript + wagmi + RainbowKit | `zikora-app/` |
| Landing Page | Next.js + TypeScript + Tailwind + shadcn/ui | `zikora-landing-page/` |
| AI/LLM | Claude Haiku 4.5 (Anthropic) | `zikora-server/` |
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
| ZikoraRouter (Mainnet) | `0x33A70851FC45d12293675627c55c1aFd36644aDC` |

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

## Deploy & Address Management

1. **Source of truth:** `zikora-server/src/config/addresses.ts` is the single source of contract addresses per `chainId`. All services read from this file.
2. **Placeholder pattern:** Contracts not yet deployed use `0x0000000000000000000000000000000000000000` with a `// TODO: deploy and update` comment.
3. **Deploy checklist — update all 4 files:**
   - `zikora-server/src/config/addresses.ts` — set the real address + remove the TODO
   - `CLAUDE.md` — update the "Key Protocols & Addresses (BSC)" table
   - `zikora-contracts/CLAUDE.md` — update the "Deployed Addresses" section
   - `BENCHMARKS.md` — check the relevant checkbox + add a daily log entry
4. **Verification:** Always verify the contract on BSCScan after deploy:
   ```bash
   npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS...>
   ```
5. **Etherscan V2 config:** `hardhat.config.ts` uses `etherscan.apiKey` as a plain `string` (not a per-network object). The BSCScan API key goes in the `BSCSCAN_API_KEY` env var.

---

## Current Stage (Feb 18, 2026)

- **Landing page:** Done, deployed to Vercel.
- **App frontend (`zikora-app/`):** Done, deployed to Vercel. Connected to backend API. Markdown rendering enabled (react-markdown).
- **Smart contracts (`zikora-contracts/`):** ZikoraRouter.sol deployed & verified on BSC Mainnet at `0x3284dB5e5C28d7dE56a6a8325691F8B47003f7b0`.
- **Backend (`zikora-server/`):** Done, deployed to cloud. All agents operational.
- **Network:** BSC Mainnet (chain 56). Frontend and backend configured for mainnet.
- **Status:** All components deployed. Migrated from testnet to mainnet for PancakeSwap V3 liquidity. Running E2E tests on production environment.
