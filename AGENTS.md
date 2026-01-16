# Farcaster + Base Mini-App

> This file helps AI agents work with this codebase.

## What This Is

A template for building Farcaster mini-apps on Base. It has two parts:
- **Frontend** (React) - A web app that connects wallets and interacts with smart contracts
- **Smart Contracts** (Hardhat/Solidity) - Guestbook contract deployed on Base
- **Farcaster Integration** - Configuration that makes this work inside Farcaster

## Critical Rules

### Rule 1: Contract address must match deployment
The constant `CONTRACT_ADDRESS` in `frontend/src/pages/Guestbook.tsx` must match your deployed contract.

### Rule 2: Farcaster URLs must be consistent
These two files must have matching URLs:
- `frontend/public/.well-known/farcaster.json` (homeUrl, iconUrl, splashImageUrl)
- `frontend/index.html` (fc:frame meta tag)

### Rule 3: Propose changes before writing code
Before making any code changes, explain what you plan to modify and why.

### Rule 4: NEVER commit .env files to GitHub
> ⚠️ **SECURITY WARNING**: The `.env` file contains your private key. 
> - NEVER commit `.env` to git
> - NEVER share your private key
> - Use `.env.example` as a template only
> - The `.gitignore` already excludes `.env` - DO NOT modify this

## File Map

| What You Want to Change | File to Edit |
|------------------------|--------------|
| Contract ABI | `frontend/src/abi/Guestbook.json` |
| Contract address | `frontend/src/pages/Guestbook.tsx` (CONTRACT_ADDRESS) |
| Contract logic | `packages/contracts/contracts/Guestbook.sol` |
| Deploy script | `packages/contracts/scripts/deploy.ts` |
| Frontend pages | `frontend/src/pages/` (Home, Guestbook, HowItWorks) |
| Layout/Navigation | `frontend/src/components/Layout.tsx` |
| Router config | `frontend/src/App.tsx` |
| Wallet/chain config | `frontend/src/wagmi.ts` and `frontend/src/viemChains.ts` |
| Farcaster manifest | `frontend/public/.well-known/farcaster.json` |
| Farcaster frame embed | `frontend/index.html` (fc:frame meta tag) |

## Common Tasks

### "I want to run the frontend locally"

```bash
cd frontend
pnpm install
pnpm dev
```

### "I want to run a local blockchain"

```bash
cd packages/contracts
npx hardhat node
```

### "I want to deploy the contract locally"

```bash
cd packages/contracts
npx hardhat run scripts/deploy.ts --network localhost
```
Copy the deployed address to `frontend/src/pages/Guestbook.tsx`.

### "I want to deploy to Base Sepolia (testnet)"

1. Create `.env` file in `packages/contracts/`:
```env
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
BASESCAN_API_KEY=your_etherscan_api_key_here
```

> **Note**: Get testnet ETH from https://www.alchemy.com/faucets/base-sepolia
> Get API key from https://etherscan.io/myapikey (works for all chains via V2 API)

2. Deploy:
```bash
cd packages/contracts
npx hardhat run scripts/deploy.ts --network baseSepolia
```

3. Verify on BaseScan (optional but recommended):
```bash
cd packages/contracts
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS
```

4. Update contract address in `frontend/src/pages/Guestbook.tsx`

### "I want to deploy to Base Mainnet"

> ⚠️ **WARNING**: This uses real funds!

1. Ensure `.env` has your `PRIVATE_KEY` and `BASESCAN_API_KEY`

2. Deploy:
```bash
cd packages/contracts
npx hardhat run scripts/deploy.ts --network base
```

3. Verify on BaseScan:
```bash
cd packages/contracts
npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
```

4. Update contract address in `frontend/src/pages/Guestbook.tsx`

### "I want to run contract tests"

```bash
cd packages/contracts
npx hardhat test
```

### "I want to compile contracts"

```bash
cd packages/contracts
npx hardhat compile
```
ABI will be generated in `packages/contracts/artifacts/contracts/Guestbook.sol/Guestbook.json`

## Project Structure

```
/
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 ← Router container
│   │   ├── components/
│   │   │   └── Layout.tsx          ← Navbar + Footer
│   │   ├── pages/
│   │   │   ├── Home.tsx            ← Landing page
│   │   │   ├── Guestbook.tsx       ← Signing UI + CONTRACT_ADDRESS
│   │   │   └── HowItWorks.tsx      ← Tutorial page
│   │   ├── abi/Guestbook.json      ← Contract ABI
│   │   ├── wagmi.ts                ← Wallet configuration
│   │   └── viemChains.ts           ← Chain definitions
│   ├── public/
│   │   ├── .well-known/farcaster.json  ← Farcaster manifest
│   │   └── psylabs-logo.png        ← Psy_Labs branding
│   └── index.html                  ← HTML template + fc:frame meta
├── packages/
│   └── contracts/
│       ├── contracts/
│       │   └── Guestbook.sol       ← Smart contract
│       ├── scripts/
│       │   └── deploy.ts           ← Deployment script
│       └── hardhat.config.ts       ← Hardhat configuration
└── AGENTS.md                       ← This file
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page with CTAs |
| `/guestbook` | Guestbook | Sign the guestbook |
| `/howitworks` | HowItWorks | Step-by-step guide |

## Chain Configuration

| Chain | Chain ID | Usage | RPC |
|-------|----------|-------|-----|
| Localhost | 31337 | Local development | http://localhost:8545 |
| Base Sepolia | 84532 | Testnet | https://sepolia.base.org |
| Base | 8453 | Production mainnet | https://mainnet.base.org |

## Environment Variables

Create `packages/contracts/.env`:
```env
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
BASESCAN_API_KEY=your_etherscan_api_key_here
```

> Get your API key from https://etherscan.io/myapikey (V2 API works for all chains)

## Quick Validation

After making changes, verify:
1. **Contracts compile:** `cd packages/contracts && npx hardhat compile`
2. **Frontend builds:** `cd frontend && pnpm build`
3. **URLs are set:** No "YOUR_APP_URL" placeholders remain
4. **Contract address matches:** Check `Guestbook.tsx` has correct address
