/**
 * Checker Agent — Loop Engineering
 *
 * Grades Maker output. A model grading its own output justifies what it
 * already did instead of catching where it failed — that is why the Checker
 * runs as a separate agent, not as a self-review step inside the Maker.
 *
 * The Checker's findings return to the Maker as the next instruction,
 * and the cycle repeats until the Checker finds nothing left to fix.
 *
 * Verification bar controls how strict the checker is:
 *   'major'  → only chase major/minor findings; ignore nitpicks
 *   'all'    → chase every finding, including nitpicks
 *
 * Lower verification bar = safer unattended loop.
 */

import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import type { CheckerFinding, CheckerResult, FindingSeverity } from './types.js';
import logger from '../../utils/logger.js';

interface CheckerInput {
  goal: string;
  exitCondition: string;
  makerOutput: string;
  openFindings: CheckerFinding[];
  cycleNumber: number;
  verificationBar: 'major' | 'all';
}

export class CheckerAgent extends BaseAgent {
  constructor(systemPromptOverride?: string) {
    super({
      name: 'loop-checker',
      description:
        'Grades Maker output against the loop exit condition. Returns structured findings that feed back to the Maker as the next instruction.',
      capabilities: ['code-review', 'output-grading', 'finding-extraction'],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'standard',
      loop: { maxIterations: 3, allowDelegation: false, logIterations: false },
    });

    if (systemPromptOverride) {
      this.soulPrompt = systemPromptOverride;
    } else {
      this.soulPrompt = DEFAULT_CHECKER_SOUL;
    }
  }

  async execute(_context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const { goal, exitCondition, makerOutput, openFindings, cycleNumber, verificationBar } =
      input as unknown as CheckerInput;

    const prompt = buildCheckerPrompt({
      goal,
      exitCondition,
      makerOutput,
      openFindings,
      cycleNumber,
      verificationBar,
    });

    const { content, model, inputTokens, outputTokens } = await this.callLLM(prompt);

    let checkerResult: CheckerResult;
    try {
      checkerResult = parseCheckerResponse(content, model, inputTokens, outputTokens);
    } catch (err) {
      logger.warn('Checker response parse failed — treating as REPLAN', {
        error: String(err),
        raw: content.slice(0, 300),
      });
      checkerResult = {
        verdict: 'REPLAN',
        findings: [
          {
            id: 'parse-error',
            severity: 'major',
            description: 'Checker could not parse its own response',
            fixInstruction: 'Retry the task and ensure output matches the expected format.',
          },
        ],
        summary: 'Parse error — checker response was not valid JSON',
        tokensIn: inputTokens,
        tokensOut: outputTokens,
        model,
      };
    }

    // Apply verification bar: filter out nitpicks if bar is 'major'
    if (verificationBar === 'major') {
      checkerResult.findings = checkerResult.findings.filter(
        (f) => f.severity === 'major' || f.severity === 'minor',
      );
      if (checkerResult.findings.length === 0 && checkerResult.verdict === 'FAIL') {
        checkerResult.verdict = 'PASS';
        checkerResult.summary += ' (nitpick-only findings cleared by verification bar)';
      }
    }

    return {
      agentName: this.getConfig().name,
      result: checkerResult as unknown as Record<string, unknown>,
      confidence: checkerResult.verdict === 'PASS' ? 1.0 : 0.7,
      reasoning: checkerResult.summary,
      recommendations: checkerResult.findings.map((f) => f.fixInstruction),
      metadata: {
        cycle: cycleNumber,
        verdict: checkerResult.verdict,
        findingCount: checkerResult.findings.length,
        tokensIn: inputTokens,
        tokensOut: outputTokens,
        model,
      },
    };
  }
}

// ============ HELPERS ============

function buildCheckerPrompt(input: CheckerInput): string {
  const prevFindings =
    input.openFindings.length > 0
      ? `\n## Previously Open Findings (check if resolved)\n${input.openFindings.map((f, i) => `${i + 1}. [${f.severity}] ${f.description}\n   Fix applied: (check maker output above)`).join('\n')}`
      : '';

  return `You are a Checker agent in a Maker/Checker loop (cycle ${input.cycleNumber}).

## Goal
${input.goal}

## Exit Condition (when this is true, return PASS)
${input.exitCondition}

## Maker Output to Grade
\`\`\`
${input.makerOutput.slice(0, 8000)}${input.makerOutput.length > 8000 ? '\n... [truncated]' : ''}
\`\`\`
${prevFindings}

## Your Task
Grade the Maker's output against the exit condition.
Return a JSON object with this exact shape:

{
  "verdict": "PASS" | "FAIL" | "REPLAN",
  "summary": "one-sentence summary of your grade",
  "findings": [
    {
      "id": "unique-slug",
      "severity": "major" | "minor" | "nitpick",
      "description": "what is wrong",
      "fixInstruction": "specific instruction for the Maker to fix this",
      "location": "optional file:line reference"
    }
  ]
}

Verdict rules:
- PASS: exit condition is met, no major/minor findings
- FAIL: exit condition not met or there are major/minor findings to fix
- REPLAN: the task as framed cannot be completed (missing info, wrong approach)

Be specific. "Fix instruction" must be actionable, not "improve the code".
Return ONLY the JSON object, no prose.`;
}

function parseCheckerResponse(
  raw: string,
  model: string,
  tokensIn: number,
  tokensOut: number,
): CheckerResult {
  // Strip markdown code fences if present
  const cleaned = raw
    .replace(/^```(?:json)?\n?/m, '')
    .replace(/\n?```$/m, '')
    .trim();
  const parsed = JSON.parse(cleaned);

  if (!['PASS', 'FAIL', 'REPLAN'].includes(parsed.verdict)) {
    throw new Error(`Invalid verdict: ${parsed.verdict}`);
  }

  const findings: CheckerFinding[] = (parsed.findings || []).map(
    (f: Record<string, unknown>, i: number) => ({
      id: String(f.id || `finding-${i}`),
      severity: (['major', 'minor', 'nitpick'].includes(String(f.severity))
        ? f.severity
        : 'minor') as FindingSeverity,
      description: String(f.description || ''),
      fixInstruction: String(f.fixInstruction || ''),
      location: f.location ? String(f.location) : undefined,
    }),
  );

  return {
    verdict: parsed.verdict as 'PASS' | 'FAIL' | 'REPLAN',
    findings,
    summary: String(parsed.summary || ''),
    tokensIn,
    tokensOut,
    model,
  };
}

const DEFAULT_CHECKER_SOUL = `You are a rigorous Checker agent in a Maker/Checker engineering loop.
Your only job is to grade the Maker's output against the stated exit condition.
You do NOT produce work yourself. You find what is still wrong and give the Maker
specific, actionable instructions to fix it.
A model grading its own output will justify what it already did.
You exist to prevent that. Be objective, be specific, be fair.
Return only the JSON object — no prose, no markdown fences outside the JSON.`;
