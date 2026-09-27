// Evidence: Tool=Claude Code Model=claude-opus-5 Agent=Claude Code Date=2026-09-24
// Audit trail: git log -- src/agents/document-class-kya-jev.ts

import type { AgentRuntimeContext } from './types.js';
import type { LLMClient } from './llm-client.js';
import { makeTypedDecision, type TypedDecisionResult } from './kya-jev.js';
import { classifyDocument, type DocumentClass } from '../services/document-access.js';

/**
 * Advisory kya-jev consumer for Learn/ document classification.
 *
 * Why advisory and not a gate: document access is a compliance action, and
 * KYA_JEV_SPECIFICATION §7 forbids gating a consequential action on kya-jev's
 * self-reported confidence until a calibration study runs against a
 * human-labeled dataset. `calibration` is still 'self-reported-uncalibrated'.
 * A model that guesses 'public' for the cap table would publish the cap table,
 * so the deterministic policy in docs/access/document-access-policy.json stays
 * the only thing that decides. Same shape as seo-audit, whose deployGate
 * remains fully deterministic.
 *
 * What it is actually for: every unclassified document falls through to
 * 'confidential' and is silently withheld. Nobody sees that pile growing. This
 * proposes a class for each one so a human has a review queue instead of a
 * blind spot.
 */

export type DocumentClassAdvisory = {
  path: string;
  /** What the deterministic policy says today — this is what is enforced. */
  enforced: DocumentClass;
  /** Whether the policy matched a rule or fell through to the default-deny. */
  unclassified: boolean;
  /** kya-jev's proposal. Never enforced, never written to the policy by code. */
  result: TypedDecisionResult;
  /** Present so no caller can mistake this for a decision. */
  actionable: false;
};

const CLASS_OPTIONS: DocumentClass[] = ['public', 'user', 'customer', 'internal', 'confidential'];

const PROMPT = [
  'Classify this Lifetime Oy document for access control. Pick exactly one class:',
  '',
  '- public: publishable outside the company (whitepapers, public product material).',
  '- user: end-user material for operating the product (user manual, how-to guides).',
  '- customer: customer-administrator material (customer admin manual, installation, configuration).',
  '- internal: Lifetime Oy staff only (engineering and admin manuals, standards, theses, field notes).',
  '- confidential: founder/board only (cap table, SAFE terms, diligence, board minutes, salary, time and invoicing records, live bid pricing).',
  '',
  'If the document could plausibly be confidential, choose confidential. The cost of',
  'over-restricting is an extra review; the cost of under-restricting is disclosing',
  'financial or personal data.',
].join('\n');

/**
 * Propose a class for one document. `content` should be a bounded excerpt —
 * the caller decides how much, and must not send a confidential document's full
 * body to a provider it would not otherwise be sent to.
 */
export async function adviseDocumentClass(
  client: LLMClient,
  input: { path: string; excerpt: string },
  runtime: AgentRuntimeContext | undefined,
): Promise<DocumentClassAdvisory> {
  const { class: enforced, why } = classifyDocument(input.path);

  const result = await makeTypedDecision(
    client,
    {
      state: [`Path: ${input.path}`, '', 'Excerpt:', input.excerpt].join('\n'),
      question: { kind: 'choice', prompt: PROMPT, options: CLASS_OPTIONS },
    },
    runtime,
  );

  return {
    path: input.path,
    enforced,
    unclassified: why.startsWith('No rule matched'),
    result,
    actionable: false,
  };
}

/**
 * Flags where the proposal and the enforced class disagree, for human review.
 *
 * Direction matters. A proposal that is *more* restrictive than the policy is
 * a possible leak and is worth a look now; one that is *less* restrictive is
 * only a convenience question, and acting on it is what §7 forbids without
 * calibration.
 */
export function reviewPriority(
  advisory: DocumentClassAdvisory,
): 'possible-leak' | 'possible-over-restriction' | 'agrees' {
  if (advisory.result.abstained) return 'agrees';
  const proposed = advisory.result.decision as DocumentClass;
  if (proposed === advisory.enforced) return 'agrees';
  return CLASS_OPTIONS.indexOf(proposed) > CLASS_OPTIONS.indexOf(advisory.enforced)
    ? 'possible-leak'
    : 'possible-over-restriction';
}
