// usePublicClient.ts
// viem public client setup for the Farcaster Mini-App.
// Provides a low-level RPC client for reading contract logs and data.

import { createPublicClient, http } from 'viem';
import { base, localhost, baseSepolia } from '../viemChains';

// Detect environment: use Base Sepolia for development, Base mainnet for production
const isDev = import.meta.env.MODE === 'development' || import.meta.env.VITE_USE_LOCALHOST === 'true';
const chain = baseSepolia;

// Export a viem public client instance for the selected chain
export const publicClient = createPublicClient({
  chain,
  transport: http(),
});

