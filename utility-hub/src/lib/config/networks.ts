export const NETWORKS = {
  ethereum: {
    id: "ethereum",
    chainType: "evm",
    rpc: {
      mainnet: process.env.ETH_MAINNET_RPC_URL!,
      testnet: process.env.ETH_TESTNET_RPC_URL!,
    },
    explorer: {
      mainnet: process.env.ETH_MAINNET_BASE_URL!,
      testnet: process.env.ETH_TESTNET_BASE_URL!,
    },
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solana: {
    id: "solana",
    chainType: "sol",
    rpc: {
      mainnet: process.env.SOL_MAINNET_RPC_URL,
      testnet: process.env.SOL_TESTNET_RPC_URL,
    },
    explorer: {},
    apiKey: null,
  },
  tron: {
    id: "tron",
    chainType: "tron",
    rpc: {
      mainnet: process.env.TRON_MAINNET_RPC_URL,
      testnet: process.env.TRON_TESTNET_RPC_URL,
    },
    explorer: {},
    apiKey: null,
  },
  polygon: {
    id: "polygon",
    chainType: "evm",
    rpc: {
      mainnet: process.env.POLYGON_MAINNET_RPC_URL,
      testnet: process.env.POLYGON_TESTNET_RPC_URL,
    },
    explorer: {},
    apiKey: null,
  },
  bsc: {
    id: "bsc",
    chainType: "evm",
    rpc: {
      mainnet: process.env.BSC_MAINNET_RPC_URL,
      testnet: process.env.BSC_TESTNET_RPC_URL,
    },
    explorer: {},
    apiKey: null,
  },
};
