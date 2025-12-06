import { NETWORKS } from "../config/networks";

const REQUIRED_CHAIN_FIELDS = ["id", "chainType", "rpc", "explorer"];

export type ChainKey = keyof typeof NETWORKS;

export function getChainConfig(chain: ChainKey) {
  const networkEnv = process.env.NETWORK_ENV;
  if (!networkEnv || !["mainnet", "testnet"].includes(networkEnv)) {
    throw new Error(`Invalid NETWORK_ENV: ${networkEnv}`);
  }

  const cfg = NETWORKS[chain];
  if (!cfg) {
    throw new Error(`Unknown chain: ${chain}`);
  }

  for (const field of REQUIRED_CHAIN_FIELDS) {
    if (!(field in cfg)) {
      throw new Error(`Missing field '${field}' in config for chain: ${chain}`);
    }
  }

  const rpcUrl = cfg.rpc[networkEnv as "mainnet" | "testnet"];
  if (!rpcUrl) {
    throw new Error(`Missing rpcUrl for ${chain} (${networkEnv})`);
  }

  let explorerApiUrl = (cfg.explorer as { mainnet?: string; testnet?: string })[networkEnv as "mainnet" | "testnet"];
  if (cfg.chainType === "evm" && !explorerApiUrl) {
    throw new Error(`Missing explorerApiUrl for ${chain} (${networkEnv})`);
  }

  if (cfg.id === "ethereum" && !cfg.apiKey) {
    throw new Error(`Missing apiKey for Ethereum`);
  }

  return {
    chain: cfg.id,
    network: networkEnv,
    rpcUrl,
    explorerApiUrl: explorerApiUrl || null,
    apiKey: cfg.apiKey || null,
  };
}
