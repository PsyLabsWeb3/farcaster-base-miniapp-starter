# Farcaster Base Mini-App Starter

A production-ready template for building [Farcaster Mini-Apps](https://docs.farcaster.xyz/) on [Base](https://base.org/).

This starter implements an **on-chain Guestbook** where users can sign messages permanently stored on the blockchain.

## Features

- **Frontend**: React 18 + Vite + Tailwind CSS (mobile-first)
- **Smart Contracts**: Solidity + Hardhat with full test coverage
- **Wallet Integration**: wagmi + viem with Farcaster & browser wallets
- **Chain Support**: Base Mainnet and Base Sepolia
- **Farcaster SDK**: Native mini-app integration with sharing
- **CI/CD**: GitHub Actions for automated testing and builds

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Deploy Contract

```bash
cd packages/contracts
cp .env.example .env
# Add your PRIVATE_KEY to .env
npx hardhat run scripts/deploy.ts --network baseSepolia
```

> **Security**: Never commit `.env` to version control.

### 3. Configure Frontend

Update the contract address in `frontend/src/pages/Guestbook.tsx`:

```typescript
const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_ADDRESS";
```

### 4. Run Development Server

```bash
cd frontend
pnpm dev
```

## Project Structure

```
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── hooks/            # Custom React hooks
│   │   └── abi/              # Contract ABI
│   └── public/
│       └── .well-known/      # Farcaster manifest
│
├── packages/contracts/       # Smart contracts
│   ├── contracts/            # Solidity source
│   ├── scripts/              # Deploy & verify scripts
│   └── test/                 # Contract tests
│
└── .ai/                      # Documentation for AI agents
```

## Testing

### Contract Tests

```bash
cd packages/contracts
npx hardhat test
```

### Contract Verification

After deploying, verify your contract on BaseScan:

```bash
cd packages/contracts
# Update CONTRACT_ADDRESS in scripts/verify.ts
npx hardhat run scripts/verify.ts --network baseSepolia
```

## Farcaster Testing

Test your mini-app in Farcaster using ngrok:

1. Start the dev server: `cd frontend && pnpm dev`
2. Create a tunnel: `ngrok http 5173`
3. Update URLs in `farcaster.json` and `index.html`
4. Preview at: https://farcaster.xyz/~/developers/mini-apps/preview

## Production Deployment

### Deploy Contract to Mainnet

1. Uncomment `base` network in `hardhat.config.ts`
2. Run: `npx hardhat run scripts/deploy.ts --network base`
3. Update contract address in frontend

### Deploy Frontend

Build the static site:

```bash
cd frontend
pnpm build
```

Deploy the `dist/` folder to any static host:
- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

See `.ai/DEPLOYMENT.md` for detailed platform guides.

## Chain Configuration

| Network | Chain ID | Usage |
|---------|----------|-------|
| Base Sepolia | 84532 | Testnet |
| Base | 8453 | Production |

## Environment Variables

Create `packages/contracts/.env`:

```env
PRIVATE_KEY=your_private_key_without_0x
BASESCAN_API_KEY=your_basescan_api_key
```

## Documentation

- `AGENTS.md` - AI agent instructions
- `.ai/ARCHITECTURE.md` - System architecture
- `.ai/TASKS.md` - Common tasks guide
- `.ai/DEPLOYMENT.md` - Deployment guide

## Resources

- [Farcaster Mini-Apps](https://docs.farcaster.xyz/developers/mini-apps/overview)
- [Base Documentation](https://docs.base.org/)
- [wagmi Documentation](https://wagmi.sh/)
- [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)

## License

MIT

---

Built with [Psy Labs](https://psylabsweb3.xyz/)