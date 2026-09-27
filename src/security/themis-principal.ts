// Evidence: Tool=Claude Code 2.1.283 Model=anthropic/claude-opus-5-5 Agent=claude-code-web Date=2026-09-27
// Audit trail: git log -- src/security/themis-principal.ts
/**
 * Themis bridge principal — authenticated identity for NemoClaw verdicts.
 *
 * issueThemisBridgeVerdict() signs operator, tenant and agent identity into a
 * KYA verdict. Those values must come from verified credentials, never from
 * strings a caller or harness supplies. This module is the only producer of a
 * ThemisPrincipal; runtime-auth rejects any principal object it did not mint.
 *
 * Sources (both pre-existing, neither invented here):
 *   - Operator + tenant: DWS access JWT, verified by AuthService.verifyAccessToken
 *     (HS256, revocation list). userId → operatorId; organizationId/orgId → orgId.
 *   - Agent: capability bearer token in BROKER_AGENT_TOKENS, verified by
 *     authenticateBrokerToken (SHA-256, timing-safe). The entry must carry the
 *     `themis-bridge` scope; broker-only tokens cannot obtain a verdict.
 *
 * Boundary limits: this is an in-process check. Code running inside the API
 * process can read KYA_VERDICT_SIGNING_SECRET and is inside the trust
 * boundary regardless. sessionId, trustScore and policyVersion remain caller
 * inputs to the issuer. No production call site exists yet.
 */

import { authenticateBrokerToken, hasScope } from '../broker/capability-tokens.js';

/** Scope a BROKER_AGENT_TOKENS entry needs to be a Themis bridge caller. */
export const THEMIS_BRIDGE_SCOPE = 'themis-bridge';

export interface ThemisPrincipal {
  readonly operatorId: string;
  readonly orgId: string;
  readonly agentId: string;
}

export type ThemisPrincipalFailure =
  | 'operator-token-missing'
  | 'operator-token-invalid'
  | 'operator-tenant-missing'
  | 'agent-token-invalid'
  | 'agent-scope-missing';

export type ThemisPrincipalResult =
  { ok: true; principal: ThemisPrincipal } | { ok: false; reason: ThemisPrincipalFailure };

const minted = new WeakSet<ThemisPrincipal>();

function nonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Resolve the operator and agent from raw credentials. Both must verify; the
 * tenant is taken from the operator's token, not from the request.
 */
export async function resolveThemisPrincipal(credentials: {
  operatorAccessToken: string | undefined;
  agentBearerToken: string | undefined;
}): Promise<ThemisPrincipalResult> {
  if (!nonEmpty(credentials.operatorAccessToken)) {
    return { ok: false, reason: 'operator-token-missing' };
  }

  // Lazy import: auth.service throws at load when JWT_SECRET is absent, and
  // runtime-auth must stay importable without it.
  const { default: authService } = await import('../services/auth.service.js');
  const decoded = await authService.verifyAccessToken(credentials.operatorAccessToken);
  if (!decoded || !nonEmpty(decoded.userId)) {
    return { ok: false, reason: 'operator-token-invalid' };
  }
  const orgId = nonEmpty(decoded.organizationId)
    ? decoded.organizationId
    : nonEmpty(decoded.orgId)
      ? decoded.orgId
      : null;
  if (!orgId) return { ok: false, reason: 'operator-tenant-missing' };

  const agent = authenticateBrokerToken(credentials.agentBearerToken);
  if (!agent) return { ok: false, reason: 'agent-token-invalid' };
  if (!hasScope(agent, THEMIS_BRIDGE_SCOPE)) return { ok: false, reason: 'agent-scope-missing' };

  const principal: ThemisPrincipal = Object.freeze({
    operatorId: decoded.userId,
    orgId,
    agentId: agent.agentId,
  });
  minted.add(principal);
  return { ok: true, principal };
}

/** True only for the exact object returned by resolveThemisPrincipal(). */
export function isVerifiedThemisPrincipal(value: unknown): value is ThemisPrincipal {
  return typeof value === 'object' && value !== null && minted.has(value as ThemisPrincipal);
}
