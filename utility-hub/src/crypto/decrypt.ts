// AES-256-GCM decryption using PBKDF2 in Node.js
import crypto from 'crypto';

const SALT = Buffer.from('admin-encryption-salt'); // must match client
const ITERATIONS = 100000;
const KEYLEN = 32;
const DIGEST = 'sha256';

export function decryptAdminKey(
  { iv, payload, tag }: { iv: string; payload: string; tag: string },
  secret: string
): string | null {
  try {
    if (!iv || !payload || !tag) return null;
    const key = crypto.pbkdf2Sync(secret, SALT, ITERATIONS, KEYLEN, DIGEST);
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(iv, 'base64')
    );
    const ciphertext = Buffer.from(payload, 'base64');
    const authTag = Buffer.from(tag, 'base64');
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final()
    ]);
    return decrypted.toString('utf8');
  } catch (e) {
    return null;
  }
}
