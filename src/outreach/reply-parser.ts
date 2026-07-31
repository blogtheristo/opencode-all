/**
 * Reply Parser — Parse email replies into thread update commands
 *
 * STRICT: first non-quoted line only. One reply = one update.
 * Multiple updates = multiple replies to the digest email.
 *
 * Type 2: Delegates to src/signals/ for token generation and status resolution.
 * Backward compatible — all T:XXXXXXXX commands still work.
 *
 * Token T:XXXXXXXX = 10-char alphanumeric (Type 2 universal signal token).
 * Generated once at creation, stable forever. Looked up via exact match.
 *
 * Examples:
 *   T:8F3K2P9Q status responded
 *   T:8F3K2P9Q next 2026-02-10 type nudge
 *   T:8F3K2P9Q park
 *
 * Supported commands:
 *   T:XXXXXXXX status <status> [, <notes>]   — update thread status (+ optional next_action)
 *   T:XXXXXXXX next <date> [type <type>]     — set next_action_date (+ optional action type)
 *   T:XXXXXXXX park                          — shorthand: status=parked
 *   T:XXXXXXXX pass                          — shorthand: status=passed
 *   T:XXXXXXXX note <text>                   — set next_action text without status change
 */

import type { OutreachStatus } from './types.js';
import { generateSignalToken } from '../signals/signal-token.js';

// ============================================================================
// TYPES
// ============================================================================

export interface UpdateCommand {
  token: string;
  threadId?: string; // resolved after DB lookup
  action: 'status' | 'next' | 'note';
  status?: OutreachStatus;
  nextActionDate?: string; // YYYY-MM-DD
  nextActionType?: string;
  nextAction?: string; // free-text notes / next_action
  raw: string; // original line for confirmation
}

export interface ParseResult {
  command: UpdateCommand | null;
  error: string | null;
}

export interface ApplyResult {
  applied: { token: string; threadId: string; summary: string }[];
  failed: { token: string; reason: string; raw: string }[];
}

// ============================================================================
// TOKEN GENERATION — delegates to Type 2 signal token system
// ============================================================================

/** Generate a 10-char random token (delegates to universal signal token) */
export function generateThreadToken(len = 10): string {
  return generateSignalToken(len);
}

// ============================================================================
// STATUS ALIASES — loose matching for mobile typing
// ============================================================================

const STATUS_ALIASES: Record<string, OutreachStatus> = {
  // Direct matches
  new: 'new',
  researched: 'researched',
  intro_requested: 'intro_requested',
  intro_made: 'intro_made',
  contacted: 'contacted',
  responded: 'responded',
  meeting_booked: 'meeting_booked',
  in_negotiation: 'in_negotiation',
  converted: 'converted',
  passed: 'passed',
  parked: 'parked',

  // Common aliases (mobile-friendly)
  research: 'researched',
  'research done': 'researched',
  'intro requested': 'intro_requested',
  'intro done': 'intro_made',
  'intro made': 'intro_made',
  'intro delivered': 'intro_made',
  'reached out': 'contacted',
  sent: 'contacted',
  replied: 'responded',
  response: 'responded',
  'got reply': 'responded',
  meeting: 'meeting_booked',
  call: 'meeting_booked',
  'call booked': 'meeting_booked',
  negotiating: 'in_negotiation',
  nego: 'in_negotiation',
  won: 'converted',
  'closed won': 'converted',
  closed: 'converted',
  pass: 'passed',
  no: 'passed',
  'not interested': 'passed',
  park: 'parked',
  pause: 'parked',
  hold: 'parked',
  done: 'passed',
  complete: 'passed',
  completed: 'passed',
  resolved: 'passed',
};

function resolveStatus(input: string): OutreachStatus | null {
  const normalized = input.trim().toLowerCase().replace(/[-_]/g, '_');
  if (STATUS_ALIASES[normalized]) return STATUS_ALIASES[normalized];
  const spaced = normalized.replace(/_/g, ' ');
  if (STATUS_ALIASES[spaced]) return STATUS_ALIASES[spaced];
  return null;
}

// ============================================================================
// PARSE
// ============================================================================

/**
 * Extract fresh (non-quoted) lines from a reply.
 * Strips everything after quote markers (>, On ... wrote:, etc).
 * Returns { first, count } — count of non-empty fresh lines.
 * If count > 1, the reply is ambiguous and should be rejected.
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
    // Common email signatures
    if (trimmed === '--') break;
    if (/^sent from my/i.test(trimmed)) break;
    if (/^get outlook/i.test(trimmed)) break;

    // Skip empty lines
    if (!trimmed) continue;

    fresh.push(trimmed);
  }

  return { first: fresh.length > 0 ? fresh[0] : null, count: fresh.length };
}

/**
 * Token regex: T: followed by 4-10 alphanumeric chars (case-insensitive).
 * Standard is 8 chars but we allow a range for flexibility.
 */
const TOKEN_REGEX = /^T:([A-Z0-9]{4,12})\s+(.+)$/i;

/** Parse a single command line */
function parseLine(line: string): UpdateCommand | string {
  const tokenMatch = line.match(TOKEN_REGEX);
  if (!tokenMatch) {
    return `Couldn't parse: "${line}"`;
  }

  const token = tokenMatch[1].toUpperCase();
  const rest = tokenMatch[2].trim();
  const normalizedRest = rest.replace(/[.!]+$/g, '').trim();

  // Shorthand: T:XXXXXXXX park
  if (/^park$/i.test(normalizedRest)) {
    return { token, action: 'status', status: 'parked', raw: line };
  }
  if (/^pass$/i.test(normalizedRest)) {
    return { token, action: 'status', status: 'passed', raw: line };
  }

  // Generic shorthand: T:XXXXXXXX responded / done / contacted / ...
  const shorthandStatus = resolveStatus(normalizedRest);
  if (shorthandStatus) {
    return { token, action: 'status', status: shorthandStatus, raw: line };
  }

  // T:XXXXXXXX status <status> [, <notes>]
  const statusMatch = normalizedRest.match(/^status\s+(.+)$/i);
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

  // T:XXXXXXXX next <date> [type <type>]
  const nextMatch = normalizedRest.match(/^next\s+(\d{4}-\d{2}-\d{2})(?:\s+type\s+(\w+))?$/i);
  if (nextMatch) {
    return {
      token,
      action: 'next',
      nextActionDate: nextMatch[1],
      nextActionType: nextMatch[2] || undefined,
      raw: line,
    };
  }

  // T:XXXXXXXX note <text>
  const noteMatch = normalizedRest.match(/^note\s+(.+)$/i);
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
 * Parse the reply text — first non-quoted line only.
 * STRICT: if more than one non-empty, non-quoted line is found, reject.
 * One reply = one update. Multiple updates = multiple replies.
 */
export function parseReplyText(text: string): ParseResult {
  const { first, count } = extractFreshLines(text);

  if (!first) {
    return { command: null, error: 'No command found — reply was empty or only quoted text.' };
  }

  if (count > 1) {
    return {
      command: null,
      error:
        'Multiple lines found — only ONE command per reply. Send separate replies for each update.',
    };
  }

  const result = parseLine(first);
  if (typeof result === 'string') {
    return { command: null, error: result };
  }

  return { command: result, error: null };
}

/**
 * Parse a command from an email subject line.
 * Supports common prefixes (Re:, Fwd:) and extracts command from first `T:...`.
 */
export function parseSubjectCommand(subject: string): ParseResult {
  if (!subject.trim()) {
    return { command: null, error: 'No command found in subject.' };
  }

  const cleaned = subject.replace(/^\s*((re|fwd?):\s*)+/i, '').trim();
  const tokenStart = cleaned.toUpperCase().indexOf('T:');
  if (tokenStart < 0) {
    return { command: null, error: 'No token command found in subject.' };
  }

  const candidate = cleaned.slice(tokenStart).trim();
  const result = parseLine(candidate);
  if (typeof result === 'string') {
    return { command: null, error: result };
  }

  return { command: result, error: null };
}

// ============================================================================
// VERIFY SENDER
// ============================================================================

/** Check if the email sender is the authorized digest recipient */
export function isAuthorizedSender(from: string): boolean {
  const primaryAuthorizedEmail = process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
  const fallbackAllowed = 'risto.anton@lifetime.fi';
  const extraAllowed = process.env.OUTREACH_DIGEST_ALLOWED_SENDERS || fallbackAllowed;

  const allowed = new Set(
    [primaryAuthorizedEmail, ...extraAllowed.split(',')]
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0),
  );

  // Email from header can be "Name <email>" or just "email"
  const emailMatch = from.match(/<([^>]+)>/) || [null, from.trim()];
  const senderEmail = (emailMatch[1] || '').toLowerCase().trim();
  return allowed.has(senderEmail);
}
