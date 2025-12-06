import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.ADMIN_KEY || 'default_secret';

export function generateToken() {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 600; // 10 minutes
  return jwt.sign({ iat, exp }, SECRET);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { iat: number; exp: number };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: false, // For localhost only
    sameSite: 'strict',
    maxAge: 600,
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value || '';
}
