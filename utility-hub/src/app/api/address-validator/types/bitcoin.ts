
// Format BTC validation result for readability
interface BTCValidationResult {
  valid: boolean;
  encoding?: string | null;
  type?: string;
  network?: string;
  reason?: string;
}

interface ReadableBTCValidation {
  validText: string;
  encodingText: string;
  typeText: string;
  networkText: string;
  reasonText: string | null;
}

export const readableBTCValidation = (res: BTCValidationResult): ReadableBTCValidation => ({
  validText: res.valid 
    ? "✓ Valid Bitcoin address format." 
    : "✗ Invalid Bitcoin address format.",
  encodingText: res.encoding
    ? `✓ ${res.encoding.toUpperCase()} Encoding`
    : "✗ Encoding not detected",
  typeText: (() => {
    const typeMap: Record<
      "p2pkh" | "p2sh" | "segwit-v0" | "taproot-v1" | "p2pkh-testnet" | "segwit-v0-testnet" | "taproot-v1-testnet",
      string
    > = {
      "p2pkh": "Type: P2PKH (Legacy)",
      "p2sh": "Type: P2SH (Legacy Script)",
      "segwit-v0": "Type: P2WPKH (SegWit)",
      "taproot-v1": "Type: P2TR (Taproot)",
      "p2pkh-testnet": "Type: P2PKH (Testnet)",
      "segwit-v0-testnet": "Type: P2WPKH (SegWit Testnet)",
      "taproot-v1-testnet": "Type: P2TR (Taproot Testnet)",
    };
    const typeKey = res.type as keyof typeof typeMap;
    const value = typeMap[typeKey];
    return value ? `✓ ${value}` : "✗ Unknown address type";
  })(),
  networkText: res.network === "mainnet"
    ? "✓ Mainnet Network"
    : res.network === "testnet"
      ? "✓ Testnet Network"
      : "✗ Unknown Network",
  reasonText: res.valid ? null : `✗ Reason - ${res.reason || "✗ Unknown error"}`
});
