// BTC Address Validator Utility
// Uses bs58check and bech32 for validation

import bs58check from 'bs58check';
import { bech32, bech32m } from 'bech32';

export type BTCValidationResult = {
  valid: boolean;
  encoding: string | null;
  type: string;
  network: string;
  reason?: string;
};

// Check if address is Base58 (P2PKH, P2SH, testnet)
export function isBase58Address(address: string): boolean {
  return /^[123mn][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);
}

// Check if address is Bech32 (SegWit v0/v1, testnet)
export function isBech32Address(address: string): boolean {
  return /^((bc|tb)1)[a-z0-9]{11,}$/i.test(address);
}

// Validate Base58 address and checksum
export function validateBase58Address(address: string): boolean {
  try {
    bs58check.decode(address);
    return true;
  } catch (e) {
    return false;
  }
}

// Validate Bech32/Bech32m address
export function validateBech32Address(address: string): boolean {
  try {
    const encoding = address.startsWith('bc1p') || address.startsWith('tb1p') ? bech32m : bech32;
    const decoded = encoding.decode(address);
    return decoded && decoded.words.length > 0;
  } catch (e) {
    return false;
  }
}

// Get BTC address type
export function getBTCAddressType(address: string): string {
  if (isBase58Address(address)) {
    if (address.startsWith('1')) return 'p2pkh';
    if (address.startsWith('3')) return 'p2sh';
    if (address.startsWith('m') || address.startsWith('n')) return 'p2pkh-testnet';
  }
  if (isBech32Address(address)) {
    if (address.startsWith('bc1q')) return 'segwit-v0';
    if (address.startsWith('bc1p')) return 'taproot-v1';
    if (address.startsWith('tb1q')) return 'segwit-v0-testnet';
    if (address.startsWith('tb1p')) return 'taproot-v1-testnet';
  }
  return 'unknown';
}

// Get BTC network
export function getBTCNetwork(address: string): string {
  if (address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1')) return 'mainnet';
  if (address.startsWith('m') || address.startsWith('n') || address.startsWith('tb1')) return 'testnet';
  return 'unknown';
}

// Main validator function
export function validateBTCAddress(address: string): BTCValidationResult {
  // Step 1: Detect encoding
  let encoding: string | null = null;
  let valid = false;
  let reason = "";
  if (isBase58Address(address)) {
    encoding = "base58";
    valid = validateBase58Address(address);
    if (!valid) reason = "Checksum failed";
  } else if (isBech32Address(address)) {
    encoding = address.startsWith('bc1p') || address.startsWith('tb1p') ? "bech32m" : "bech32";
    valid = validateBech32Address(address);
    if (!valid) reason = "Bech32 checksum failed";
  } else {
    reason = "Unknown or unsupported address format";
  }
  const type = getBTCAddressType(address);
  const network = getBTCNetwork(address);
  return {
    valid,
    encoding,
    type,
    network,
    reason: valid ? undefined : reason
  };
}
