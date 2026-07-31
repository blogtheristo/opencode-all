/**
 * Loop State File — Disk-based persistence for Loop Engineering
 *
 * Why disk, not Supabase:
 *   The model forgets everything between runs. A file on disk holds what is done
 *   and what is still open. Each run reads it and writes back, letting a loop
 *   pick up again after days — or after a session crash.
 *
 * Format: YAML front-matter block + human-readable MD sections.
 * The YAML block is the machine-readable source of truth; the MD sections
 * are for human review of the running loop.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import logger from '../../utils/logger.js';
import type { LoopStateFile, LoopCycleRecord, CheckerFinding, LoopStatus } from './types.js';

const EURO_PER_TOKEN_IN = 0.000003; // ~$3/MTok input (Sonnet-class)
const EURO_PER_TOKEN_OUT = 0.000015; // ~$15/MTok output

export function estimateCostEur(tokensIn: number, tokensOut: number): number {
  return tokensIn * EURO_PER_TOKEN_IN + tokensOut * EURO_PER_TOKEN_OUT;
}

/** Serialize state to an MD file with YAML front-matter. */
function serialize(state: LoopStateFile): string {
  const cost = estimateCostEur(state.totalTokensIn, state.totalTokensOut);
  const openCount = state.openFindings.length;
  const cycleCount = state.cycles.length;

  const frontMatter = [
    '---',
    `id: ${state.id}`,
    `status: ${state.status}`,
    `goal: "${state.goal.replace(/"/g, "'")}"`,
    `exitCondition: "${state.exitCondition.replace(/"/g, "'")}"`,
    `maxCycles: ${state.maxCycles}`,
    `maxIterationsPerCycle: ${state.maxIterationsPerCycle}`,
    `budgetEurCap: ${state.budgetEurCap}`,
    `budgetTokensInCap: ${state.budgetTokensInCap}`,
    `budgetTokensOutCap: ${state.budgetTokensOutCap}`,
    `verificationBar: ${state.verificationBar}`,
    `cyclesRun: ${cycleCount}`,
    `openFindings: ${openCount}`,
    `totalTokensIn: ${state.totalTokensIn}`,
    `totalTokensOut: ${state.totalTokensOut}`,
    `estimatedCostEur: ${cost.toFixed(4)}`,
    `startedAt: ${state.startedAt}`,
    `updatedAt: ${state.updatedAt}`,
    ...(state.errorMessage ? [`errorMessage: "${state.errorMessage.replace(/"/g, "'")}"`] : []),
    '---',
  ].join('\n');

  const cyclesMd = state.cycles.map((c) => {
    const checkerSection = c.checkerResult
      ? [
          `\n**Checker verdict:** ${c.checkerResult.verdict}`,
          `**Checker summary:** ${c.checkerResult.summary}`,
          c.checkerResult.findings.length > 0
            ? `\n**Findings (${c.checkerResult.findings.length}):**\n${c.checkerResult.findings.map((f) => `- [${f.severity}] ${f.description}`).join('\n')}`
            : '**Findings:** none',
        ].join('\n')
      : '\n*Checker not yet run.*';

    return [
      `\n### Cycle ${c.cycle} — ${c.startedAt}`,
      `**Instruction:** ${c.makerInstruction}`,
      `**Maker output (${c.makerTokensIn + c.makerTokensOut} tokens):**`,
      '```',
      c.makerOutput.slice(0, 2000),
      c.makerOutput.length > 2000 ? `... [truncated ${c.makerOutput.length - 2000} chars]` : '',
      '```',
      checkerSection,
      c.exitReason ? `\n**Exit:** ${c.exitReason}` : '',
    ].join('\n');
  });

  const findingsMd =
    openCount > 0
      ? state.openFindings
          .map(
            (f) =>
              `- **[${f.severity}]** ${f.description}\n  *Fix:* ${f.fixInstruction}${f.location ? `\n  *Location:* ${f.location}` : ''}`,
          )
          .join('\n')
      : '_No open findings._';

  return [
    frontMatter,
    '',
    `# Loop Engineering State: ${state.id}`,
    '',
    `**Goal:** ${state.goal}`,
    `**Exit condition:** ${state.exitCondition}`,
    `**Status:** \`${state.status}\``,
    `**Progress:** ${cycleCount}/${state.maxCycles} cycles | ${openCount} open findings`,
    `**Cost:** EUR ${cost.toFixed(4)} / ${state.budgetEurCap} cap`,
    '',
    '## Open Findings',
    '',
    findingsMd,
    '',
    '## Cycle History',
    '',
    ...cyclesMd,
    '',
    `<!-- machine-readable state below (base64-encoded JSON — safe for arbitrary Maker output, including '-->') -->`,
    `<!--JSON-B64:${Buffer.from(JSON.stringify(state), 'utf-8').toString('base64')}-->`,
  ].join('\n');
}

/**
 * Extract the state blob embedded in the MD file.
 *
 * The blob is base64-encoded JSON. Base64's alphabet ([A-Za-z0-9+/=]) cannot
 * contain '-->', so the closing delimiter is unambiguous even when a cycle's
 * Maker output contains HTML/JSX/C-style comment tokens.
 */
function deserialize(content: string): LoopStateFile | null {
  const match = content.match(/<!--JSON-B64:([A-Za-z0-9+/=]+)-->/);
  if (!match) return null;
  try {
    const json = Buffer.from(match[1], 'base64').toString('utf-8');
    return JSON.parse(json) as LoopStateFile;
  } catch {
    return null;
  }
}

// ============ PUBLIC API ============

export function createInitialState(config: {
  id: string;
  goal: string;
  exitCondition: string;
  maxCycles: number;
  maxIterationsPerCycle: number;
  budgetEurCap: number;
  budgetTokensInCap: number;
  budgetTokensOutCap: number;
  verificationBar: 'major' | 'all';
}): LoopStateFile {
  const now = new Date().toISOString();
  return {
    ...config,
    status: 'pending',
    cycles: [],
    openFindings: [],
    totalTokensIn: 0,
    totalTokensOut: 0,
    startedAt: now,
    updatedAt: now,
  };
}

export function readState(filePath: string): LoopStateFile | null {
  if (!existsSync(filePath)) return null;
  try {
    const content = readFileSync(filePath, 'utf-8');
    return deserialize(content);
  } catch (err) {
    logger.warn('Failed to read loop state', { filePath, error: String(err) });
    return null;
  }
}

export function writeState(filePath: string, state: LoopStateFile): void {
  try {
    mkdirSync(dirname(filePath), { recursive: true });
    state.updatedAt = new Date().toISOString();
    writeFileSync(filePath, serialize(state), 'utf-8');
    logger.debug('Loop state written', {
      filePath,
      status: state.status,
      cycles: state.cycles.length,
    });
  } catch (err) {
    logger.error('Failed to write loop state', { filePath, error: String(err) });
    throw err;
  }
}

export function appendCycle(state: LoopStateFile, cycle: LoopCycleRecord): void {
  state.cycles.push(cycle);
  state.totalTokensIn += cycle.makerTokensIn + (cycle.checkerResult?.tokensIn ?? 0);
  state.totalTokensOut += cycle.makerTokensOut + (cycle.checkerResult?.tokensOut ?? 0);
  state.updatedAt = new Date().toISOString();
}

export function updateOpenFindings(state: LoopStateFile, findings: CheckerFinding[]): void {
  state.openFindings = findings;
  state.updatedAt = new Date().toISOString();
}

export function setStatus(state: LoopStateFile, status: LoopStatus, errorMessage?: string): void {
  state.status = status;
  if (errorMessage) state.errorMessage = errorMessage;
  state.updatedAt = new Date().toISOString();
}
