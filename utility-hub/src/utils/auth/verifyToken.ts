import jwt from 'jsonwebtoken';

const SECRET = process.env.ADMIN_KEY || 'default_secret';

export function verifyToken(token?: string) {
  console.log('verifyToken: received token:', token);
  if (!token) {
    console.log('verifyToken: no token');
    return { valid: false };
  }
  try {
    const payload = jwt.verify(token, SECRET) as { iat: number; exp: number };
    console.log('verifyToken: decoded payload:', payload);
    const now = Math.floor(Date.now() / 1000);
    console.log('verifyToken: now:', now, 'exp:', payload.exp);
    if (payload.exp < now) {
      console.log('verifyToken: token expired');
      return { valid: false };
    }
    return { valid: true, payload };
  } catch (err) {
    console.log('verifyToken: error:', err);
    return { valid: false };
  }
}
