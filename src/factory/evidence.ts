/**
 * Trajectory recovery: turn an agent request body into typed execution evidence.
 *
 * Agent harnesses resend the whole conversation every turn, so the request body IS the
 * agent's execution history: the function calls it made, the outputs it got back, and
 * the assistant text between them. Both wire shapes DWS agents use are supported —
 * OpenAI Responses `input` arrays and Anthropic Messages `messages` arrays.
 *
 * Raw model reasoning never becomes evidence on its own. It is reduced to counts,
 * classes, digests, and bounded previews so decisions rest on what the agent DID.
 *
 * Adapted from codejunkie99/sageroute (MIT): src/core/evidence.ts + the inbound
 * Anthropic adapter, folded together and kept fully offline.
 */

import { createHash } from 'node:crypto';

export interface TrajectoryStep {
  /** 1-based position in the recovered action sequence. */
  index: number;
  tool: string;
  argsDigest: string;
  argsPreview: string;
  outputDigest: string;
  outputPreview: string;
  ok: boolean;
  errorClass: string;
}

export interface Trajectory {
  steps: TrajectoryStep[];
  /** Assistant turns with no tool call: the agent talked instead of acting. */
  noToolTurns: number;
  /** Total assistant message items seen. */
  assistantTurns: number;
  /** First user message, trimmed — the task statement. */
  goal: string;
  /** Tool calls still awaiting an output item (the call being answered right now). */
  pendingCalls: number;
}

const PREVIEW_MAX = 220;
const GOAL_MAX = 600;

export function digest(text: string, length = 12): string {
  return createHash('sha256').update(text).digest('hex').slice(0, length);
}

/**
 * Bucket an observation into a coarse, comparable error class. Comparability is the
 * whole point: "the same error class three times in a row" is the signal, and that
 * requires collapsing line numbers and paths out of the message.
 */
export function classifyError(text: string): string {
  const lowered = text.toLowerCase();
  const table: Array<[string, string]> = [
    ['modulenotfounderror', 'ModuleNotFoundError'],
    ['importerror', 'ImportError'],
    ['syntaxerror', 'SyntaxError'],
    ['indentationerror', 'IndentationError'],
    ['nameerror', 'NameError'],
    ['typeerror', 'TypeError'],
    ['valueerror', 'ValueError'],
    ['attributeerror', 'AttributeError'],
    ['keyerror', 'KeyError'],
    ['indexerror', 'IndexError'],
    ['zerodivisionerror', 'ZeroDivisionError'],
    ['assertionerror', 'AssertionError'],
    ['segmentation fault', 'SegFault'],
    ['no such file', 'FileNotFound'],
    ['cannot find module', 'ModuleNotFoundError'],
    ['command not found', 'CommandNotFound'],
    ['permission denied', 'PermissionDenied'],
    ['timed out', 'Timeout'],
    ['traceback (most recent call last)', 'PythonTraceback'],
    ['exit code 1', 'NonZeroExit'],
    ['test failed', 'TestFailure'],
    ['tests failed', 'TestFailure'],
    ['failing', 'TestFailure'],
    ['failed', 'GenericFailure'],
    ['error', 'GenericError'],
  ];
  for (const [needle, label] of table) {
    if (lowered.includes(needle)) return label;
  }
  return 'Unknown';
}

/**
 * Decide whether a tool result represents a failure. Tool transports rarely set a
 * structured error flag, so the observation text is the only honest source. Anchored on
 * failure vocabulary that survives across shells, test runners, and linters.
 */
export function looksLikeFailure(text: string): boolean {
  const lowered = text.toLowerCase();
  if (!lowered.trim()) return false;
  const negative = [
    'traceback (most recent call last)',
    'error:',
    'error ',
    'exception',
    'failed',
    'failing',
    'no such file',
    'command not found',
    'permission denied',
    'timed out',
    'exit code 1',
    'exit code 2',
    'assertionerror',
    'syntaxerror',
    'cannot find module',
  ];
  return negative.some((needle) => lowered.includes(needle));
}

function isObj(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Flatten the several shapes a tool output can take into plain text. */
export function outputText(output: unknown): string {
  if (typeof output === 'string') return output;
  if (Array.isArray(output)) {
    const parts: string[] = [];
    for (const raw of output) {
      if (typeof raw === 'string') {
        parts.push(raw);
      } else if (isObj(raw)) {
        const text = raw.text ?? raw.output ?? raw.refusal ?? raw.content;
        if (typeof text === 'string') parts.push(text);
      }
    }
    return parts.join('\n');
  }
  if (isObj(output)) {
    const content = output.content ?? output.output ?? output.text;
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return outputText(content);
  }
  return '';
}

function messageText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  const parts: string[] = [];
  for (const raw of content) {
    if (typeof raw === 'string') parts.push(raw);
    else if (isObj(raw) && typeof raw.text === 'string') parts.push(raw.text);
  }
  return parts.join('\n');
}

/**
 * Remove Claude Code's `<system-reminder>` context injections from message text.
 * Merged into the first user message they would become the recovered goal, and routing
 * a session on CLAUDE.md boilerplate instead of the user's actual request degrades
 * every verdict. Only fully delimited spans are removed.
 */
export function stripSystemReminders(text: string): string {
  if (!text.includes('<system-reminder>')) return text;
  return text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '').trim();
}

/** Explicit success/failure flag when the client bothered to send one. */
function declaredSuccess(output: unknown): boolean | undefined {
  if (isObj(output) && typeof output.success === 'boolean') return output.success;
  if (isObj(output) && typeof output.is_error === 'boolean') return !output.is_error;
  return undefined;
}

function emptyTrajectory(): Trajectory {
  return { steps: [], noToolTurns: 0, assistantTurns: 0, goal: '', pendingCalls: 0 };
}

interface OrderedEntry {
  callId: string;
  step: TrajectoryStep;
}

function newStep(ordered: OrderedEntry[], tool: string, args: string): TrajectoryStep {
  return {
    index: ordered.length + 1,
    tool,
    argsDigest: digest(`${tool}|${args}`),
    argsPreview: args.replace(/\s+/g, ' ').slice(0, PREVIEW_MAX),
    outputDigest: '',
    outputPreview: '',
    ok: true,
    errorClass: '',
  };
}

function answerStep(ordered: OrderedEntry[], callId: string, output: unknown): void {
  const text = outputText(output);
  const declared = declaredSuccess(output);
  const ok = declared ?? !looksLikeFailure(text);
  const match = ordered.find((entry) => entry.callId === callId && !entry.step.outputDigest);
  if (!match) return;
  match.step.outputDigest = digest(text) || digest('');
  match.step.outputPreview = text.replace(/\s+/g, ' ').slice(0, PREVIEW_MAX);
  match.step.ok = ok;
  match.step.errorClass = ok ? '' : classifyError(text);
}

function finalize(trajectory: Trajectory, ordered: OrderedEntry[]): Trajectory {
  trajectory.steps = ordered.map((entry) => entry.step);
  trajectory.pendingCalls = trajectory.steps.filter((step) => !step.outputDigest).length;
  // An assistant turn that produced no tool call is the agent narrating instead of
  // acting: total assistant messages minus the ones that carried at least one call.
  trajectory.noToolTurns = Math.max(0, trajectory.assistantTurns - trajectory.steps.length);
  return trajectory;
}

/**
 * Recover the action sequence from an OpenAI Responses `input` array by pairing each
 * `function_call` with the `function_call_output` that answers it.
 */
export function extractTrajectory(input: unknown): Trajectory {
  const trajectory = emptyTrajectory();
  if (typeof input === 'string') {
    trajectory.goal = input.slice(0, GOAL_MAX);
    return trajectory;
  }
  if (!Array.isArray(input)) return trajectory;

  const ordered: OrderedEntry[] = [];

  for (const raw of input) {
    if (!isObj(raw)) continue;
    const type = typeof raw.type === 'string' ? raw.type : undefined;
    const role = typeof raw.role === 'string' ? raw.role : undefined;

    if (!trajectory.goal && (role === 'user' || (type === 'message' && role === 'user'))) {
      const text = stripSystemReminders(messageText(raw.content)).trim();
      if (text) trajectory.goal = text.slice(0, GOAL_MAX);
      continue;
    }

    if (role === 'assistant') {
      trajectory.assistantTurns += 1;
      continue;
    }

    if (type === 'function_call' || type === 'custom_tool_call') {
      const callId = typeof raw.call_id === 'string' ? raw.call_id : '';
      const tool = typeof raw.name === 'string' ? raw.name : 'unknown';
      const args =
        typeof raw.arguments === 'string'
          ? raw.arguments
          : typeof raw.input === 'string'
            ? raw.input
            : '';
      ordered.push({ callId, step: newStep(ordered, tool, args) });
      continue;
    }

    if (type === 'function_call_output' || type === 'custom_tool_call_output') {
      const callId = typeof raw.call_id === 'string' ? raw.call_id : '';
      answerStep(ordered, callId, raw.output);
    }
  }

  return finalize(trajectory, ordered);
}

/**
 * Recover the action sequence from an Anthropic Messages `messages` array by pairing
 * each assistant `tool_use` block with the user `tool_result` block that answers it.
 */
export function extractTrajectoryFromMessages(messages: unknown): Trajectory {
  const trajectory = emptyTrajectory();
  if (!Array.isArray(messages)) return trajectory;

  const ordered: OrderedEntry[] = [];

  for (const raw of messages) {
    if (!isObj(raw)) continue;
    const role = typeof raw.role === 'string' ? raw.role : '';
    const content = raw.content;

    if (role === 'assistant') {
      trajectory.assistantTurns += 1;
      if (!Array.isArray(content)) continue;
      for (const block of content) {
        if (!isObj(block) || block.type !== 'tool_use') continue;
        const callId = typeof block.id === 'string' ? block.id : '';
        const tool = typeof block.name === 'string' ? block.name : 'unknown';
        const args = JSON.stringify(isObj(block.input) ? block.input : {});
        ordered.push({ callId, step: newStep(ordered, tool, args) });
      }
      continue;
    }

    if (role !== 'user') continue;

    if (typeof content === 'string') {
      if (!trajectory.goal) {
        const text = stripSystemReminders(content).trim();
        if (text) trajectory.goal = text.slice(0, GOAL_MAX);
      }
      continue;
    }
    if (!Array.isArray(content)) continue;

    let sawToolResult = false;
    for (const block of content) {
      if (!isObj(block)) continue;
      if (block.type === 'tool_result') {
        sawToolResult = true;
        const callId = typeof block.tool_use_id === 'string' ? block.tool_use_id : '';
        // Anthropic carries the error flag on the block itself, not inside the output.
        const output =
          typeof block.is_error === 'boolean'
            ? { content: block.content, is_error: block.is_error }
            : block.content;
        answerStep(ordered, callId, output);
      }
    }

    if (!trajectory.goal && !sawToolResult) {
      const text = stripSystemReminders(messageText(content)).trim();
      if (text) trajectory.goal = text.slice(0, GOAL_MAX);
    }
  }

  return finalize(trajectory, ordered);
}

/**
 * Accept either wire shape: `{ messages: [...] }` (Anthropic) or `{ input: [...] }`
 * (OpenAI Responses). The extractor pair is the only place the wire matters; every
 * later stage reasons over the same Trajectory.
 */
export function extractTrajectoryFromBody(body: Record<string, unknown>): Trajectory {
  if (Array.isArray(body.messages)) return extractTrajectoryFromMessages(body.messages);
  return extractTrajectory(body.input);
}
