import { NextRequest, NextResponse } from 'next/server';
import { shaHash, ShaAlgorithm, InputEncoding } from '@/utils/hashing/shaHashing';

const ALLOWED_ENCODINGS: InputEncoding[] = ['utf-8', 'hex', 'base64'];
const ALLOWED_ALGORITHMS: ShaAlgorithm[] = ['sha224', 'sha256', 'sha384', 'sha512'];

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { inputText, inputEncoding, algorithm } = body || {};

  // Validation
  if (typeof inputText !== 'string' || inputText.length === 0) {
    return NextResponse.json({ error: 'inputText must not be empty.' }, { status: 400 });
  }
  if (!ALLOWED_ENCODINGS.includes(inputEncoding)) {
    return NextResponse.json({ error: 'inputEncoding must be one of: utf-8, hex, base64.' }, { status: 400 });
  }
  if (!ALLOWED_ALGORITHMS.includes(algorithm)) {
    return NextResponse.json({ error: 'algorithm must be one of: sha224, sha256, sha384, sha512.' }, { status: 400 });
  }

  // Hashing
  try {
    const result = shaHash(inputText, inputEncoding, algorithm);
    return NextResponse.json({
      algorithm,
      inputEncoding,
      output: {
        hex: result.hex,
        base64: result.base64,
      },
      length: result.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Hashing failed.' }, { status: 400 });
  }
}
