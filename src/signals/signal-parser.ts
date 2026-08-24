/**
 * Signal Parser — Parse commands for any signal token (Type 2)
 *
 * Code-Version: 1.0
 * Branch: claude/record-contact-response-MFTP7
 * Date: 2026-04-06
 * Owner: claude-code
 *
 * Superset of the outreach reply-parser. Handles commands from:
 * - Email replies (daily digest)
 * - CLI input (dws signal T:XXX status done)
 * - Robot/agent API calls
 * - Control Room → Situation Room signals
 *
 * Examples:
 *   T:YPGW53RPFQ status contacted
 *   T:7HKG4XN8RE ack
 *   T:3MNP6QWVK2 escalate
 *   T:9DFH2XTYA4 note sensor calibration needed
 *   T:4WKS7PNUD3 next 2026-04-10 type delivery
 */

import type { SignalDomain, SignalStatus } from './signal-token.js';
import { resolveStatus } from './signal-token.js';

// ============================================================================
// TYPES
// ============================================================================

export interface SignalCommand {
  token: string;
  action: 'status' | 'next' | 'note' | 'escalate' | 'delegate';
  status?: SignalStatus;
  nextActionDate?: string; // YYYY-MM-DD
  nextActionType?: string;
  nextAction?: string; // free-text
  targetDomain?: SignalDomain; // for escalate/delegate
  raw: string;
}

export interface SignalParseResult {
  command: SignalCommand | null;
  error: string | null;
}

// ============================================================================
// PARSE
// ============================================================================

/**
 * Extract fresh (non-quoted) lines from email text.
 * Works for email replies, chat messages, and CLI input.
 */
function extractFreshLines(text: string): { first: string | null; count: number } {
  const lines = text.split('\n');
  const fresh: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Stop at quoted text markers
    if (trimmed.startsWith('>')) break;
    if (/^on .+ wrote:$/i.test(trimmed)) break;
    if (trimmed.startsWith('---') && trimmed.includes('Original')) break;
    if (trimmed.startsWith('----------')) break;
    if (trimmed === '--') break;
    if (/^sent from my/i.test(trimmed)) break;
    if (/^get outlook/i.test(trimmed)) break;

    if (!trimmed) continue;
    fresh.push(trimmed);
  }

  return { first: fresh.length > 0 ? fresh[0] : null, count: fresh.length };
}

/** Token regex: T: followed by 4-12 alphanumeric chars */
const TOKEN_REGEX = /^T:([A-Z0-9]{4,12})\s+(.+)$/i;

/** Parse a single command line */
function parseLine(line: string): SignalCommand | string {
  const tokenMatch = line.match(TOKEN_REGEX);
  if (!tokenMatch) {
    return `Couldn't parse: "${line}"`;
  }

  const token = tokenMatch[1].toUpperCase();
  const rest = tokenMatch[2].trim();

  // Shorthand: single-word commands
  const shorthand = resolveStatus(rest);
  if (shorthand) {
    return { token, action: 'status', status: shorthand, raw: line };
  }

  // T:XXX escalate [to <domain>]
  const escalateMatch = rest.match(/^escalate(?:\s+to\s+(\S+))?$/i);
  if (escalateMatch) {
    return {
      token,
      action: 'escalate',
      status: 'escalated',
      targetDomain: (escalateMatch[1] as SignalDomain) || undefined,
      raw: line,
    };
  }

  // T:XXX delegate [to <domain>]
  const delegateMatch = rest.match(/^delegate(?:\s+to\s+(\S+))?$/i);
  if (delegateMatch) {
    return {
      token,
      action: 'delegate',
      status: 'delegated',
      targetDomain: (delegateMatch[1] as SignalDomain) || undefined,
      raw: line,
    };
  }

  // T:XXX status <status> [, <notes>]
  const statusMatch = rest.match(/^status\s+(.+)$/i);
  if (statusMatch) {
    const statusRest = statusMatch[1];
    const commaIdx = statusRest.indexOf(',');
    const statusPart = commaIdx >= 0 ? statusRest.substring(0, commaIdx).trim() : statusRest.trim();
    const notesPart = commaIdx >= 0 ? statusRest.substring(commaIdx + 1).trim() : undefined;

    const status = resolveStatus(statusPart);
    if (!status) {
      return `Unknown status "${statusPart}" in: "${line}"`;
    }

    return {
      token,
      action: 'status',
      status,
      nextAction: notesPart || undefined,
      raw: line,
    };
  }

  // T:XXX next <date> [type <type>]
  const nextMatch = rest.match(/^next\s+(\d{4}-\d{2}-\d{2})(?:\s+type\s+(\w+))?$/i);
  if (nextMatch) {
    return {
      token,
      action: 'next',
      nextActionDate: nextMatch[1],
      nextActionType: nextMatch[2] || undefined,
      raw: line,
    };
  }

  // T:XXX note <text>
  const noteMatch = rest.match(/^note\s+(.+)$/i);
  if (noteMatch) {
    return {
      token,
      action: 'note',
      nextAction: noteMatch[1].trim(),
      raw: line,
    };
  }

  return `Unknown command in: "${line}"`;
}

/**
 * Parse signal command text.
 * For email: first non-quoted line only (strict mode).
 * For CLI/API: pass the command directly.
 */
export function parseSignalText(text: string, strict = true): SignalParseResult {
  if (strict) {
    const { first, count } = extractFreshLines(text);

    if (!first) {
      return { command: null, error: 'No command found — empty or only quoted text.' };
    }

    if (count > 1) {
      return {
        command: null,
        error: 'Multiple lines found — only ONE command per reply.',
      };
    }

    const result = parseLine(first);
    if (typeof result === 'string') {
      return { command: null, error: result };
    }
    return { command: result, error: null };
  }

  // Non-strict: parse the text directly as a command
  const result = parseLine(text.trim());
  if (typeof result === 'string') {
    return { command: null, error: result };
  }
  return { command: result, error: null };
}
