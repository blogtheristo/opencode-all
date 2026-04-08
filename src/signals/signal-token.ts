/**
 * Signal Token — Type 2 Universal Event Signal
 *
 * Code-Version: 1.0
 * Branch: claude/record-contact-response-MFTP7
 * Date: 2026-04-06
 * Owner: claude-code
 *
 * A signal token is an anonymized event identifier that works across
 * all Lifetime systems: outreach, control room, situation room, IoT,
 * compliance, ERP. No PII in the token itself — resolution lives in
 * the secure database.
 *
 * Format: T:<10-char alphanumeric> (e.g. T:YPGW53RPFQ)
 * Alphabet: 23456789ABCDEFGHJKMNPQRSTUVWXYZ (no 0/O, 1/I/L confusion)
 * Entropy: 30^10 ≈ 590 trillion values
 *
 * Type 1 (legacy): token tied to outreach_threads only
 * Type 2 (current): token is a universal signal across all domains
 */

import crypto from 'crypto';

// ============================================================================
// SIGNAL DOMAINS — every system boundary that can mint tokens
// ============================================================================

export type SignalDomain =
  | 'outreach' // Sales, investor, partner outreach
  | 'control-room' // Operational field commands
  | 'situation-room' // Strategic/executive decisions
  | 'iot' // Edge devices, sensors, fleet
  | 'compliance' // EU AI Act Article 12, CSRD, ETS
  | 'erp' // Purchase orders, invoices, contracts
  | 'supply-chain'; // Supplier ↔ buyer signals

// ============================================================================
// SIGNAL STATUS — universal status vocabulary
// ============================================================================

/** Outreach-specific statuses (backward compatible with Type 1) */
export type OutreachStatus =
  | 'new'
  | 'researched'
  | 'intro_requested'
  | 'intro_made'
  | 'contacted'
  | 'responded'
  | 'meeting_booked'
  | 'in_negotiation'
  | 'converted'
  | 'passed'
  | 'parked';

/** Universal signal statuses (work across all domains) */
export type SignalStatus =
  | OutreachStatus
  | 'pending' // Awaiting action
  | 'acknowledged' // Received, not acted on
  | 'in_progress' // Being worked on
  | 'completed' // Done
  | 'escalated' // Moved up (control → situation room)
  | 'delegated' // Moved down (situation → control room)
  | 'failed' // Action failed
  | 'expired' // Timed out
  | 'cancelled'; // Withdrawn

// ============================================================================
// SIGNAL TOKEN — the core type
// ============================================================================

export interface SignalToken {
  /** The token string (e.g. "YPGW53RPFQ") */
  token: string;

  /** Which system domain minted this token */
  domain: SignalDomain;

  /** Current status */
  status: SignalStatus;

  /** Source → target direction (e.g. "CR4→SR-SUP34") */
  direction?: string;

  /** Human-readable event description */
  description: string;

  /** ISO timestamp of creation */
  created_at: string;

  /** ISO timestamp of last update */
  updated_at: string;

  /** Who/what created it (agent ID, user ID, device ID) */
  created_by: string;

  /** Reference to entity (person ID, device ID, supplier ID, etc.) */
  entity_ref?: string;

  /** Pipeline for outreach domain (backward compat) */
  pipeline?: 'investor' | 'customer' | 'partner';

  // ── Transaction Economics ──────────────────────────────────────────

  /** Transaction weight (units, kg, hours — domain-specific) */
  weight?: number;

  /** Weight unit (e.g. "kg", "hours", "units", "tonnes_CO2e") */
  weight_unit?: string;

  /** Price per unit in EUR (what the market pays) */
  price?: number;

  /** Cost per unit in EUR (what it costs us) */
  cost?: number;

  /** Income / revenue from this signal event in EUR */
  income?: number;

  /** Currency code (default EUR) */
  currency?: string;
}

// ============================================================================
// TOKEN GENERATION — matches PG function generate_thread_token()
// ============================================================================

/** Safe alphabet: no 0/O, 1/I/L confusion. 30 chars. */
const TOKEN_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/** Generate a 10-char random token */
export function generateSignalToken(len = 10): string {
  const bytes = crypto.randomBytes(len);
  return Array.from(bytes)
    .map((b) => TOKEN_ALPHABET[b % TOKEN_ALPHABET.length])
    .join('');
}

/** Validate token format */
export function isValidToken(token: string): boolean {
  return /^[23456789A-HJ-NP-Z]{4,12}$/.test(token);
}

/** Format for display: T:XXXXXXXXXX */
export function formatToken(token: string): string {
  return `T:${token}`;
}

/** Extract token from T:XXXXXXXXXX format */
export function extractToken(formatted: string): string | null {
  const match = formatted.match(/^T:([23456789A-HJ-NP-Z]{4,12})$/i);
  return match ? match[1].toUpperCase() : null;
}

// ============================================================================
// STATUS ALIASES — loose matching for mobile typing (all domains)
// ============================================================================

const STATUS_ALIASES: Record<string, SignalStatus> = {
  // Outreach (Type 1 backward compat)
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

  // Universal (Type 2)
  pending: 'pending',
  wait: 'pending',
  waiting: 'pending',
  acknowledged: 'acknowledged',
  ack: 'acknowledged',
  received: 'acknowledged',
  'in progress': 'in_progress',
  in_progress: 'in_progress',
  working: 'in_progress',
  active: 'in_progress',
  completed: 'completed',
  done: 'completed',
  finished: 'completed',
  delivered: 'completed',
  escalated: 'escalated',
  escalate: 'escalated',
  urgent: 'escalated',
  delegated: 'delegated',
  delegate: 'delegated',
  assign: 'delegated',
  failed: 'failed',
  fail: 'failed',
  error: 'failed',
  expired: 'expired',
  timeout: 'expired',
  cancelled: 'cancelled',
  cancel: 'cancelled',
  abort: 'cancelled',
};

export function resolveStatus(input: string): SignalStatus | null {
  const normalized = input.trim().toLowerCase().replace(/[-_]/g, '_');
  if (STATUS_ALIASES[normalized]) return STATUS_ALIASES[normalized];
  const spaced = normalized.replace(/_/g, ' ');
  if (STATUS_ALIASES[spaced]) return STATUS_ALIASES[spaced];
  return null;
}
