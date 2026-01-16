import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    // Local development
    hardhat: {
      chainId: 31337,
    },

    // Base Sepolia Testnet - ACTIVE
    // Get testnet ETH from: https://www.alchemy.com/faucets/base-sepolia
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 84532,
    },

    // Base Mainnet - UNCOMMENT FOR PRODUCTION
    // WARNING: This uses real funds!
    // base: {
    //   url: "https://mainnet.base.org",
    //   accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    //   chainId: 8453,
    // },
  },

  // BaseScan verification (Etherscan V2 API)
  // Get API key from: https://etherscan.io/myapikey (works for all chains)
  etherscan: {
    apiKey: process.env.BASESCAN_API_KEY || "",
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;
