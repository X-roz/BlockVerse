import { randomBytes } from 'crypto';
import { getPublicKey } from '@noble/secp256k1';
import { createBase58check } from '@scure/base';
import { sha256 } from '@noble/hashes/sha256';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Generate a valid random 32-byte private key
    let privateKey: Uint8Array;
    do {
      privateKey = randomBytes(32);
    } while (
      privateKey[0] === 0 ||
      !privateKey ||
      privateKey.length !== 32
    );

    // Compressed public key (33 bytes)
    const publicKeyCompressed = Buffer.from(getPublicKey(privateKey, true)).toString('hex');

    // Uncompressed public key (65 bytes)
    const publicKeyUncompressed = Buffer.from(getPublicKey(privateKey, false)).toString('hex');
    // Private key in WIF format
    function toWIF(privateKey: Uint8Array, compressed = true, prefix = 0x80) {
      const keyWithPrefix = [prefix, ...privateKey];
      const keyWithCompression = compressed
        ? [...keyWithPrefix, 0x01]
        : keyWithPrefix;
      const base58checkCoder = createBase58check(sha256);
      return base58checkCoder.encode(Uint8Array.from(keyWithCompression));
    }
    const privateKeyWIF = toWIF(privateKey, true, 0x80);

    return NextResponse.json({
      privateKey: privateKeyWIF,
      publicKeyCompressed,
      publicKeyUncompressed,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
