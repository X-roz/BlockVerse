import { ethers } from "ethers";
// Uncomment and install these packages if you want to support other chains
// import { Connection } from "@solana/web3.js";
// import TronWeb from "tronweb";
// import { TonClient } from "ton";
import { getChainConfig, ChainKey } from "./getChainConfig";


export function getProvider(chain: ChainKey) {
  const cfg = getChainConfig(chain);

  if (cfg.chain === "ethereum" || cfg.chain === "polygon" || cfg.chain === "bsc") {
    return new ethers.JsonRpcProvider(cfg.rpcUrl);
  }
  // future:
  // if (cfg.chain === "solana") return new Connection(cfg.rpcUrl);
  // if (cfg.chain === "tron") return new TronWeb({ fullHost: cfg.rpcUrl });
  // if (cfg.chain === "ton") return new TonClient({ endpoint: cfg.rpcUrl });
  throw new Error(`Provider not implemented for chain: ${chain}`);
}

