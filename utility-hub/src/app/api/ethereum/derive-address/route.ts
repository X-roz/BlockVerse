import { keccak256 } from 'ethereum-cryptography/keccak';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { publicKey } = body;

    // Validate the public key
    if (
      typeof publicKey !== 'string' ||
      !publicKey.startsWith('0x04') ||
      publicKey.length !== 132
    ) {
      return NextResponse.json({ error: 'Invalid public key' }, { status: 400 });
    }

    // Remove the 0x04 prefix
    const publicKeyBytes = Buffer.from(publicKey.slice(4), 'hex');

    // Hash the remaining 64 bytes using Keccak256
    const hash = keccak256(publicKeyBytes);

    // Take the last 20 bytes as the Ethereum address
    const address = `0x${Buffer.from(hash.slice(-20)).toString('hex')}`;

    // Return the derived address
    return NextResponse.json({ address });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}