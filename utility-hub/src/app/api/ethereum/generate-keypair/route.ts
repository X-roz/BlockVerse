import { randomBytes } from 'crypto';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Generate a random 32-byte private key
    const privateKey = randomBytes(32);

    // Ensure the private key is valid
    if (!secp256k1.utils.isValidPrivateKey(privateKey)) {
      throw new Error('Invalid private key generated');
    }

    // Derive the uncompressed public key
    const publicKey = secp256k1.getPublicKey(privateKey, false); // false for uncompressed

    // Return the keys as hex strings with 0x prefix
    return NextResponse.json({
      privateKey: `0x${privateKey.toString('hex')}`,
      publicKey: `0x${Buffer.from(publicKey).toString('hex')}`,
    });
  } catch (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message: string }).message
      : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}