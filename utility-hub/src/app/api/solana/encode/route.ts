import { NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';

export async function POST(req: Request) {
  try {
    const { publicKey } = await req.json();
    if (!publicKey || typeof publicKey !== 'string') {
      return NextResponse.json({ error: 'Invalid public key' }, { status: 400 });
    }
    let address: string;
    try {
      const pubKeyObj = new PublicKey(publicKey);
      address = pubKeyObj.toBase58();
    } catch {
      return NextResponse.json({ error: 'Invalid public key' }, { status: 400 });
    }
    return NextResponse.json({ address });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
