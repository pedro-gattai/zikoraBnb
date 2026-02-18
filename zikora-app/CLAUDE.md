# CLAUDE.md — Zikora App (Product Frontend)

## What is this?

DeFi chat interface where users connect a wallet and interact with AI agents via natural language. Non-custodial: backend prepares calldata, users sign in MetaMask.

---

## Tech Stack

- **Next.js 14** + **React 18** + **TypeScript 5.7**
- **wagmi 2** + **viem 2** (wallet connection, transaction signing)
- **Tailwind CSS 3.4** with Zikora design tokens
- **shadcn/ui** (Radix UI components in `components/ui/`)
- **Recharts** for portfolio charts
- **Tanstack React Query** for data fetching
- **Static export** (`output: 'export'`)

**No RainbowKit.** Uses wagmi's `injected()` connector directly (MetaMask/injected wallets only).

---

## Folder Structure

```
zikora-app/
├── app/
│   ├── layout.tsx               # Root layout (fonts, Web3Provider)
│   ├── page.tsx                 # / — Chat interface
│   ├── dashboard/page.tsx       # /dashboard — Portfolio overview
│   ├── history/page.tsx         # /history — Transaction history
│   └── globals.css              # CSS variables, animations
├── components/
│   ├── chat/                    # Chat UI (7 files)
│   │   ├── chat-container.tsx   # Main chat wrapper + auto-scroll
│   │   ├── chat-message.tsx     # Message bubble (user/assistant/system)
│   │   ├── chat-input.tsx       # Text input + send
│   │   ├── chat-welcome.tsx     # Welcome screen with quick prompts
│   │   ├── chat-tx-action.tsx   # "Sign Transaction" card (CRITICAL)
│   │   ├── chat-tx-result.tsx   # Post-tx result display
│   │   └── chat-reasoning.tsx   # Agent reasoning explanation
│   ├── dashboard/               # Portfolio components (4 files)
│   │   ├── portfolio-summary.tsx
│   │   ├── portfolio-chart.tsx
│   │   ├── positions-list.tsx
│   │   └── position-card.tsx
│   ├── history/                 # Transaction history (3 files)
│   │   ├── transaction-list.tsx
│   │   ├── transaction-card.tsx
│   │   └── transaction-filters.tsx
│   ├── layout/                  # App shell (3 files)
│   │   ├── app-shell.tsx
│   │   ├── app-sidebar.tsx      # Desktop sidebar + mobile overlay
│   │   └── app-header.tsx       # Logo, NetworkBadge, WalletButton
│   ├── wallet/                  # Web3 integration (2 files)
│   │   ├── wallet-button.tsx    # Connect/disconnect + address display
│   │   └── network-badge.tsx    # "BSC Mainnet" badge
│   ├── shared/                  # Reusable (5 files)
│   │   ├── agent-badge.tsx
│   │   ├── address-display.tsx
│   │   ├── tx-hash-link.tsx     # BSCScan explorer link
│   │   ├── token-icon.tsx
│   │   └── loading-dots.tsx
│   ├── ui/                      # shadcn/ui components (13 files)
│   └── zikora-logo.tsx
├── hooks/
│   ├── use-chat.ts              # Chat logic + tx signing flow
│   ├── use-portfolio.ts         # Portfolio data fetching
│   ├── use-history.ts           # Transaction history + filtering
│   └── use-mobile.tsx
├── services/                    # API layer
│   ├── api.ts                   # Base fetch wrapper
│   ├── chat.service.ts          # POST /chat
│   ├── portfolio.service.ts     # GET /portfolio
│   ├── transactions.service.ts  # POST /transactions (reporting)
│   └── history.service.ts       # GET /transactions
├── types/
│   └── index.ts                 # All TypeScript interfaces
├── providers/
│   └── web3-provider.tsx        # WagmiProvider + QueryClientProvider
├── lib/
│   ├── wagmi.ts                 # Wagmi config (BSC Mainnet, injected connector)
│   ├── constants.ts             # Addresses, tokens, agent configs, quick prompts
│   └── utils.ts                 # cn() helper
├── tailwind.config.ts
├── components.json
├── next.config.mjs
└── .env.example
```

---

## Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Chat interface (default landing) |
| `/dashboard` | `app/dashboard/page.tsx` | Portfolio overview (summary, chart, positions) |
| `/history` | `app/history/page.tsx` | Transaction history with filters |

All pages wrap in `AppShell` (sidebar + header navigation).

---

## Wallet Configuration

**File:** `lib/wagmi.ts`

- **Chain:** BSC Mainnet (chain ID 56)
- **Connector:** `injected()` — MetaMask and browser wallets
- **RPC:** `NEXT_PUBLIC_BSC_RPC_URL` or public fallback
- **SSR:** enabled

**Key wagmi hooks used:**
- `useAccount()` — address, isConnected, chain
- `useConnect()` / `useDisconnect()`
- `useChainId()`
- `sendTransaction()` — raw tx signing
- `waitForTransactionReceipt()` — confirmation

---

## Transaction Signing Flow

```
Backend returns TxAction (via POST /chat)
    ↓
ChatTxAction component displays "Sign Transaction" card
    ↓
User clicks → sendTransaction() for each step in sequence
    ↓
States: idle → signing → confirming → success | error
    ↓
On success: reportTransaction() to POST /transactions
```

**Multi-step support:** Approve + action executed sequentially.

---

## Key Types (`types/index.ts`)

- `ChatMessage` — role, content, agent, reasoning, txAction, txStatus, txHash
- `TxAction` — type (swap/supply/redeem), summary, steps[], details
- `TxStep` — to, data, value, description
- `TxResult` — hash, status, type, summary, details
- `Portfolio` — totalValueUsd, change24h, tokens[], positions[], chartData[]
- `TokenBalance` — symbol, balance, balanceUsd, price, change24h
- `Position` — protocol, type, token, amount, valueUsd, apy, earnings
- `Transaction` — hash, type, status, agent, timestamp, summary, details

---

## API Layer

**File:** `services/api.ts`

All services call the real backend via `apiFetch`. Requires `NEXT_PUBLIC_API_URL` to be set.

---

## Environment Variables

```bash
# .env.example
NEXT_PUBLIC_BSC_RPC_URL=https://bsc-dataseed1.binance.org/
NEXT_PUBLIC_API_URL=http://localhost:3001  # Required — backend URL
NEXT_PUBLIC_EXPLORER_URL=https://bscscan.com
```

---

## Design System

See `../zikora-brand/CLAUDE.md` for full design rules. Same CSS variables as landing page.

**CSS variables** in `app/globals.css`:
- Dark theme only (`--background: 240 20% 9%`)
- Orange accent (`--primary: 18 100% 56%`)
- Sidebar-specific tokens (`--sidebar-background`, etc.)
- Chart colors (`--chart-1` through `--chart-5`)

**Custom animations:** `fadeInUp`, `slideUp` (chat messages), `dotPulse` (loading).

---

## Path Alias

```json
"@/*" → "./*"
```

---

## Commands

```bash
pnpm install
pnpm dev          # Dev server (port 3000)
pnpm build        # Static export to out/
pnpm lint
```

---

## Conventions

- TypeScript everywhere, strict mode
- Functional components with hooks
- Tailwind utility classes with custom theme tokens
- `cn()` from `lib/utils.ts` for conditional class merging
- Dark theme only
- Non-custodial: frontend never handles private keys
- All services require `NEXT_PUBLIC_API_URL` to be configured
