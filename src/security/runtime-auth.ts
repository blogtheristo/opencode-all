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

import logger from '../utils/logger.js';
import type { ToolCall } from '../agents/types.js';

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
  registerToolPolicy('agent_call', { actionClass: 'READ', rationale: 'delegation — child agent gated separately' });

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
  registerToolPolicy('database_drop', { actionClass: 'IRREVERSIBLE', rationale: 'DROP TABLE/DATABASE' });
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
  registerToolPolicy('system_command', { actionClass: 'IRREVERSIBLE', rationale: 'arbitrary shell — always HIL' });
  registerToolPolicy('backup_delete', { actionClass: 'IRREVERSIBLE', rationale: 'PocketOS scenario — never autonomous' });
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

  if (
    policy.actionClass === 'IRREVERSIBLE' ||
    blastRadius > envelope.maxAutonomous
  ) {
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
