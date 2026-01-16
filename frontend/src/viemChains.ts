// Chain definitions for the Farcaster + Base Mini-App.
// Includes localhost for development and Base chains for production.

import { defineChain } from 'viem';

// Custom chain config for local development (Anvil/Hardhat)
export const localhost = defineChain({
  id: 31337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
      webSocket: ['ws://localhost:8545'],
    },
    public: {
      http: ['http://localhost:8545'],
      webSocket: ['ws://localhost:8545'],
    },
  },
  testnet: true,
});

// Import and re-export Base mainnet and Sepolia testnet chains
import { base, baseSepolia } from 'viem/chains';
export { base, baseSepolia };
