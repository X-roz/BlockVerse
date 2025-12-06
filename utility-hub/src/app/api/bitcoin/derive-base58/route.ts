import { NextResponse } from 'next/server';
import { sha256 } from 'ethereum-cryptography/sha256';
import { ripemd160 } from 'ethereum-cryptography/ripemd160';
import bs58 from 'bs58';

function base58CheckEncode(payload: Buffer): string {
  const checksum = sha256(sha256(payload));
  const buffer = Buffer.concat([payload, Buffer.from(checksum).subarray(0, 4)]);
  return bs58.encode(buffer);
}

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
    const versionedPayload = Buffer.concat([Buffer.from([0x00]), Buffer.from(ripeHash)]);
    const address = base58CheckEncode(versionedPayload);
    return NextResponse.json({ address });
  } catch (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message: string }).message
      : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
