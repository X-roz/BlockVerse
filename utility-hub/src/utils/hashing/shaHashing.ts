import { createHash } from 'crypto';

export type ShaAlgorithm = 'sha224' | 'sha256' | 'sha384' | 'sha512';
export type InputEncoding = 'utf-8' | 'hex' | 'base64';

export interface HashResult {
  hex: string;
  base64: string;
  length: {
    bits: number;
    hexChars: number;
    bytes: number;
  };
}

const ALGORITHM_LENGTHS: Record<ShaAlgorithm, { bits: number; hexChars: number; bytes: number }> = {
  sha224: { bits: 224, hexChars: 56, bytes: 28 },
  sha256: { bits: 256, hexChars: 64, bytes: 32 },
  sha384: { bits: 384, hexChars: 96, bytes: 48 },
  sha512: { bits: 512, hexChars: 128, bytes: 64 },
};

export function decodeInput(inputText: string, encoding: InputEncoding): Buffer {
  if (encoding === 'utf-8') {
    return Buffer.from(inputText, 'utf-8');
  }
  if (encoding === 'hex') {
    if (!/^[0-9a-fA-F]*$/.test(inputText) || inputText.length % 2 !== 0) {
      throw new Error('inputText is not valid for hex encoding.');
    }
    return Buffer.from(inputText, 'hex');
  }
  if (encoding === 'base64') {
    // Validate base64
    try {
      return Buffer.from(inputText, 'base64');
    } catch {
      throw new Error('inputText is not valid for base64 encoding.');
    }
  }
  throw new Error('Unsupported inputEncoding.');
}

export function shaHash(
  inputText: string,
  inputEncoding: InputEncoding,
  algorithm: ShaAlgorithm
): HashResult {
  const inputBuffer = decodeInput(inputText, inputEncoding);
  const hash = createHash(algorithm).update(inputBuffer).digest();
  const { bits, hexChars, bytes } = ALGORITHM_LENGTHS[algorithm];
  return {
    hex: hash.toString('hex'),
    base64: hash.toString('base64'),
    length: { bits, hexChars, bytes },
  };
}
