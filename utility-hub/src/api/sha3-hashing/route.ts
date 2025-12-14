import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

// Supported algorithms and their bit lengths
const ALGORITHMS = {
  'sha3-256': { bits: 256, bytes: 32 },
  'sha3-512': { bits: 512, bytes: 64 },
  'keccak-256': { bits: 256, bytes: 32 },
};

// Helper function to validate input encoding
const isValidEncoding = (encoding: string): boolean => {
  return ['utf-8', 'hex', 'base64'].includes(encoding);
};

// Helper function to decode input text
const decodeInput = (inputText: string, inputEncoding: string): Buffer => {
  try {
    if (inputEncoding === 'utf-8') {
      return Buffer.from(inputText, 'utf-8');
    }
    return Buffer.from(inputText, inputEncoding as BufferEncoding);
  } catch {
    throw new Error('Invalid input encoding or malformed inputText.');
  }
};

// Helper function to compute hash
const computeHash = (algorithm: string, inputBuffer: Buffer): Buffer => {
  if (algorithm === 'keccak-256') {
    // Use Ethereum-compatible Keccak-256 (pre-standardization)
    const Keccak = require('sha3').Keccak;
    const keccak = new Keccak(256);
    keccak.update(inputBuffer);
    return Buffer.from(keccak.digest());
  }

  // Use Node.js crypto for SHA3 algorithms
  const hash = createHash(algorithm);
  hash.update(inputBuffer);
  return hash.digest();
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inputText, inputEncoding, algorithm } = body;

    // Validate required fields
    if (!inputText || !inputEncoding || !algorithm) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Validate input encoding
    if (!isValidEncoding(inputEncoding)) {
      return NextResponse.json({ error: 'Invalid input encoding.' }, { status: 400 });
    }

    // Validate algorithm
    if (!(algorithm in ALGORITHMS)) {
      return NextResponse.json({ error: 'Unsupported algorithm.' }, { status: 400 });
    }

    // Type assertion for algorithm
    const algoKey = algorithm as keyof typeof ALGORITHMS;

    // Decode input text
    let inputBuffer;
    try {
      inputBuffer = decodeInput(inputText, inputEncoding);
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }

    // Compute hash
    const hashBuffer = computeHash(algorithm, inputBuffer);

    // Prepare response
    const { bits, bytes } = ALGORITHMS[algoKey];
    const response = {
      algorithm,
      context: algorithm === 'keccak-256' ? 'ethereum' : 'standard',
      inputEncoding,
      output: {
        hex: hashBuffer.toString('hex'),
        base64: hashBuffer.toString('base64'),
      },
      length: {
        bits,
        hexChars: bits / 4,
        bytes,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}