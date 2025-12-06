// src/utils/validators/ethValidator.ts

import { keccak_256 } from "js-sha3";

/**
 * Checks if the address is a valid hex Ethereum address (0x-prefixed, 42 chars, hex only)
 */
export function isValidHexAddress(address: string): boolean {
  if (!address || typeof address !== "string") return false;
  if (!address.startsWith("0x") || address.length !== 42) return false;
  return /^[0-9a-fA-F]{40}$/.test(address.slice(2));
}

/**
 * Checks if the address is all lowercase (excluding 0x)
 */
export function isAllLowercase(address: string): boolean {
  return address.slice(2) === address.slice(2).toLowerCase();
}

/**
 * Checks if the address is all uppercase (excluding 0x)
 */
export function isAllUppercase(address: string): boolean {
  return address.slice(2) === address.slice(2).toUpperCase();
}

/**
 * Checks if the address is a valid EIP-55 checksum address
 */
export function isChecksumAddress(address: string): boolean {
  const addr = address.replace("0x", "");
  const hash = keccak_256(addr.toLowerCase());
  for (let i = 0; i < addr.length; i++) {
    const char = addr[i];
    const hashChar = parseInt(hash[i], 16);
    if (
      (hashChar > 7 && char !== char.toUpperCase()) ||
      (hashChar <= 7 && char !== char.toLowerCase())
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Main ETH address validator
 */
export function validateETHAddress(address: string) {
  if (!isValidHexAddress(address)) {
    return {
      valid: false,
      reason: "Invalid hex format or wrong checksum",
    };
  }
  if (isAllLowercase(address) || isAllUppercase(address)) {
    return {
      valid: true,
      format: "non-checksum",
      checksumValid: false,
    };
  }
  if (isChecksumAddress(address)) {
    return {
      valid: true,
      format: "checksum",
      checksumValid: true,
    };
  }
  return {
    valid: false,
    reason: "Invalid hex format or wrong checksum",
  };
}