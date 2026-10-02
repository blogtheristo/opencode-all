/**
 * Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19
 * Advisory kya-jev consumer for the DWS dictionary. Never writes terms or prices.
 * Audit trail: git log -- src/agents/dictionary-kya-jev.ts
 */
import type { AgentRuntimeContext } from './types.js';
import type { LLMClient } from './llm-client.js';
import { type KyaJevAuditRecord, makeTypedDecision, type TypedDecisionResult } from './kya-jev.js';

export type DictionaryAdvisoryKind = 'sv_display_safe' | 'aegis_scope' | 'wave3_live';

export interface DictionaryAdvisoryRequest {
  kind: DictionaryAdvisoryKind;
  /** JSON-stringified term or industry record under review. */
  state: string;
}

export interface DictionaryAdvisoryResult {
  kind: DictionaryAdvisoryKind;
  result: TypedDecisionResult;
  actionable: false;
}

/**
 * Run one advisory typed question over dictionary state.
 * Requires a signed KYA `allowed` verdict (same gate as seo-audit).
 * Caller must not persist `result.decision` as a glossary lock.
 */
export async function adviseDictionaryTerm(
  client: LLMClient,
  req: DictionaryAdvisoryRequest,
  runtime: AgentRuntimeContext | undefined,
  audit?: (record: KyaJevAuditRecord) => Promise<void>,
): Promise<DictionaryAdvisoryResult> {
  const question =
    req.kind === 'sv_display_safe'
      ? {
          kind: 'boolean' as const,
          prompt:
            'Does any Swedish display string use German Souverän or use spårighet to mean sovereignty? Answer yes only if a banned display form is present.',
        }
      : req.kind === 'aegis_scope'
        ? {
            kind: 'boolean' as const,
            prompt:
              'Would claiming Aegis 21-industry coverage for this industry be a Truth Standard fail (Healthcare, Financial Services, Public Sector sub-segments, Real Estate)?',
          }
        : {
            kind: 'choice' as const,
            prompt:
              'Given harvest density only (do not invent customers), which industry should be the next Wave 3 live page after Construction?',
            options: ['2', '24', 'dictionary-only'],
          };

  const result = await makeTypedDecision(client, { state: req.state, question }, runtime, audit);
  return { kind: req.kind, result, actionable: false };
}
