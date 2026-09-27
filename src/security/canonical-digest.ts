// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=gpt-6-luna Agent=OpenClaw-Phase2 Date=2026-09-27
// Audit trail: git log -- src/security/canonical-digest.ts
import { createHash } from 'node:crypto';

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value) ?? 'null';
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalize(obj[key])}`)
    .join(',')}}`;
}

/** SHA-256 of a canonical, type-preserving JSON value. */
export function digestOf(value: unknown): string {
  return createHash('sha256').update(canonicalize(value)).digest('hex');
}
