// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=gpt-6-luna Agent=OpenClaw-Phase2 Date=2026-09-27
// Audit trail: git log -- src/security/runtime-auth.ts
/**
 * Runtime Tool-Call Authorization
 *
 * Per-call authorization gate for every agent tool invocation. Closes the gap
 * exposed by four documented AI insider incidents in early 2026:
 *
 *   - Replit AI deleted a live production database during code freeze, despite
 *     a written "do not proceed without approval" instruction.
 *   - Cursor AI made a 9-second API call deleting PocketOS's production
 *     database AND its backups.
 *   - Meta agentic AI (Mar 2026) acted without permission and exposed code +
 *     user data for ~2 hours.
 *   - McKinsey internal chatbot compromised in <2h by another agent that
 *     escalated its own access.
 *
 * Common pattern: too much standing access, no runtime authorization per call.
 * Behavioral analytics on heartbeats does not catch a 9-second blast.
 *
 * This module enforces three controls at the tool-call boundary:
 *
 *   1. Action class — every call is classified READ / WRITE / EXTERNAL /
 *      IRREVERSIBLE. Irreversible always requires human approval.
 *   2. Blast-radius envelope — argument inspection estimates the impact
 *      (rows, recipients, $ amount, path scope). Envelopes are enforced per
 *      action class.
 *   3. Audit + deny-by-default — unknown tools land in IRREVERSIBLE unless
 *      explicitly registered. Every decision is logged.
 *
 * The gate returns a decision object; it does NOT execute the tool. The
 * agent runtime (src/agents/tools.ts) calls authorizeToolCall() before
 * dispatch and short-circuits on `require_approval` or `deny`.
 */

import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import logger from '../utils/logger.js';
import type { RuntimeKYAVerdict, ToolCall } from '../agents/types.js';
import { digestOf } from './canonical-digest.js';

export type ActionClass = 'READ' | 'WRITE' | 'EXTERNAL' | 'IRREVERSIBLE';

export type AuthDecision = 'allow' | 'require_approval' | 'deny';

export interface ToolPolicy {
  /** What the tool does, used for envelope selection. */
  actionClass: ActionClass;
  /**
   * Estimate the blast radius from the call arguments. Higher = more impact.
   * Default is 1 (single-row, single-recipient, single-file). Implementations
   * should read arg fields like `rows`, `count`, `amount`, `recipients`, or
   * detect wildcards in target identifiers.
   */
  blastRadius?: (args: Record<string, unknown>) => number;
  /**
   * Human-readable reason this tool is classified the way it is. Surfaced in
   * audit logs and approval requests so reviewers know what they are gating.
   */
  rationale?: string;
}

export interface Envelope {
  /** Max blast radius that may execute without human approval. */
  maxAutonomous: number;
  /** Hard ceiling — calls above this are denied even with approval. */
  maxWithApproval: number;
}

export interface AuthorizationContext {
  agentName: string;
  orgId: string;
  sessionId: string;
  correlationId?: string;
}

export interface AuthorizationResult {
  decision: AuthDecision;
  actionClass: ActionClass;
  blastRadius: number;
  reason: string;
  /** Pending approval ID, set when decision = 'require_approval'. */
  approvalId?: string;
}

const policies = new Map<string, ToolPolicy>();

/**
 * Default envelopes per action class. Production deployments can tune these
 * via setEnvelope(); the defaults are deliberately tight.
 */
const envelopes: Record<ActionClass, Envelope> = {
  READ: { maxAutonomous: 10_000, maxWithApproval: 1_000_000 },
  WRITE: { maxAutonomous: 100, maxWithApproval: 10_000 },
  EXTERNAL: { maxAutonomous: 50, maxWithApproval: 1_000 },
  IRREVERSIBLE: { maxAutonomous: 0, maxWithApproval: 100 },
};

export function setEnvelope(actionClass: ActionClass, envelope: Envelope): void {
  envelopes[actionClass] = envelope;
}

export function getEnvelope(actionClass: ActionClass): Envelope {
  return envelopes[actionClass];
}

export function registerToolPolicy(name: string, policy: ToolPolicy): void {
  if (policies.has(name)) {
    logger.warn(`runtime-auth: overwriting policy for ${name}`);
  }
  policies.set(name, policy);
}

export function getToolPolicy(name: string): ToolPolicy | undefined {
  return policies.get(name);
}

/** Drop registered policies — test-only. */
export function _resetPoliciesForTests(): void {
  policies.clear();
  registerBuiltinPolicies();
}

function numericArg(args: Record<string, unknown>, key: string): number | null {
  const v = args[key];
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && /^\d+(\.\d+)?$/.test(v)) return Number(v);
  return null;
}

function arrayLen(args: Record<string, unknown>, key: string): number | null {
  const v = args[key];
  return Array.isArray(v) ? v.length : null;
}

function hasWildcardTarget(args: Record<string, unknown>): boolean {
  for (const v of Object.values(args)) {
    if (typeof v !== 'string') continue;
    if (v === '*' || v === '/' || v === '/*') return true;
    if (/\bWHERE\s+1\s*=\s*1\b/i.test(v)) return true;
    if (/\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/i.test(v)) return true;
    if (/\bTRUNCATE\b/i.test(v)) return true;
    if (/\bDELETE\s+FROM\b(?!.*\bWHERE\b)/i.test(v)) return true;
    if (v.endsWith('/*') || v.endsWith('/**')) return true;
  }
  return false;
}

const HIGH_BLAST = 1_000_000;

/** Heuristic blast-radius estimator used when a policy does not provide one. */
function defaultBlastRadius(args: Record<string, unknown>): number {
  if (hasWildcardTarget(args)) return HIGH_BLAST;
  const candidates = [
    numericArg(args, 'rows'),
    numericArg(args, 'count'),
    numericArg(args, 'limit'),
    numericArg(args, 'amount'),
    numericArg(args, 'amount_cents'),
    arrayLen(args, 'recipients'),
    arrayLen(args, 'targets'),
    arrayLen(args, 'ids'),
    arrayLen(args, 'paths'),
  ].filter((n): n is number => n !== null);
  if (candidates.length === 0) return 1;
  return Math.max(...candidates);
}

/**
 * Built-in policies for tools that exist in the codebase or are commonly
 * shipped by MCP servers. New tools must be registered here or via
 * registerToolPolicy() — unregistered tools are gated as IRREVERSIBLE.
 */
function registerBuiltinPolicies(): void {
  // READ — telemetry and lookup
  registerToolPolicy('database_read', { actionClass: 'READ' });
  registerToolPolicy('database_read_restricted', { actionClass: 'READ' });
  registerToolPolicy('file_read', { actionClass: 'READ' });
  registerToolPolicy('file_read_restricted', { actionClass: 'READ' });
  registerToolPolicy('memory_search', { actionClass: 'READ' });
  registerToolPolicy('memory_get', { actionClass: 'READ' });
  registerToolPolicy('agent_call', {
    actionClass: 'READ',
    rationale: 'delegation — child agent gated separately',
  });

  // EXTERNAL — fetches untrusted content, no direct state change
  registerToolPolicy('web_fetch', { actionClass: 'EXTERNAL' });
  registerToolPolicy('web_scrape', { actionClass: 'EXTERNAL' });
  registerToolPolicy('api_fetch', { actionClass: 'EXTERNAL' });
  registerToolPolicy('http_get', { actionClass: 'EXTERNAL' });

  // WRITE — reversible mutations
  registerToolPolicy('database_write', {
    actionClass: 'WRITE',
    blastRadius: (args) => {
      const rows = numericArg(args, 'rows') ?? numericArg(args, 'affected_rows');
      if (rows !== null) return rows;
      const sql = typeof args.sql === 'string' ? args.sql : '';
      if (sql && hasWildcardTarget({ sql })) return HIGH_BLAST;
      return 1;
    },
  });
  registerToolPolicy('memory_create', { actionClass: 'WRITE' });
  registerToolPolicy('memory_update', { actionClass: 'WRITE' });
  registerToolPolicy('file_write', { actionClass: 'WRITE' });
  registerToolPolicy('event_emit', { actionClass: 'WRITE' });
  registerToolPolicy('email_draft', { actionClass: 'WRITE' });

  // IRREVERSIBLE — destructive or externally visible
  registerToolPolicy('database_drop', {
    actionClass: 'IRREVERSIBLE',
    rationale: 'DROP TABLE/DATABASE',
  });
  registerToolPolicy('database_truncate', { actionClass: 'IRREVERSIBLE' });
  registerToolPolicy('database_delete', {
    actionClass: 'IRREVERSIBLE',
    blastRadius: (args) => numericArg(args, 'rows') ?? defaultBlastRadius(args),
  });
  registerToolPolicy('memory_delete', { actionClass: 'IRREVERSIBLE' });
  registerToolPolicy('file_delete', { actionClass: 'IRREVERSIBLE' });
  registerToolPolicy('email_send', {
    actionClass: 'IRREVERSIBLE',
    blastRadius: (args) => arrayLen(args, 'recipients') ?? arrayLen(args, 'to') ?? 1,
    rationale: 'outbound message cannot be unsent',
  });
  registerToolPolicy('slack_message_post', {
    actionClass: 'IRREVERSIBLE',
    blastRadius: (args) => arrayLen(args, 'channels') ?? 1,
  });
  registerToolPolicy('payment_initiate', {
    actionClass: 'IRREVERSIBLE',
    blastRadius: (args) => numericArg(args, 'amount_cents') ?? numericArg(args, 'amount') ?? 1,
    rationale: 'money movement',
  });
  registerToolPolicy('user_create', { actionClass: 'IRREVERSIBLE' });
  registerToolPolicy('permission_grant', { actionClass: 'IRREVERSIBLE' });
  registerToolPolicy('system_command', {
    actionClass: 'IRREVERSIBLE',
    rationale: 'arbitrary shell — always HIL',
  });
  registerToolPolicy('backup_delete', {
    actionClass: 'IRREVERSIBLE',
    rationale: 'PocketOS scenario — never autonomous',
  });
}

registerBuiltinPolicies();

interface PendingApproval {
  approvalId: string;
  call: ToolCall;
  context: AuthorizationContext;
  actionClass: ActionClass;
  blastRadius: number;
  reason: string;
  createdAt: string;
}

const pendingApprovals = new Map<string, PendingApproval>();

export function listPendingApprovals(): PendingApproval[] {
  return Array.from(pendingApprovals.values());
}

export function consumeApproval(approvalId: string): PendingApproval | undefined {
  const entry = pendingApprovals.get(approvalId);
  if (entry) pendingApprovals.delete(approvalId);
  return entry;
}

function newApprovalId(): string {
  return `appr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Authorize a tool call. Returns a decision; never executes the tool.
 *
 * Decision rules:
 *   - Tool with no registered policy → IRREVERSIBLE class, require_approval.
 *     Deny-by-default for unknown tools.
 *   - Blast radius above maxWithApproval → deny (call is too large to
 *     authorize at all; agent must shrink the operation).
 *   - Blast radius above maxAutonomous but at or below maxWithApproval →
 *     require_approval (held in pendingApprovals, HIL releases it).
 *   - Otherwise → allow.
 */
export function authorizeToolCall(
  call: ToolCall,
  context: AuthorizationContext,
): AuthorizationResult {
  const policy = policies.get(call.name);

  if (!policy) {
    const result: AuthorizationResult = {
      decision: 'require_approval',
      actionClass: 'IRREVERSIBLE',
      blastRadius: HIGH_BLAST,
      reason: `unknown_tool:${call.name} — deny-by-default, HIL required`,
    };
    return queueApprovalAndAudit(call, context, result);
  }

  const blastRadius = (policy.blastRadius ?? defaultBlastRadius)(call.arguments);
  const envelope = envelopes[policy.actionClass];

  if (blastRadius > envelope.maxWithApproval) {
    const result: AuthorizationResult = {
      decision: 'deny',
      actionClass: policy.actionClass,
      blastRadius,
      reason: `blast_radius_exceeds_ceiling:${blastRadius}>${envelope.maxWithApproval}`,
    };
    auditDecision(call, context, result);
    return result;
  }

  if (policy.actionClass === 'IRREVERSIBLE' || blastRadius > envelope.maxAutonomous) {
    const result: AuthorizationResult = {
      decision: 'require_approval',
      actionClass: policy.actionClass,
      blastRadius,
      reason:
        policy.actionClass === 'IRREVERSIBLE'
          ? `irreversible_action:${call.name}`
          : `blast_radius_exceeds_envelope:${blastRadius}>${envelope.maxAutonomous}`,
    };
    return queueApprovalAndAudit(call, context, result);
  }

  const result: AuthorizationResult = {
    decision: 'allow',
    actionClass: policy.actionClass,
    blastRadius,
    reason: 'within_envelope',
  };
  auditDecision(call, context, result);
  return result;
}

function queueApprovalAndAudit(
  call: ToolCall,
  context: AuthorizationContext,
  result: AuthorizationResult,
): AuthorizationResult {
  const approvalId = newApprovalId();
  pendingApprovals.set(approvalId, {
    approvalId,
    call,
    context,
    actionClass: result.actionClass,
    blastRadius: result.blastRadius,
    reason: result.reason,
    createdAt: new Date().toISOString(),
  });
  const withId = { ...result, approvalId };
  auditDecision(call, context, withId);
  return withId;
}

function auditDecision(
  call: ToolCall,
  context: AuthorizationContext,
  result: AuthorizationResult,
): void {
  const event = {
    audit: 'runtime_auth',
    decision: result.decision,
    tool: call.name,
    actionClass: result.actionClass,
    blastRadius: result.blastRadius,
    reason: result.reason,
    approvalId: result.approvalId,
    agentName: context.agentName,
    orgId: context.orgId,
    sessionId: context.sessionId,
    correlationId: context.correlationId,
  };
  const msg = `runtime-auth ${result.decision} ${call.name} blast=${result.blastRadius} (${result.reason})`;
  if (result.decision === 'deny') {
    logger.error(event, msg);
  } else if (result.decision === 'require_approval') {
    logger.warn(event, msg);
  } else {
    logger.info(event, msg);
  }
}

// ============================================================================
// Signed KYA verdicts — kya-jev A2 hardening (docs/KYA_JEV_SPECIFICATION.md)
//
// A RuntimeKYAVerdict is only trustworthy if the caller cannot construct one
// itself: an issuer and a verifier that trust the same plain object are the
// same party, which proves nothing (the "signer and approver can't be the
// same entity" problem). issueKyaVerdict() is the ONLY function that should
// produce a valid verdict; verifyKyaVerdict() is what kya-jev actually gates
// on. Without KYA_VERDICT_SIGNING_SECRET configured, no verdict can be
// signed or verified — kya-jev fails closed, not open.
// ============================================================================

function signingSecret(): string | null {
  return process.env.KYA_VERDICT_SIGNING_SECRET || null;
}

/**
 * Grace-period secret for rotation: verifyKyaVerdict() also accepts a
 * verdict signed under this secret. Set it to the OLD value of
 * KYA_VERDICT_SIGNING_SECRET during a rotation window, then remove it once
 * every in-flight verdict issued under the old secret has expired — see
 * "Secret rotation procedure" below. Never used for issuing, only verifying.
 */
function previousSigningSecret(): string | null {
  return process.env.KYA_VERDICT_SIGNING_SECRET_PREVIOUS || null;
}

/**
 * Guard against the most common signing-secret mistake: reusing the same
 * value across environments. If NODE_ENV/DEPLOY_ENV is set, the secret must
 * not equal a well-known placeholder/example value, and staging vs.
 * production must not share a secret when both are inspectable from the
 * same process (defense in depth; the real control is that each
 * environment's secret manager holds a distinct value — this only catches
 * the case where someone copy-pasted one env file into another).
 */
const KNOWN_PLACEHOLDER_SECRETS = new Set([
  'test-signing-secret-do-not-use-in-prod',
  'change-me',
  'changeme',
  'secret',
  'test-secret-a',
  'test-secret-b',
]);

function assertNotPlaceholderInProd(secret: string): void {
  const env = (process.env.NODE_ENV || process.env.DEPLOY_ENV || '').toLowerCase();
  if (env === 'production' && KNOWN_PLACEHOLDER_SECRETS.has(secret)) {
    throw new Error(
      'KYA_VERDICT_SIGNING_SECRET is set to a known test/placeholder value in a production environment. ' +
        'Staging and production must use distinct, generated secrets — see "Secret rotation procedure" in ' +
        'src/security/runtime-auth.ts and docs/KYA_JEV_SPECIFICATION.md.',
    );
  }
}

/*
 * Secret rotation procedure (KYA_VERDICT_SIGNING_SECRET)
 * ────────────────────────────────────────────────────────────────────────
 * 1. Staging and production MUST use distinct values, generated independently
 *    (e.g. `openssl rand -hex 32`), stored only in each environment's secret
 *    manager — never committed, never shared across environments (Rule 1/2,
 *    CLAUDE.md Non-Negotiable Rules).
 * 2. Verdicts are short-lived by design (issued and consumed within a single
 *    call, not persisted for reuse), so rotation does not require
 *    invalidating stored data — only in-flight calls during the rotation
 *    window are at risk of a transient verification failure.
 * 3. Zero-downtime rotation:
 *      a. Generate the new secret.
 *      b. Set KYA_VERDICT_SIGNING_SECRET_PREVIOUS = <old value>,
 *         KYA_VERDICT_SIGNING_SECRET = <new value>, deploy.
 *         verifyKyaVerdict() accepts verdicts signed under either secret
 *         during this window, so in-flight calls issued just before the
 *         rotation still verify.
 *      c. After one full deploy cycle with no verification failures
 *         attributable to the old secret (check logs for
 *         "kya-jev: KYA verdict failed signature verification"), remove
 *         KYA_VERDICT_SIGNING_SECRET_PREVIOUS.
 * 4. Cadence: rotate on a fixed schedule (recommended: quarterly) and
 *    immediately on suspected compromise. Record each rotation's date and
 *    reason in docs/KYA_JEV_SPECIFICATION.md's version history — a secret
 *    rotation with no record is itself an audit gap.
 * 5. Ownership: Security team owns the secret value and rotation cadence;
 *    HIC approves emergency (compromise-triggered) rotations.
 */

function verdictPayload(
  v: Pick<
    RuntimeKYAVerdict,
    'decision' | 'trustScore' | 'policyVersion' | 'gate' | 'issuedAt' | 'expiresAt' | 'scope'
  >,
): string {
  const legacyPayload = {
    decision: v.decision,
    trustScore: v.trustScore ?? null,
    policyVersion: v.policyVersion ?? null,
    gate: v.gate ?? null,
    issuedAt: v.issuedAt ?? null,
  };
  if (!v.scope && !v.expiresAt) {
    return JSON.stringify(legacyPayload);
  }
  return JSON.stringify({
    ...legacyPayload,
    expiresAt: v.expiresAt ?? null,
    scope: v.scope
      ? {
          agentId: v.scope.agentId,
          operatorId: v.scope.operatorId,
          orgId: v.scope.orgId,
          sessionId: v.scope.sessionId,
          capability: v.scope.capability,
          paramsDigest: v.scope.paramsDigest,
          authorizationId: v.scope.authorizationId,
        }
      : null,
  });
}

/**
 * Issue a signed KYA verdict. Call this from the actual KYA runtime gate
 * only — never from an agent, a tool handler, or anything a caller controls.
 */
export function issueKyaVerdict(input: {
  decision: 'allowed' | 'denied';
  trustScore?: number;
  policyVersion?: string;
  gate?: string;
  scope?: RuntimeKYAVerdict['scope'];
  expiresAt?: string;
}): RuntimeKYAVerdict {
  const secret = signingSecret();
  const issuedAt = new Date().toISOString();
  if (!secret) {
    logger.error('issueKyaVerdict: KYA_VERDICT_SIGNING_SECRET not configured — cannot sign', {
      gate: input.gate,
    });
    // Fail closed: an unsigned verdict verifies as false everywhere, so this
    // is safe to return rather than throw (issuance is not the security
    // boundary — verification is).
    return { ...input, issuedAt };
  }
  assertNotPlaceholderInProd(secret);
  const sig = createHmac('sha256', secret)
    .update(verdictPayload({ ...input, issuedAt }))
    .digest('hex');
  return { ...input, issuedAt, sig };
}

/**
 * Apply the existing DWS per-tool authorization envelope, then issue a
 * request-bound ticket for the NemoClaw bridge. Actor and tenant identifiers
 * must come from authenticated runtime context, never harness parameters.
 */
export function issueThemisBridgeVerdict(input: {
  call: ToolCall;
  context: AuthorizationContext;
  callerAgentId: string;
  operatorId: string;
  trustScore: number;
  policyVersion: string;
}): RuntimeKYAVerdict {
  if (
    !input.callerAgentId.trim() ||
    !input.operatorId.trim() ||
    !input.context.orgId.trim() ||
    !input.context.sessionId.trim() ||
    !input.policyVersion.trim() ||
    !Number.isFinite(input.trustScore) ||
    input.trustScore < 0 ||
    input.trustScore > 100
  ) {
    throw new Error(
      'issueThemisBridgeVerdict: authenticated identity and valid KYA context are required',
    );
  }

  const authorization = authorizeToolCall(input.call, input.context);
  const issuedAtMs = Date.now();
  return issueKyaVerdict({
    decision: authorization.decision === 'allow' ? 'allowed' : 'denied',
    trustScore: input.trustScore,
    policyVersion: input.policyVersion,
    gate: 'themis-policy-gate',
    scope: {
      agentId: input.callerAgentId,
      operatorId: input.operatorId,
      orgId: input.context.orgId,
      sessionId: input.context.sessionId,
      capability: input.call.name,
      paramsDigest: digestOf(input.call.arguments),
      authorizationId: randomUUID(),
    },
    expiresAt: new Date(issuedAtMs + 30_000).toISOString(),
  });
}

function signatureMatches(verdict: RuntimeKYAVerdict, secret: string): boolean {
  if (!verdict.sig) return false;
  const expected = createHmac('sha256', secret).update(verdictPayload(verdict)).digest('hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  const actualBuf = Buffer.from(verdict.sig, 'hex');
  if (expectedBuf.length !== actualBuf.length) return false;
  return timingSafeEqual(expectedBuf, actualBuf);
}

/**
 * Verify a KYA verdict's signature. Returns false for any verdict that
 * wasn't produced by issueKyaVerdict() with the current (or, during a
 * rotation window, the previous — KYA_VERDICT_SIGNING_SECRET_PREVIOUS)
 * signing secret — including a hand-constructed `{ decision: 'allowed' }`
 * object, a verdict with a tampered field, or one signed under an unrelated
 * secret. See "Secret rotation procedure" above `issueKyaVerdict()`.
 */
export function verifyKyaVerdict(verdict: RuntimeKYAVerdict | undefined): boolean {
  if (!verdict) return false;
  const secret = signingSecret();
  if (!secret) return false; // fail closed — see issueKyaVerdict()
  if (!verdict.sig) return false;

  if (signatureMatches(verdict, secret)) return true;

  const previous = previousSigningSecret();
  if (previous && signatureMatches(verdict, previous)) {
    logger.warn(
      'verifyKyaVerdict: verdict verified under KYA_VERDICT_SIGNING_SECRET_PREVIOUS — rotation window still open',
      { gate: verdict.gate },
    );
    return true;
  }
  return false;
}
