import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";

/**
 * Checks if the address is a valid Solana address (Base58, 32 bytes, valid PublicKey)
 */
export function isValidSolAddress(address: string): boolean {
  try {
    if (typeof address !== "string" || address.length === 0) return false;
    const decoded = bs58.decode(address);
    if (decoded.length !== 32) return false;
    // Try to construct a PublicKey for extra validation
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Throws if the address is not a valid Solana address
 */
export function assertSolAddress(address: string): void {
  if (!isValidSolAddress(address)) {
    throw new Error("Invalid Solana address");
  }
}

/**
 * Returns the address type (always "solana")
 */
export function getAddressType(address: string): "solana" {
  return "solana";
}

/**
 * Validates a Solana address and returns a structured result
 */
export function validateSolAddress(address: string) {
  let valid = false;
  let reason: string | undefined = undefined;
  let length = 0;
  try {
    const decoded = bs58.decode(address);
    length = decoded.length;
    if (length !== 32) {
      reason = "Decoded address length is not 32 bytes";
    } else {
      // Try to construct a PublicKey for extra validation
      new PublicKey(address);
      valid = true;
    }
  } catch (err: any) {
    reason = err?.message || "Invalid base58 encoding or not a valid public key";
  }
  return {
    valid,
    encoding: "base58",
    length,
    type: "publicKey",
    reason: valid ? undefined : reason,
  };
}
