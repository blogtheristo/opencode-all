/**
 * Capability tokens — per-agent auth for the credential broker.
 *
 * Each calling agent (NemoClaw, Hermes, …) is issued a plaintext bearer token
 * out of band. The broker only stores a SHA-256 hash of the token plus the
 * list of provider scopes the agent is allowed to reach. Plaintext tokens are
 * never persisted server-side.
 *
 * Registry source: process.env.BROKER_AGENT_TOKENS, a JSON map of the form
 *
 *   {
 *     "nemoclaw": { "tokenSha256": "<hex>", "scopes": ["anthropic","telegram"] },
 *     "hermes":   { "tokenSha256": "<hex>", "scopes": ["anthropic","gmail"] }
 *   }
 *
 * Hash a plaintext token (one-liner):
 *   node -e "console.log(require('crypto').createHash('sha256').update('PLAINTEXT').digest('hex'))"
 *
 * BROKER_AGENT_TOKENS is itself a secret and should be loaded from the vault
 * by secret-loader at boot. It is not the upstream credential — it is the
 * lookup table from agent token → which upstream the agent may reach.
 */

import { createHash, timingSafeEqual } from 'crypto';

export interface AgentEntry {
  /** Lowercase hex SHA-256 of the plaintext bearer token. */
  tokenSha256: string;
  /** Provider IDs from providers.ts (e.g. "anthropic", "telegram"). */
  scopes: string[];
}

export interface AgentIdentity {
  agentId: string;
  scopes: string[];
}

interface RegistryCacheEntry {
  raw: string;
  parsed: Record<string, AgentEntry>;
}

let cache: RegistryCacheEntry | null = null;

function parseRegistry(): Record<string, AgentEntry> {
  const raw = process.env.BROKER_AGENT_TOKENS;
  if (!raw || raw.trim() === '') return {};

  if (cache && cache.raw === raw) return cache.parsed;

  try {
    const parsed = JSON.parse(raw) as Record<string, AgentEntry>;
    for (const [id, entry] of Object.entries(parsed)) {
      if (
        typeof entry?.tokenSha256 !== 'string' ||
        !/^[0-9a-f]{64}$/i.test(entry.tokenSha256) ||
        !Array.isArray(entry?.scopes)
      ) {
        throw new Error(`BROKER_AGENT_TOKENS: invalid entry for "${id}"`);
      }
    }
    cache = { raw, parsed };
    return parsed;
  } catch (err) {
    cache = { raw, parsed: {} };
    throw err instanceof Error ? err : new Error(String(err));
  }
}

function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

function constantTimeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Validate a plaintext bearer token against the agent registry.
 * Returns the matched agent identity, or null if no match.
 *
 * Timing-safe: every entry in the registry is compared even after a match,
 * so callers cannot distinguish "unknown agent" from "wrong token" by latency.
 */
export function authenticateBrokerToken(plaintext: string | undefined): AgentIdentity | null {
  if (!plaintext) return null;

  let registry: Record<string, AgentEntry>;
  try {
    registry = parseRegistry();
  } catch {
    return null;
  }

  const hashed = sha256Hex(plaintext);
  let matched: AgentIdentity | null = null;

  for (const [agentId, entry] of Object.entries(registry)) {
    const eq = constantTimeEqualHex(hashed, entry.tokenSha256.toLowerCase());
    if (eq && !matched) {
      matched = { agentId, scopes: entry.scopes };
    }
  }

  return matched;
}

export function hasScope(identity: AgentIdentity, providerId: string): boolean {
  return identity.scopes.includes(providerId);
}

/** Exposed for tests — drops the parse cache. */
export function _resetRegistryCacheForTests(): void {
  cache = null;
}
