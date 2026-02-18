# CLAUDE.md — Zikora Contracts

## What is this?

Smart contracts for the Zikora DeFAI platform on BNB Chain.

**Important:** ZikoraVault.sol exists but is **not used** in the current non-custodial architecture. The backend interacts directly with PancakeSwap V3 and Venus Protocol contracts — it prepares calldata that users sign in MetaMask. The vault was an earlier custodial design that has been superseded.

---

## Tech Stack

- **Hardhat 2.22** + **TypeScript**
- **Solidity 0.8.20**
- **OpenZeppelin 5.x** (^5.1.0, installed 5.4.0) — Ownable, Pausable, ReentrancyGuard
- **@nomicfoundation/hardhat-toolbox** — ethers, chai, coverage, gas reporter

---

## Folder Structure

```
zikora-contracts/
├── contracts/
│   ├── ZikoraVault.sol          # Main vault contract (not used in current arch)
│   ├── interfaces/
│   │   ├── IPancakeV3Router.sol # PancakeSwap V3 router interface
│   │   └── IVToken.sol          # Venus Protocol vToken interface
│   └── mocks/
│       └── MockERC20.sol        # Test mock token
├── scripts/
│   └── deploy.ts                # Deployment script
├── test/
│   └── ZikoraVault.test.ts      # Comprehensive tests (deposit, withdraw, access, safety)
├── hardhat.config.ts            # Networks, compiler, optimizer
├── tsconfig.json
├── package.json
└── .env                         # Private key, RPC URLs (gitignored)
```

---

## ZikoraVault.sol

Owner-controlled vault with operator pattern:
- **Deposit/Withdraw:** ERC-20 tokens and BNB (owner only)
- **Operator functions:** `executeSwap`, `executeVenusSupply`, `executeVenusRedeem` (whenNotPaused)
- **Safety limits:** `maxTradePercent` (default 25%), `maxSlippageBps` (default 100 = 1%)
- **Pause/Unpause:** Owner can pause operator actions; owner can still withdraw when paused
- **Events:** Deposited, Withdrawn, DepositedBNB, WithdrawnBNB, OperatorUpdated, etc.

**Deployed (BSC Testnet):** `0x3284dB5e5C28d7dE56a6a8325691F8B47003f7b0`

---

## Compiler Settings

From `hardhat.config.ts`:
- **Solidity:** 0.8.20
- **Optimizer:** enabled, 200 runs
- **EVM version:** default (Shanghai)

---

## Networks

| Network | Chain ID | Config Key |
|---------|----------|------------|
| Hardhat (local) | 31337 | `hardhat` |
| BSC Testnet | 97 | `bscTestnet` |
| BSC Mainnet | 56 | `bscMainnet` |

---

## Environment Variables

```bash
# .env (gitignored)
PRIVATE_KEY=<deployer-private-key-without-0x>
BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.bnbchain.org:8545
BSC_MAINNET_RPC=https://bsc-dataseed1.bnbchain.org
BSCSCAN_API_KEY=<for-contract-verification>
```

---

## Commands

```bash
pnpm install
npx hardhat compile                                    # Compile contracts
npx hardhat test                                       # Run tests
npx hardhat run scripts/deploy.ts --network bscTestnet # Deploy to testnet
npx hardhat run scripts/deploy.ts --network bscMainnet # Deploy to mainnet
npx hardhat verify <address> --network bscTestnet      # Verify on BSCScan
```

**pnpm script shortcuts:**
```bash
pnpm compile
pnpm test
pnpm deploy:testnet
pnpm deploy:mainnet
```

---

## Test Coverage

`test/ZikoraVault.test.ts` covers:
- ERC-20 deposit & withdraw
- BNB deposit & withdraw
- Access control (owner-only, operator-only)
- Operator management
- Pause/unpause behavior
- Safety limits (maxTradePercent, maxSlippageBps)
- Edge cases (zero amount, zero address, insufficient balance)

---

## .gitignore

```
node_modules/
artifacts/
cache/
typechain-types/
coverage/
coverage.json
.env
```

---

## Conventions

- TypeScript for all scripts and tests
- OpenZeppelin base contracts for standard patterns
- Custom errors (not require strings) for gas efficiency
- Interfaces in `contracts/interfaces/` for external protocol integration
- Mock contracts in `contracts/mocks/` for testing only
