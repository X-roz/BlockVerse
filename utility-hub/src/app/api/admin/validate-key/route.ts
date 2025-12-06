import { NextResponse } from 'next/server';
import { setSessionCookie, generateToken } from '@/utils/auth';
import { decryptAdminKey } from '@/crypto/decrypt';

const ADMIN_KEY = process.env.ADMIN_KEY;
const ENCRYPTION_SECRET = process.env.ADMIN_ENCRYPTION_SECRET || '';

export async function POST(req: Request) {
  const { iv, payload, tag } = await req.json();
  console.log('IV (base64):', iv, 'length:', iv?.length);
  console.log('Payload (base64):', payload, 'length:', payload?.length);
  console.log('Tag (base64):', tag, 'length:', tag?.length);
  if (!iv || !payload || !tag) {
    return NextResponse.json({ success: false, error: 'Missing iv, payload, or tag' }, { status: 401 });
  }
  let decrypted;
  try {
    decrypted = decryptAdminKey({ iv, payload, tag }, ENCRYPTION_SECRET);
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Decryption failed (exception)' }, { status: 401 });
  }
  if (!decrypted) {
    return NextResponse.json({ success: false, error: 'Decryption failed' }, { status: 401 });
  }
  if (decrypted === ADMIN_KEY) {
    const token = generateToken();
    await setSessionCookie(token);
    return NextResponse.json({ success: true, token });
  }
  return NextResponse.json({ success: false, error: 'Invalid key' }, { status: 401 });
}
