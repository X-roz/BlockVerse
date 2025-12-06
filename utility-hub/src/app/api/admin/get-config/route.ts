import { NextResponse } from 'next/server';
import { getConfig } from '@/utils/storage';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/auth/verifyToken';

const STORAGE_SOURCE = process.env.STORAGE_SOURCE || 'mock';

let logs: string[] = [];

export async function GET() {
  const cookie = (await cookies()).get('admin_session')?.value;
  const { valid } = verifyToken(cookie);
  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const config = await getConfig();
    logs.push(`Config read using STORAGE_SOURCE=${STORAGE_SOURCE} at ${new Date().toISOString()}`);
    return NextResponse.json({
      config,
      source: STORAGE_SOURCE,
      last_updated: config.lastUpdated,
      version: config.version,
      logs,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
