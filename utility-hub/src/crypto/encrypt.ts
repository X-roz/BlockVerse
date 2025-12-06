// AES-256-GCM encryption using PBKDF2 in browser
// Usage: encryptAdminKey(adminKey, secret)

export async function encryptAdminKey(adminKey: string, secret: string): Promise<{ iv: string; payload: string; tag: string }> {
  // Derive key using PBKDF2
  const encoder = new TextEncoder();
  const salt = encoder.encode('admin-encryption-salt'); // static salt, can be improved
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  // Generate 12-byte IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Encrypt
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encoder.encode(adminKey)
  );

  // Split ciphertext and tag (last 16 bytes)
  const encryptedArr = new Uint8Array(encrypted);
  const tag = encryptedArr.slice(-16);
  const ciphertext = encryptedArr.slice(0, -16);

  // Use standard base64 encoding
  function toBase64(arr: ArrayBuffer | Uint8Array) {
    // Use Uint8Array to string, then btoa
    let binary = '';
    const bytes = new Uint8Array(arr);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  return {
    iv: toBase64(iv),
    payload: toBase64(ciphertext),
    tag: toBase64(tag),
  };
}
