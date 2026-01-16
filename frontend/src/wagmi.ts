// Wagmi configuration for the Farcaster + Base Mini-App.
// Sets up supported chains, connectors, and transports for EVM wallet interaction.

import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { http, createConfig } from "wagmi";
import { injected } from "@wagmi/connectors";
import { localhost, base, baseSepolia } from "./viemChains";

// Define supported chains based on environment
type Chain = typeof localhost | typeof base | typeof baseSepolia;

const isDev = process.env.NODE_ENV === "development" || process.env.VITE_USE_LOCALHOST === "true";

// Wagmi requires a non-empty tuple for chains
const chains = (isDev ? [localhost, base, baseSepolia] : [base, baseSepolia]) as [Chain, ...Chain[]];

// Map each chain to its HTTP transport for RPC
const transports = chains.reduce((acc, chain) => {
  acc[chain.id] = http(chain.rpcUrls.default.http[0]);
  return acc;
}, {} as Record<number, ReturnType<typeof http>>);

// Main Wagmi config used throughout the app
export const config = createConfig({
  chains,
  connectors: isDev ? [injected(), farcasterMiniApp()] : [farcasterMiniApp()],
  transports,
});

// Type augmentation for Wagmi config
declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}