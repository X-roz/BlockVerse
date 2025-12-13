import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { ShaAlgorithm } from '@/utils/hashing/shaHashing';

const ALGORITHM_LENGTHS: Record<string, { bits: number; hexChars: number; bytes: number }> = {
  'SHA-224': { bits: 224, hexChars: 56, bytes: 28 },
  'SHA-256': { bits: 256, hexChars: 64, bytes: 32 },
  'SHA-384': { bits: 384, hexChars: 96, bytes: 48 },
  'SHA-512': { bits: 512, hexChars: 128, bytes: 64 },
};

function decodeInput(input: string, encoding: string): Buffer {
  if (encoding === 'UTF-8') return Buffer.from(input, 'utf-8');
  if (encoding === 'Hex') {
    if (!/^[0-9a-fA-F]*$/.test(input) || input.length % 2 !== 0) {
      throw new Error('Provided inputValue is not valid Hex');
    }
    return Buffer.from(input, 'hex');
  }
  if (encoding === 'Base64') {
    try {
      return Buffer.from(input, 'base64');
    } catch {
      throw new Error('Provided inputValue is not valid Base64');
    }
  }
  throw new Error('Invalid input encoding');
}

function decodeHash(hash: string, encoding: string): Buffer {
  if (encoding === 'Hex') {
    if (!/^[0-9a-fA-F]*$/.test(hash) || hash.length % 2 !== 0) {
      throw new Error('hashToVerify.value is not valid Hex');
    }
    return Buffer.from(hash.replace(/\s+/g, '').toLowerCase(), 'hex');
  }
  if (encoding === 'Base64') {
    try {
      return Buffer.from(hash.trim(), 'base64');
    } catch {
      throw new Error('hashToVerify.value is not valid Base64');
    }
  }
  throw new Error('hashToVerify.encoding must be Hex or Base64');
}

function constantTimeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { inputValue, inputEncoding, algorithm, hashToVerify } = body || {};

  if (!inputValue || typeof inputValue !== 'string') {
    return NextResponse.json({ error: 'Invalid input', message: 'inputValue is required' }, { status: 400 });
  }
  if (!['UTF-8', 'Hex', 'Base64'].includes(inputEncoding)) {
    return NextResponse.json({ error: 'Invalid input encoding', message: 'inputEncoding must be UTF-8, Hex, or Base64' }, { status: 400 });
  }
  if (!['SHA-224', 'SHA-256', 'SHA-384', 'SHA-512'].includes(algorithm)) {
    return NextResponse.json({ error: 'Invalid algorithm', message: 'algorithm must be SHA-224, SHA-256, SHA-384, or SHA-512' }, { status: 400 });
  }
  if (!hashToVerify || typeof hashToVerify.value !== 'string' || !hashToVerify.encoding) {
    return NextResponse.json({ error: 'Invalid hashToVerify', message: 'hashToVerify.value and encoding are required' }, { status: 400 });
  }
  if (!['Hex', 'Base64'].includes(hashToVerify.encoding)) {
    return NextResponse.json({ error: 'Invalid hash encoding', message: 'hashToVerify.encoding must be Hex or Base64' }, { status: 400 });
  }

  let inputBuffer: Buffer;
  try {
    inputBuffer = decodeInput(inputValue, inputEncoding);
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid input encoding', message: err.message }, { status: 400 });
  }

  let hashBuffer: Buffer;
  try {
    hashBuffer = decodeHash(hashToVerify.value, hashToVerify.encoding);
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid hash encoding', message: err.message }, { status: 400 });
  }

  // Compute hash
  const algo = algorithm.toLowerCase().replace('-', '') as ShaAlgorithm;
  const generated = createHash(algo).update(inputBuffer).digest();
  const meta = ALGORITHM_LENGTHS[algorithm];
  const generatedHex = generated.toString('hex');
  const generatedBase64 = generated.toString('base64');

  // Constant-time compare
  const verified = constantTimeEqual(generated, hashBuffer);

  if (verified) {
    return NextResponse.json({
      algorithm,
      verified: true,
      generatedHash: {
        hex: generatedHex,
        base64: generatedBase64,
      },
      hashMetadata: meta,
    });
  } else {
    return NextResponse.json({
      algorithm,
      verified: false,
      reason: 'Hash does not match',
      generatedHash: {
        hex: generatedHex,
        base64: generatedBase64,
      },
    });
  }
}
