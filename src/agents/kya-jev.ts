/**
 * kya-jev: KYA-gated typed decision primitive (DWS-native, DGX-sovereign
 * equivalent of TypeSafe AI's Jev "System One" model).
 *
 * Contract: caller supplies state + a typed question (Choice / Score /
 * Boolean, mirroring the three Jev primitives), this returns a typed
 * decision + self-reported probabilities + confidence. Unlike Jev, every
 * call requires an already-issued KYA verdict (AgentRuntimeContext.kya) —
 * there is no path to a decision without passing through the same gate
 * that governs proactive agent actions (`src/security/runtime-auth.ts`).
 *
 * Calibration status: PROVISIONAL. Confidence is the model's own reported
 * probability, not yet validated against a labeled DWS dataset (expected
 * calibration error unmeasured). Do not gate an auto-execute action on this
 * confidence alone until a calibration pass has run — see
 * docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md.
 */

import type { AgentRuntimeContext } from './types.js';
import type { LLMClient } from './llm-client.js';
import logger from '../utils/logger.js';

export type TypedQuestion =
  | { kind: 'choice'; prompt: string; options: string[] }
  | { kind: 'score'; prompt: string; levels: string[] }
  | { kind: 'boolean'; prompt: string };

export interface TypedDecisionRequest {
  /** Application state — free text or a JSON-stringified program state. */
  state: string;
  question: TypedQuestion;
}

export interface TypedDecisionResult {
  /** The chosen option (choice), level (score), or 'yes'/'no' (boolean). */
  decision: string;
  /** Per-option/level probabilities as reported by the model. Empty for boolean (see `probabilityYes`). */
  probabilities: Record<string, number>;
  /** For boolean questions: probability the answer is yes. */
  probabilityYes?: number;
  /** Model's self-reported confidence in `decision`, 0-1. */
  confidence: number;
  /** Always 'self-reported-uncalibrated' until a calibration study lands. */
  calibration: 'self-reported-uncalibrated';
  /** True when the model's raw output failed validation and this is a safe-default abstention. */
  abstained: boolean;
}

const ABSTAIN_CHOICE = '__ABSTAIN__';

/**
 * KYA gate: refuse to make a typed decision unless the caller already holds
 * an 'allowed' KYA verdict for this session. This is what makes it kya-jev
 * rather than a bare structured-output wrapper.
 */
function requireKyaVerdict(runtime: AgentRuntimeContext | undefined): void {
  if (!runtime?.kya || runtime.kya.decision !== 'allowed') {
    throw new Error(
      'kya-jev: no allowed KYA verdict on AgentRuntimeContext — typed decisions require a runtime gate verdict, never an LLM- or user-supplied one',
    );
  }
}

function buildPrompt(req: TypedDecisionRequest): string {
  const { question } = req;
  let schemaHint: string;
  if (question.kind === 'choice') {
    schemaHint = `Respond with ONLY a JSON object: {"decision": <one of ${JSON.stringify(
      question.options,
    )}>, "probabilities": {<each option>: <0-1 number, sums to ~1>}, "confidence": <0-1 number>}`;
  } else if (question.kind === 'score') {
    schemaHint = `Respond with ONLY a JSON object: {"decision": <one of ${JSON.stringify(
      question.levels,
    )}>, "probabilities": {<each level>: <0-1 number, sums to ~1>}, "confidence": <0-1 number>}`;
  } else {
    schemaHint = `Respond with ONLY a JSON object: {"decision": "yes" | "no", "probabilityYes": <0-1 number>, "confidence": <0-1 number>}`;
  }
  return [
    'You are a typed decision function. You never generate prose — only the JSON object described below.',
    `State:\n${req.state}`,
    `Question: ${question.prompt}`,
    schemaHint,
    'Output the JSON object and nothing else.',
  ].join('\n\n');
}

function abstainResult(): TypedDecisionResult {
  return {
    decision: ABSTAIN_CHOICE,
    probabilities: {},
    confidence: 0,
    calibration: 'self-reported-uncalibrated',
    abstained: true,
  };
}

function parseAndValidate(raw: string, question: TypedQuestion): TypedDecisionResult | null {
  let parsed: Record<string, unknown>;
  try {
    // Tolerate a model wrapping JSON in prose/fences despite instructions.
    const match = raw.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(match ? match[0] : raw);
  } catch {
    return null;
  }

  const decision = typeof parsed.decision === 'string' ? parsed.decision : null;
  const confidence =
    typeof parsed.confidence === 'number' && parsed.confidence >= 0 && parsed.confidence <= 1
      ? parsed.confidence
      : null;
  if (decision === null || confidence === null) return null;

  if (question.kind === 'boolean') {
    const normalized = decision.toLowerCase();
    if (normalized !== 'yes' && normalized !== 'no') return null;
    const probabilityYes =
      typeof parsed.probabilityYes === 'number'
        ? parsed.probabilityYes
        : normalized === 'yes'
          ? confidence
          : 1 - confidence;
    return {
      decision: normalized,
      probabilities: {},
      probabilityYes,
      confidence,
      calibration: 'self-reported-uncalibrated',
      abstained: false,
    };
  }

  const allowed = question.kind === 'choice' ? question.options : question.levels;
  if (!allowed.includes(decision)) return null;

  const probabilities =
    parsed.probabilities && typeof parsed.probabilities === 'object'
      ? (parsed.probabilities as Record<string, unknown>)
      : {};
  const numericProbabilities: Record<string, number> = {};
  for (const key of allowed) {
    const v = probabilities[key];
    numericProbabilities[key] = typeof v === 'number' ? v : key === decision ? confidence : 0;
  }

  return {
    decision,
    probabilities: numericProbabilities,
    confidence,
    calibration: 'self-reported-uncalibrated',
    abstained: false,
  };
}

/**
 * Make one typed decision. Requires an already-issued 'allowed' KYA verdict.
 * On unparseable/invalid model output, retries once, then returns a safe
 * abstention (never throws on bad model output — caller decides fallback).
 */
export async function makeTypedDecision(
  client: LLMClient,
  req: TypedDecisionRequest,
  runtime: AgentRuntimeContext | undefined,
): Promise<TypedDecisionResult> {
  requireKyaVerdict(runtime);

  const prompt = buildPrompt(req);
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await client.chat([{ role: 'user', content: prompt }]);
    const result = parseAndValidate(response.content, req.question);
    if (result) return result;
    logger.warn('kya-jev: invalid typed-decision output, retrying', {
      attempt,
      questionKind: req.question.kind,
    });
  }

  logger.warn('kya-jev: exhausted retries, abstaining', { questionKind: req.question.kind });
  return abstainResult();
}
