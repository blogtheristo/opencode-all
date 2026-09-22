/**
 * Hard-rules content guard — TS port of the pattern in temporalio/ai-cookbook's
 * agents/guardrails_hard_rules_python: deterministic regex/pattern checks that
 * can only ESCALATE a decision to "block", never downgrade one. Soft
 * (LLM-drafted) content is fine for wording and tone; these hard rules are
 * the safety net underneath it — unambiguous violations get blocked
 * regardless of what the LLM decided, and the block always embeds what would
 * have shipped, for audit (never a silent drop).
 *
 * Applied here to outbound email (sendEmailActivity) because DWS6 already
 * has hard non-negotiable rules for exactly this content type — CLAUDE.md's
 * Secret Egress Rules ("no secret written to files/commits/MCP/logs" — the
 * same principle applies to an outbound email body) and Sender Identity
 * Rule (only three specific addresses are ever legitimate outbound From:,
 * `noreply@` is banned outright) — previously enforced only by convention/
 * human review, never at runtime.
 */

/** Patterns for commonly-leaked secret shapes. Intentionally broad/blunt — a
 * false positive here just means one blocked email needs a human look, which
 * is the correct default for "might be leaking a credential." */
const SECRET_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: 'aws-access-key-id', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'stripe-secret-key', pattern: /\bsk_(live|test)_[0-9a-zA-Z]{16,}\b/ },
  {
    name: 'generic-api-key-assignment',
    pattern:
      /\b(api[_-]?key|secret[_-]?key|access[_-]?token)\s*[:=]\s*['"]?[A-Za-z0-9_-]{16,}['"]?/i,
  },
  { name: 'pem-private-key-block', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  {
    name: 'jwt-looking-token',
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
  },
  { name: 'bearer-token', pattern: /\bBearer\s+[A-Za-z0-9._-]{20,}\b/ },
];

/** CLAUDE.md Sender Identity Rule — only these are ever legitimate outbound From:. */
const ALLOWED_SENDERS = new Set(['risto.paarni@lifetime.fi', 'risto@onelifetime.world']);

export interface HardRuleVerdict {
  blocked: boolean;
  /** Populated only when blocked=true — the specific rule(s) that fired. */
  reasons: string[];
}

function scanForSecrets(text: string): string[] {
  const hits: string[] = [];
  for (const { name, pattern } of SECRET_PATTERNS) {
    if (pattern.test(text)) hits.push(`secret-pattern:${name}`);
  }
  return hits;
}

function checkSenderIdentity(from: string): string[] {
  const address = from
    .replace(/^.*<(.+)>$/, '$1')
    .trim()
    .toLowerCase();
  if (address.startsWith('noreply@')) return ['noreply-sender-banned'];
  if (!ALLOWED_SENDERS.has(address)) return [`sender-not-allowlisted:${address}`];
  return [];
}

export interface EmailContentInput {
  from: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Escalate-only-to-block guard for outbound email. Never returns a decision
 * softer than what a caller already decided — this only adds `blocked`
 * reasons on top; callers that already refused to send stay refused.
 */
export function applyEmailHardRules(input: EmailContentInput): HardRuleVerdict {
  const reasons = [
    ...checkSenderIdentity(input.from),
    ...scanForSecrets(input.subject),
    ...scanForSecrets(input.html),
    ...(input.text ? scanForSecrets(input.text) : []),
  ];

  return { blocked: reasons.length > 0, reasons };
}
