import { NextResponse } from 'next/server';
import { sha256 } from 'ethereum-cryptography/sha256';
import { ripemd160 } from 'ethereum-cryptography/ripemd160';
import { bech32 } from 'bech32';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { publicKeyCompressed } = body;
    if (
      typeof publicKeyCompressed !== 'string' ||
      !/^0[23][a-fA-F0-9]{64}$/.test(publicKeyCompressed)
    ) {
      return NextResponse.json({ error: 'Invalid compressed public key' }, { status: 400 });
    }
    const pubkeyBuffer = Buffer.from(publicKeyCompressed, 'hex');
    const shaHash = sha256(pubkeyBuffer);
    const ripeHash = ripemd160(Buffer.from(shaHash));
    // Witness version 0, program is ripeHash
    const words = bech32.toWords(Buffer.from(ripeHash));
    words.unshift(0); // witness version 0
    const address = bech32.encode('bc', words);
    return NextResponse.json({ address });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
