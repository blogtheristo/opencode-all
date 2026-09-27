// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=pr-2125-review Date=2026-09-27
// Audit trail: git log -- src/agents/browse-step-kya-jev.ts
import type { AgentRuntimeContext } from './types.js';
import type { LLMClient } from './llm-client.js';
import { makeTypedDecision, type TypedDecisionResult } from './kya-jev.js';

export interface BrowseSnapshotNode {
  role: string;
  name: string;
  level?: number;
}

export interface BrowseStepRequest {
  goal: string;
  /** Nodes from `dws browse snapshot --json` (`nodes` field). */
  nodes: BrowseSnapshotNode[];
  /** Short descriptions of actions already taken, oldest first. */
  history?: string[];
}

export type BrowseStepAction =
  | { type: 'act'; node: BrowseSnapshotNode; needsText: boolean }
  | { type: 'done' }
  | { type: 'stuck' };

export interface BrowseStepResult {
  action: BrowseStepAction;
  result: TypedDecisionResult;
  actionable: false;
}

const ACTIONABLE_ROLES = new Set([
  'button',
  'link',
  'textbox',
  'searchbox',
  'combobox',
  'checkbox',
  'radio',
  'option',
  'menuitem',
  'tab',
  'switch',
]);
const TEXT_ROLES = new Set(['textbox', 'searchbox', 'combobox']);
export const MAX_CANDIDATES = 40;
export const MAX_HISTORY = 20;

/**
 * Jev-style "system one" step picker: the decision layer chooses which node to
 * act on; typing the text for a text field is left to the caller's LLM.
 * Advisory only while kya-jev confidence is uncalibrated.
 */
export async function adviseBrowseStep(
  client: LLMClient,
  req: BrowseStepRequest,
  runtime: AgentRuntimeContext | undefined,
): Promise<BrowseStepResult> {
  const candidates = req.nodes
    .filter(
      (n) =>
        typeof n.role === 'string' &&
        typeof n.name === 'string' &&
        ACTIONABLE_ROLES.has(n.role) &&
        n.name.trim() !== '',
    )
    .slice(0, MAX_CANDIDATES);
  const options = [...candidates.map((_, i) => `n${i}`), 'done', 'stuck'];

  const state = JSON.stringify({
    goal: req.goal,
    history: (req.history ?? [])
      .filter((entry): entry is string => typeof entry === 'string')
      .slice(-MAX_HISTORY),
    candidates: candidates.map((n, i) => ({ id: `n${i}`, role: n.role, name: n.name })),
  });

  const result = await makeTypedDecision(
    client,
    {
      state,
      question: {
        kind: 'choice',
        prompt:
          'Which candidate should the browser act on next to advance the goal? Pick a candidate id, "done" if the goal is already met, or "stuck" if no candidate helps.',
        options,
      },
    },
    runtime,
  );

  let action: BrowseStepAction;
  if (result.abstained || result.decision === 'stuck') {
    action = { type: 'stuck' };
  } else if (result.decision === 'done') {
    action = { type: 'done' };
  } else {
    const node = candidates[Number(result.decision.slice(1))];
    action = { type: 'act', node, needsText: TEXT_ROLES.has(node.role) };
  }
  return { action, result, actionable: false };
}
