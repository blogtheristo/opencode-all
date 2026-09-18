/**
 * Safe Shell-Command Execution Wrapper
 *
 * Closes the "Shell commands" gap flagged in the 2026-09-17 agent
 * infrastructure audit (docs/field-notes/2026-09-17-agent-infra-audit.md):
 * shell access existed only as PreToolUse hook guardrails
 * (.claude/hooks/pretooluse-guard.sh, sql-safety-guard.sh) with no
 * dedicated in-process abstraction agents could call directly.
 *
 * Design:
 *   1. Argument-vector execution only (child_process.execFile, shell: false).
 *      No string is ever interpolated into a shell — command injection via
 *      `;`, `&&`, backticks, `$()`, or pipes is structurally impossible.
 *   2. Binary allowlist. Only commands registered in COMMAND_POLICIES may
 *      run; everything else is rejected before spawning a process.
 *   3. Routed through the existing runtime-auth gate (src/security/runtime-auth.ts)
 *      so every call is classified READ/WRITE/IRREVERSIBLE and audited the
 *      same way as database/file/email tool calls. Mutating commands require
 *      approval; read-only commands run autonomously within envelope.
 *   4. Hard bounds: timeout, output size cap, no shell metacharacters in
 *      any argument (defense in depth even though execFile doesn't need it).
 */

import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  type AuthorizationContext,
  authorizeToolCall,
  getToolPolicy,
  registerToolPolicy,
} from './runtime-auth.js';
import type { ToolCall } from '../agents/types.js';

// ─── Command policy ────────────────────────────────────────────────────────

type ShellActionClass = 'READ' | 'WRITE';

interface CommandPolicy {
  actionClass: ShellActionClass;
  /** Subcommands/flags allowed for this binary; omit to allow any args (still arg-vector, still no shell). */
  allowedSubcommands?: string[];
}

const COMMAND_POLICIES: Record<string, CommandPolicy> = {
  git: {
    actionClass: 'WRITE',
    allowedSubcommands: ['status', 'log', 'diff', 'show', 'branch', 'rev-parse'],
  },
  ls: { actionClass: 'READ' },
  cat: { actionClass: 'READ' },
  node: { actionClass: 'READ', allowedSubcommands: ['--version'] },
  npm: { actionClass: 'READ', allowedSubcommands: ['--version', 'ls', 'test'] },
  echo: { actionClass: 'READ' },
  pwd: { actionClass: 'READ' },
  df: { actionClass: 'READ' },
  wc: { actionClass: 'READ' },
};

// Tool names registered with runtime-auth per action class. Kept distinct
// from the pre-existing `system_command` policy, which stays IRREVERSIBLE
// for anything outside this allowlist. Registered lazily (not at module
// import time) so the policies survive runtime-auth's test-only
// `_resetPoliciesForTests()`, which clears back to builtins only.
function ensurePoliciesRegistered(): void {
  if (!getToolPolicy('shell_exec_read')) {
    registerToolPolicy('shell_exec_read', {
      actionClass: 'READ',
      rationale: 'allowlisted read-only shell command',
    });
  }
  if (!getToolPolicy('shell_exec_write')) {
    registerToolPolicy('shell_exec_write', {
      actionClass: 'WRITE',
      rationale: 'allowlisted mutating shell command',
    });
  }
}

// ─── Argument safety ────────────────────────────────────────────────────────

/** Characters that have no business in an argv element for an allowlisted command. */
const SHELL_METACHARACTERS = /[;&|`$()<>\n\r]/;

function assertSafeArgs(args: string[]): void {
  for (const arg of args) {
    if (typeof arg !== 'string') {
      throw new SafeShellError(`argument is not a string: ${String(arg)}`);
    }
    if (SHELL_METACHARACTERS.test(arg)) {
      throw new SafeShellError(
        `argument contains disallowed shell metacharacter: ${JSON.stringify(arg)}`,
      );
    }
  }
}

export class SafeShellError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SafeShellError';
  }
}

// ─── Logging (mirrors AgentLogger's disk-log shape for cross-correlation) ──

const LOG_DIR = process.env.AGENT_LOG_DIR ?? path.join(process.cwd(), 'logs');

function writeShellLog(entry: Record<string, unknown>): void {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const filePath = path.join(LOG_DIR, `shell-exec-${date}.jsonl`);
    fs.appendFileSync(filePath, JSON.stringify(entry) + '\n');
  } catch {
    // Never crash a caller because of logging failure
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

export interface SafeShellOptions {
  cwd?: string;
  timeoutMs?: number;
  /** Max combined stdout+stderr bytes before the process is killed. */
  maxOutputBytes?: number;
}

export interface SafeShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_OUTPUT_BYTES = 1_000_000;

/**
 * Run an allowlisted command through execFile (no shell). Requests
 * authorization from runtime-auth before spawning; a `require_approval` or
 * `deny` decision aborts the call and returns that decision instead of
 * running anything.
 */
export async function safeExec(
  command: string,
  args: string[],
  context: AuthorizationContext,
  options: SafeShellOptions = {},
): Promise<SafeShellResult> {
  const policy = COMMAND_POLICIES[command];
  if (!policy) {
    throw new SafeShellError(`command not in allowlist: ${command}`);
  }
  if (
    policy.allowedSubcommands &&
    args.length > 0 &&
    !policy.allowedSubcommands.includes(args[0])
  ) {
    throw new SafeShellError(`subcommand not allowed for ${command}: ${args[0]}`);
  }
  assertSafeArgs(args);

  const toolName = policy.actionClass === 'READ' ? 'shell_exec_read' : 'shell_exec_write';
  const call: ToolCall = {
    id: `shell_${Date.now()}`,
    name: toolName,
    arguments: { command, args },
  };
  ensurePoliciesRegistered();
  const authResult = authorizeToolCall(call, context);

  writeShellLog({
    event: 'authorize',
    command,
    args,
    decision: authResult.decision,
    reason: authResult.reason,
    agentName: context.agentName,
    sessionId: context.sessionId,
    timestamp: new Date().toISOString(),
  });

  if (authResult.decision !== 'allow') {
    throw new SafeShellError(
      `shell command not authorized (${authResult.decision}): ${authResult.reason}`,
    );
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxOutputBytes = options.maxOutputBytes ?? DEFAULT_MAX_OUTPUT_BYTES;
  const startedAt = Date.now();

  return new Promise<SafeShellResult>((resolve, reject) => {
    execFile(
      command,
      args,
      { cwd: options.cwd, timeout: timeoutMs, maxBuffer: maxOutputBytes, shell: false },
      (error, stdout, stderr) => {
        const latencyMs = Date.now() - startedAt;
        const exitCode =
          error && typeof (error as NodeJS.ErrnoException & { code?: number }).code === 'number'
            ? (error as unknown as { code: number }).code
            : error
              ? 1
              : 0;

        writeShellLog({
          event: 'result',
          command,
          args,
          exitCode,
          latencyMs,
          timedOut: Boolean(error && (error as unknown as { killed?: boolean }).killed),
          agentName: context.agentName,
          sessionId: context.sessionId,
          timestamp: new Date().toISOString(),
        });

        if (error && !('code' in error)) {
          // execFile-level failure (spawn error, timeout kill) rather than a
          // nonzero exit from the child — surface as rejection.
          reject(new SafeShellError(`shell command failed: ${error.message}`));
          return;
        }

        resolve({ stdout, stderr, exitCode: typeof exitCode === 'number' ? exitCode : 1 });
      },
    );
  });
}

/** Exposed for tests and for callers that need to know what's allowlisted. */
export function isCommandAllowed(command: string): boolean {
  return command in COMMAND_POLICIES;
}
