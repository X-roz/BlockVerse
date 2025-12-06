import { NextResponse } from 'next/server';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

export async function POST() {
  // Generate a new Solana keypair
  const keypair = Keypair.generate();
  // Private key as base58
  const privateKey = bs58.encode(keypair.secretKey);
  // Public key as base58
  const publicKey = keypair.publicKey;
  return NextResponse.json({ privateKey, publicKey });
}
