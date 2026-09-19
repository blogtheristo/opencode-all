/**
 * Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19
 * Advisory kya-jev consumer for outreach lead scoring. Never upserts or routes.
 * Audit trail: git log -- src/agents/lead-score-kya-jev.ts
 */
import type { AgentRuntimeContext } from './types.js';
import type { LLMClient } from './llm-client.js';
import { makeTypedDecision, type TypedDecisionResult } from './kya-jev.js';

export type LeadScoreAdvisoryKind = 'callback_priority';

export interface LeadScoreAdvisoryRequest {
  kind: LeadScoreAdvisoryKind;
  /** JSON of one EU_TARGET_UNIVERSE / scored-lead record. Do not invent companies. */
  state: string;
}

export interface LeadScoreAdvisoryResult {
  kind: LeadScoreAdvisoryKind;
  result: TypedDecisionResult;
  actionable: false;
}

/**
 * Typed callback-priority over one already-listed candidate.
 * Does not change fitScore or write outreach_orgs.
 */
export async function adviseLeadScore(
  client: LLMClient,
  req: LeadScoreAdvisoryRequest,
  runtime: AgentRuntimeContext | undefined,
): Promise<LeadScoreAdvisoryResult> {
  const result = await makeTypedDecision(
    client,
    {
      state: req.state,
      question: {
        kind: 'score',
        prompt:
          'Given this existing EU-universe candidate and ICP context only (do not invent companies or intent), how urgently should a human call back? discard = junk/no fit; watch = keep in pile; call = owner should see it now.',
        levels: ['discard', 'watch', 'call'],
      },
    },
    runtime,
  );
  return { kind: req.kind, result, actionable: false };
}
