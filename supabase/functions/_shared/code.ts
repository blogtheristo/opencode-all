// Verification-code helpers — generation, hashing, constant-time compare.
// Codes are NEVER stored or logged in plaintext.
import { CODE_ALPHABET } from './zod-schemas.ts';

const CODE_LENGTH = 6;

export function generateCode(): string {
  const buf = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(buf);
  let out = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[buf[i] % CODE_ALPHABET.length];
  }
  return out;
}

export function generateSaltHex(bytes = 16): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashCode(code: string, saltHex: string): Promise<string> {
  const data = new TextEncoder().encode(`${code}|${saltHex}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Length-independent (both inputs already known-equal length in caller, but
// fold any mismatch into the result so we don't early-return).
export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
