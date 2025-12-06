import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { setConfig } from '@/utils/storage';
import { verifyToken } from '@/utils/auth/verifyToken';

const STORAGE_SOURCE = process.env.STORAGE_SOURCE || 'mock';
const ADMIN_KEY = process.env.ADMIN_KEY;
let logs: string[] = [];

function isValidSession(cookie: string | undefined) {
  if (!cookie) return false;
  try {
    return Buffer.from(cookie, 'base64').toString() === ADMIN_KEY;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const cookie = (await cookies()).get('admin_session')?.value;
  const { valid } = verifyToken(cookie);
  if (!valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const { config } = await req.json();
  let parsed;
  try {
    parsed = JSON.parse(config);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'Invalid JSON: ' + e.message }, { status: 400 });
  }
  // Update version and timestamp
  parsed.last_updated = new Date().toISOString();
  parsed.version = (parseInt(parsed.version || '0') + 1).toString();
  try {
    await setConfig(parsed);
    logs.push(`Updated using STORAGE_SOURCE=${STORAGE_SOURCE} at ${parsed.last_updated}`);
    return NextResponse.json({ success: true, last_updated: parsed.last_updated, version: parsed.version, logs });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
