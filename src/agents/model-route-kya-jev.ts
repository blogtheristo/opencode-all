/**
 * Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19
 * Advisory kya-jev consumer for model routing. Never changes selectModel().
 * Audit trail: git log -- src/agents/model-route-kya-jev.ts
 */
import type { AgentRuntimeContext } from './types.js';
import type { LLMClient } from './llm-client.js';
import { type KyaJevAuditRecord, makeTypedDecision, type TypedDecisionResult } from './kya-jev.js';

export type ModelRouteAdvisoryKind = 'tier_hint';

export interface ModelRouteAdvisoryRequest {
  kind: ModelRouteAdvisoryKind;
  /** JSON of agentName + existing ModelSelection fields. Code already picked the model. */
  state: string;
}

export interface ModelRouteAdvisoryResult {
  kind: ModelRouteAdvisoryKind;
  result: TypedDecisionResult;
  actionable: false;
}

/**
 * Hint whether a human/runtime should keep, escalate, or demote the
 * deterministic `selectModel()` result. Caller must not swap the client from this.
 */
export async function adviseModelRoute(
  client: LLMClient,
  req: ModelRouteAdvisoryRequest,
  runtime: AgentRuntimeContext | undefined,
  audit?: (record: KyaJevAuditRecord) => Promise<void>,
): Promise<ModelRouteAdvisoryResult> {
  const result = await makeTypedDecision(
    client,
    {
      state: req.state,
      question: {
        kind: 'choice',
        prompt:
          'Given the already-selected model (tier, context window, required tokens, local vs cloud), should the runtime keep that pick, escalate one tier heavier, or demote one tier lighter? Do not invent models. stay = keep selectModel(); escalate = hint heavier; demote = hint lighter.',
        options: ['stay', 'escalate', 'demote'],
      },
    },
    runtime,
    audit,
  );
  return { kind: req.kind, result, actionable: false };
}
