// Format ETH validation result for readability
interface ETHValidationResult {
  valid: boolean;
  format?: "checksum" | "non-checksum" | string;
  checksumValid?: boolean;
  reason?: string;
}

interface ReadableETHValidation {
  validText: string;
  formatText: string;
  checksumText: string;
  reasonText: string | null;
}

export const readableETHValidation = (res: ETHValidationResult): ReadableETHValidation => ({
  validText: res.valid
    ? "✓ Valid Ethereum address format."
    : "✗ Invalid Ethereum address format.",
  formatText: res.format === "checksum"
    ? "✓ EIP-55 Checksum Format"
    : res.format === "non-checksum"
      ? "✓ Non-checksum Format (all lower/upper)"
      : "✗ Unknown Format",
  checksumText: res.format === "checksum"
    ? (res.checksumValid ? "✓ Valid Checksum" : "✗ Invalid Checksum")
    : "✓ Checksum: Not applicable",
  reasonText: res.valid ? null : `✗ Reason - ${res.reason || "✗ Unknown error"}`
});