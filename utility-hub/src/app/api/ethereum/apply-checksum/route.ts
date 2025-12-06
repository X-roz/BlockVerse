import { keccak256 } from 'ethereum-cryptography/keccak';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address } = body;

    // Validate the address
    if (
      typeof address !== 'string' ||
      !address.startsWith('0x') ||
      address.length !== 42 ||
      !/^0x[a-f0-9]{40}$/.test(address)
    ) {
      return NextResponse.json({ error: 'Invalid Ethereum address' }, { status: 400 });
    }

    // Remove the 0x prefix and hash the lowercase address
    const addressWithoutPrefix = address.slice(2).toLowerCase();
    const hashBytes = keccak256(new TextEncoder().encode(addressWithoutPrefix));
    const hash = Buffer.from(hashBytes).toString('hex');

    // Apply EIP-55 checksum rules
    let checksumAddress = '0x';
    for (let i = 0; i < addressWithoutPrefix.length; i++) {
      const char = addressWithoutPrefix[i];
      const hashChar = parseInt(hash[i], 16);
      checksumAddress += hashChar >= 8 ? char.toUpperCase() : char;
    }

    // Return the checksummed address
    return NextResponse.json({ checksumAddress });
  } catch (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message: string }).message
      : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}