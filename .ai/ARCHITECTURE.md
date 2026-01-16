# System Architecture

> This document explains how all the pieces of this codebase fit together.

## Overview

This is a **Web3 application** that runs inside Farcaster. Users can:
1. Connect their wallet
2. Sign the on-chain Guestbook on Base
3. Share their signature to Farcaster

## The Three Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     FARCASTER LAYER                         │
│  Farcaster reads farcaster.json and fc:frame meta tag       │
│  to display the app in its interface                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                          │
│  React app with React Router for navigation                 │
│  Uses wagmi/viem to talk to the blockchain                  │
│  Uses Farcaster SDK for social features                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     SMART CONTRACT LAYER                    │
│  Guestbook.sol deployed on Base                             │
│  Stores signatures permanently on-chain                     │
└─────────────────────────────────────────────────────────────┘
```

## File Responsibilities

### Frontend Layer (`frontend/src/`)

| File | Purpose |
|------|---------|
| `App.tsx` | Router container, defines routes |
| `main.tsx` | Entry point, providers setup |
| `components/Layout.tsx` | Shared navbar + footer |
| `pages/Home.tsx` | Landing page with CTAs |
| `pages/Guestbook.tsx` | Main UI, wallet connection, signing |
| `pages/HowItWorks.tsx` | Tutorial/guide page |
| `abi/Guestbook.json` | Contract ABI for interactions |
| `wagmi.ts` | Wallet config (chains, connectors) |
| `viemChains.ts` | Chain definitions (Base, localhost) |
| `hooks/usePublicClient.ts` | viem client for read-only calls |

### Farcaster Layer (`frontend/public/`)

| File | Purpose |
|------|---------|
| `.well-known/farcaster.json` | Farcaster manifest (name, URLs, capabilities) |
| `psylabs-logo.png` | Psy_Labs branding |

### Smart Contract Layer (`packages/contracts/`)

| File | Purpose |
|------|---------|
| `contracts/Guestbook.sol` | Main contract logic |
| `scripts/deploy.ts` | Deployment script |
| `hardhat.config.ts` | Network configuration |
| `artifacts/` | Compiled ABIs (after `npx hardhat compile`) |

## Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router 7** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **wagmi** - React hooks for Ethereum
- **viem** - Low-level Ethereum client
- **@farcaster/miniapp-sdk** - Farcaster integration

### Smart Contracts
- **Solidity 0.8.24** - Contract language
- **Hardhat** - Development environment
- **ethers.js** - Contract interactions

### Tooling
- **pnpm** - Package manager
- **TypeScript** - Type safety

## Routing Structure

```
/                    → Home.tsx (landing)
/guestbook           → Guestbook.tsx (main functionality)
/howitworks          → HowItWorks.tsx (tutorial)
```

All routes share `Layout.tsx` (navbar + footer).

## Chain Configuration

| Chain | Chain ID | Usage |
|-------|----------|-------|
| Localhost | 31337 | Local development (Anvil/Hardhat) |
| Base Sepolia | 84532 | Testnet |
| Base | 8453 | Production mainnet |

Chain selection is automatic based on `NODE_ENV`:
- Development: Includes localhost
- Production: Uses Base and Base Sepolia

## Farcaster Integration Points

### 1. Manifest (`farcaster.json`)
```json
{
  "frame": {
    "version": "1",
    "name": "App Name",
    "homeUrl": "https://your-app.com",
    "requiredChains": ["eip155:8453"],
    "requiredCapabilities": ["actions.composeCast", "wallet.getEthereumProvider"]
  }
}
```

### 2. Frame Meta Tag (`index.html`)
```html
<meta name="fc:frame" content='{"version":"next","imageUrl":"...","button":{...}}' />
```

### 3. SDK Usage (`Guestbook.tsx`)
```typescript
import { sdk } from "@farcaster/miniapp-sdk";
sdk.actions.ready();           // Signal app is loaded
sdk.actions.composeCast({...}); // Share to Farcaster
```

## Smart Contract Interface

### Guestbook.sol

```solidity
// Write
function signBook(string memory _message) public

// Read
function getTotalSignatures() public view returns (uint256)
function getLastSignatures(uint256 _limit) public view returns (Entry[] memory)

// Event
event NewSignature(address indexed signer, string message, uint256 timestamp)
```

## Build Pipeline

```
CONTRACTS                          FRONTEND

Guestbook.sol                      Pages + Components
     │                                    │
     ▼                                    ▼
npx hardhat compile              pnpm build (vite)
     │                                    │
     ▼                                    ▼
artifacts/Guestbook.json ──────► abi/Guestbook.json
                                          │
                                          ▼
                                      dist/ → Deploy
```

## Data Flow

```
User clicks "Sign Guestbook"
         │
         ▼
Guestbook.tsx calls writeContract()
         │
         ▼
wagmi sends tx to wallet
         │
         ▼
Wallet signs and broadcasts to Base
         │
         ▼
Guestbook.sol stores Entry
         │
         ▼
Event NewSignature emitted
         │
         ▼
Frontend fetches updated entries
```
