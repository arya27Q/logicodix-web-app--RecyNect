import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import type { ScryptOptions } from 'node:crypto';

const KEY_LENGTH = 64;
const SCRYPT_OPTIONS: ScryptOptions = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function deriveKey(password: string, salt: Buffer, options = SCRYPT_OPTIONS): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, options, (error, key) => {
      if (error) reject(error);
      else resolve(key as Buffer);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `scrypt$32768$8$1$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [scheme, n, r, p, saltValue, keyValue, extra] = encoded.split('$');
  if (scheme !== 'scrypt' || n !== '32768' || r !== '8' || p !== '1' || !saltValue || !keyValue || extra !== undefined) {
    return false;
  }

  try {
    const salt = Buffer.from(saltValue, 'base64url');
    const expected = Buffer.from(keyValue, 'base64url');
    if (salt.length !== 16 || expected.length !== KEY_LENGTH) return false;

    const actual = await deriveKey(password, salt);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

let dummyHash: Promise<string> | undefined;

export async function verifyPasswordForLogin(password: string, encoded?: string): Promise<boolean> {
  const hash = encoded ?? await (dummyHash ??= hashPassword(randomBytes(32).toString('hex')));
  const matches = await verifyPassword(password, hash);
  return Boolean(encoded) && matches;
}
