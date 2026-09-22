// Evidence: Tool=Claude Code Model=claude-opus-5 Agent=Claude Code Date=2026-09-24
// Audit trail: git log -- src/services/document-access.ts

import { readFileSync } from 'node:fs';
import { join, normalize } from 'node:path';

/**
 * Decides which documents a signed-in user may open, from
 * docs/access/document-access-policy.json.
 *
 * Pure: no database, no filesystem beyond loading the policy once, so the
 * entitlement matrix is testable without a Supabase round trip. The route layer
 * supplies the identity and writes the audit row.
 */

export type DocumentClass = 'public' | 'user' | 'customer' | 'internal' | 'confidential';

/** Widening order — index is the class rank, used only for "highest grant held". */
const CLASS_ORDER: DocumentClass[] = ['public', 'user', 'customer', 'internal', 'confidential'];

interface PolicyRule {
  class: DocumentClass;
  why: string;
  patterns: string[];
}

interface Policy {
  version: string;
  principals: Array<{ email: string; label: string; grants: DocumentClass[] }>;
  roleGrants: Record<string, DocumentClass[]>;
  rules: PolicyRule[];
  audit: { table: string; action: string; resourceType: string };
}

const POLICY_PATH = join(process.cwd(), 'docs/access/document-access-policy.json');

let cached: {
  policy: Policy;
  compiled: Array<{ cls: DocumentClass; why: string; re: RegExp }>;
} | null = null;

function load() {
  if (cached) return cached;
  const policy = JSON.parse(readFileSync(POLICY_PATH, 'utf8')) as Policy;
  const compiled = policy.rules.flatMap((rule) =>
    rule.patterns.map((p) => ({ cls: rule.class, why: rule.why, re: new RegExp(p, 'i') })),
  );
  cached = { policy, compiled };
  return cached;
}

/** Test seam — drops the memoised policy so a test can swap the file. */
export function resetPolicyCache(): void {
  cached = null;
}

export function getAuditConfig(): Policy['audit'] {
  return load().policy.audit;
}

/**
 * Classifies a repo-relative path. Anything matching no rule is confidential:
 * a document nobody has classified is withheld rather than exposed.
 */
export function classifyDocument(repoPath: string): { class: DocumentClass; why: string } {
  const path = repoPath.replace(/\\/g, '/').replace(/^\.?\//, '');
  const { compiled } = load();
  const hit = compiled.find((r) => r.re.test(path));
  return hit
    ? { class: hit.cls, why: hit.why }
    : { class: 'confidential', why: 'No rule matched — withheld until classified.' };
}

/** Classes this identity may open. Named principals win over the role fallback. */
export function grantsFor(email: string | null | undefined, role?: string | null): DocumentClass[] {
  const { policy } = load();

  const named = policy.principals.find(
    (p) => p.email.toLowerCase() === (email ?? '').trim().toLowerCase(),
  );
  if (named) return named.grants;

  if (role && policy.roleGrants[role]) return policy.roleGrants[role];
  return [];
}

export function canOpen(
  repoPath: string,
  email: string | null | undefined,
  role?: string | null,
): { allowed: boolean; class: DocumentClass; why: string } {
  const { class: cls, why } = classifyDocument(repoPath);
  return { allowed: grantsFor(email, role).includes(cls), class: cls, why };
}

/** Highest class an identity holds, for a one-line "what can I see" summary. */
export function highestGrant(
  email: string | null | undefined,
  role?: string | null,
): DocumentClass | null {
  const grants = grantsFor(email, role);
  for (let i = CLASS_ORDER.length - 1; i >= 0; i -= 1) {
    if (grants.includes(CLASS_ORDER[i])) return CLASS_ORDER[i];
  }
  return null;
}

/**
 * Resolves a caller-supplied path to a real file under an allowed root.
 *
 * Returns null on anything that escapes — the request names the document, so a
 * traversal here would hand over arbitrary repo files including .env. Rejects
 * absolute paths, null bytes, and any normalised path that leaves the root.
 */
export function resolveDocumentPath(repoRoot: string, requested: string): string | null {
  if (!requested || requested.includes('\0')) return null;

  const cleaned = requested.replace(/\\/g, '/').replace(/^\/+/, '');
  if (/^[a-z]:/i.test(cleaned)) return null;

  const allowedRoots = ['Learn/', 'Admin/', 'docs/'];
  if (!allowedRoots.some((r) => cleaned.toLowerCase().startsWith(r.toLowerCase()))) return null;

  const normalised = normalize(cleaned);
  if (normalised.startsWith('..') || normalised.includes(`..${'/'}`)) return null;

  const full = join(repoRoot, normalised);
  if (!full.startsWith(join(repoRoot) + '/')) return null;

  return full;
}
