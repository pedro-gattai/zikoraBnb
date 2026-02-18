# CLAUDE.md — Zikora Contracts

## What is this?

Smart contracts for the Zikora DeFAI platform on BNB Chain.

**ZikoraRouter.sol** is a non-custodial fee router (0.10% / 10 bps). Users sign transactions that go through ZikoraRouter, which takes a small fee and forwards to the underlying protocol (PancakeSwap V3 for swaps, Venus Protocol for lending). The backend prepares calldata targeting ZikoraRouter — users sign in MetaMask.

---

## Tech Stack

- **Hardhat 2.22** + **TypeScript**
- **Solidity 0.8.20**
- **OpenZeppelin 5.x** (^5.1.0, installed 5.4.0) — Ownable, ReentrancyGuard, SafeERC20
- **@nomicfoundation/hardhat-toolbox** — ethers, chai, coverage, gas reporter

---

## Folder Structure

```
zikora-contracts/
├── contracts/
│   ├── ZikoraRouter.sol           # Non-custodial fee router (0.10% fee)
│   ├── interfaces/
│   │   ├── IPancakeV3Router.sol   # PancakeSwap V3 router interface
│   │   ├── IVToken.sol            # Venus Protocol vToken interface
│   │   └── IWBNB.sol              # Wrapped BNB interface
│   └── mocks/
│       ├── MockERC20.sol          # Test mock token
│       ├── MockPancakeRouter.sol  # Test mock PancakeSwap router
│       └── MockVToken.sol         # Test mock Venus vToken
├── scripts/
│   └── deploy-router.ts           # Deployment script
├── test/
│   └── ZikoraRouter.test.ts       # Comprehensive tests (28 tests)
├── hardhat.config.ts              # Networks, compiler, optimizer
├── tsconfig.json
├── package.json
└── .env                           # Private key, RPC URLs (gitignored)
```

---

## ZikoraRouter.sol

Non-custodial fee router with owner-controlled fee settings:

**User functions (non-custodial — user signs each tx):**
- `swapExactInput(tokenIn, tokenOut, poolFee, amountIn, amountOutMinimum)` — ERC-20 swap via PancakeSwap V3
- `swapExactInputBNB(tokenOut, poolFee, amountOutMinimum)` — BNB swap via PancakeSwap V3 (payable)
- `supplyToVenus(token, vToken, amount)` — Supply ERC-20 to Venus Protocol
- `redeemFromVenus(vToken, vTokenAmount)` — Redeem from Venus Protocol

**Admin functions (onlyOwner):**
- `setFeeBps(uint256)` — Update fee (max 100 bps / 1%)
- `setFeeRecipient(address)` — Update fee collection address
- `withdrawFees(address token)` — Withdraw collected fees
- `rescueToken(address token, uint256 amount)` — Emergency token rescue

**Fee mechanism:** 0.10% (10 bps) deducted from input amount before forwarding to protocol. Fee stays in the contract until `withdrawFees()` is called.

**Security:** OpenZeppelin Ownable + ReentrancyGuard + SafeERC20. `forceApprove` for protocol interactions. `deadline = block.timestamp` for swaps.

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
npx hardhat compile                                              # Compile contracts
npx hardhat test                                                 # Run tests (28 tests)
npx hardhat run scripts/deploy-router.ts --network bscTestnet    # Deploy to testnet
npx hardhat run scripts/deploy-router.ts --network bscMainnet    # Deploy to mainnet
npx hardhat verify <address> --network bscTestnet                # Verify on BSCScan
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

`test/ZikoraRouter.test.ts` — 28 tests covering:
- **Deployment:** correct owner, fee recipient, fee bps, router address
- **Swaps:** `swapExactInput` (ERC-20), `swapExactInputBNB` (BNB), fee deduction, zero amount revert
- **Venus Supply:** `supplyToVenus`, fee deduction, zero amount revert
- **Venus Redeem:** `redeemFromVenus`, vToken transfer, zero amount revert
- **Admin:** `setFeeBps` (valid + max cap), `setFeeRecipient`, `withdrawFees`, `rescueToken`, access control (onlyOwner reverts)

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

## Deployed Addresses

| Network | Address | Fee Recipient |
|---------|---------|---------------|
| BSC Testnet (97) | `0x57491f59f41121f907e3820c6e57080D9BCaF5a9` | `0xD776060a35c0b91b2E456e92180a184f50e99324` |
| BSC Mainnet (56) | Not deployed | — |

---

## Conventions

- TypeScript for all scripts and tests
- OpenZeppelin base contracts for standard patterns
- Custom errors (not require strings) for gas efficiency
- Interfaces in `contracts/interfaces/` for external protocol integration
- Mock contracts in `contracts/mocks/` for testing only
