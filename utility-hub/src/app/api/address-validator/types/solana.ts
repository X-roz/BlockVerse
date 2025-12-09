// Format Solana validation result for readability
interface SOLValidationResult {
  valid: boolean;
  length?: number;
  reason?: string;
}

interface ReadableSOLValidation {
  validText: string;
  lengthText: string;
  reasonText: string | null;
}

export const readableSOLValidation = (res: SOLValidationResult): ReadableSOLValidation => ({
  validText: res.valid
    ? "✓ Valid Solana address format."
    : "✗ Invalid Solana address format.",
  lengthText: typeof res.length === "number"
    ? `✓ ${res.length} characters`
    : "✗ Unknown length",
  reasonText: res.valid ? null : `✗ Reason - ${res.reason || "✗ Unknown error"}`
});