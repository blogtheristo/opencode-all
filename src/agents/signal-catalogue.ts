/**
 * Signal Catalogue & "Worth Interrupting" Gate — DWS IQ 6/7
 *
 * The OBSERVE half of proactive agents. Encodes *what* is worth watching,
 * *for whom*, and *what makes it worth interrupting a human* — the product
 * design from the Proactive AI Agents plan, expressed as data + pure logic
 * so it is testable without a database or LLM.
 *
 * The 2x2 gate (confidence x urgency) decides the disposition of a signal:
 *
 *                 HIGH CONFIDENCE
 *          DIGEST ──────┼────── ACT NOW
 *   LOW URGENCY ────────┼──────── HIGH URGENCY
 *           SKIP  ──────┼────── FLAG FOR REVIEW
 *                 LOW CONFIDENCE
 */

/** Which catalogue tier a signal belongs to */
export type SignalTier = 'threshold' | 'anomaly' | 'ambient';

export type Confidence = 'high' | 'low';
export type Urgency = 'high' | 'low';

/** Disposition produced by the 2x2 gate */
export type GateDecision = 'act_now' | 'flag_for_review' | 'digest' | 'skip';

/** Channel a nudge can be delivered on */
export type NudgeChannel = 'email' | 'teams' | 'slack' | 'in_app';

/** A watchable signal definition (the catalogue entry) */
export interface SignalDefinition {
  /** Stable machine key, e.g. 'site_safety_low' */
  key: string;
  /** Catalogue tier */
  tier: SignalTier;
  /** Human-readable label */
  label: string;
  /** Owning agent (registry name) responsible for this signal */
  agent: string;
  /** Recipient role (R-ID or role name from DWS_ROLES_REGISTRY) */
  recipientRole: string;
  /** Default confidence for the gate */
  confidence: Confidence;
  /** Default urgency for the gate */
  urgency: Urgency;
  /** Delivery channels for this signal's nudge */
  channels: NudgeChannel[];
  /**
   * Action options offered in the nudge. Tier-1 threshold breaches use a
   * binary confirm/override; Tier-2 anomalies use an investigation pathway
   * (no simple yes/no action exists yet).
   */
  actionOptions: string[];
  /** Suggested poll interval (ms) — the poller groups evaluators by this */
  checkIntervalMs: number;
}

// ============ INTERVAL CONSTANTS ============

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/** Standard action sets */
export const CONFIRM_OVERRIDE_ACTIONS = ['Confirm', 'Override', 'More detail'];
export const INVESTIGATE_ACTIONS = ['View Analysis', 'Dismiss'];

// ============ THE CATALOGUE ============

/**
 * Tier 1 — Threshold breaches (high confidence, act immediately).
 * Tier 2 — Pattern anomalies (medium/low confidence, flag for review).
 * Tier 3 — Ambient context (low urgency, weekly digest).
 */
export const SIGNAL_CATALOGUE: SignalDefinition[] = [
  // ---- Tier 1: Threshold breaches ----
  {
    key: 'emissions_budget_breach',
    tier: 'threshold',
    label: 'Emissions above monthly ETS allocation',
    agent: 'compliance',
    recipientRole: 'CFO / ESG Lead',
    confidence: 'high',
    urgency: 'high',
    channels: ['email', 'in_app', 'teams'],
    actionOptions: CONFIRM_OVERRIDE_ACTIONS,
    checkIntervalMs: 4 * HOUR,
  },
  {
    key: 'site_safety_low',
    tier: 'threshold',
    label: 'Site safety score below safe operating floor during active shift',
    agent: 'sitesense',
    recipientRole: 'Site Manager',
    confidence: 'high',
    urgency: 'high',
    channels: ['teams', 'in_app'],
    actionOptions: CONFIRM_OVERRIDE_ACTIONS,
    checkIntervalMs: 15 * MIN,
  },
  {
    key: 'carbon_data_overdue',
    tier: 'threshold',
    label: 'Carbon data not submitted within 48h of CSRD deadline',
    agent: 'compliance',
    recipientRole: 'Compliance Officer',
    confidence: 'high',
    urgency: 'high',
    channels: ['email', 'in_app'],
    actionOptions: CONFIRM_OVERRIDE_ACTIONS,
    checkIntervalMs: DAY,
  },
  {
    key: 'customer_inactive',
    tier: 'threshold',
    label: 'Customer inactive for 14 days',
    agent: 'customer-sat',
    recipientRole: 'Account Manager',
    confidence: 'high',
    urgency: 'low',
    channels: ['email', 'in_app'],
    actionOptions: CONFIRM_OVERRIDE_ACTIONS,
    checkIntervalMs: DAY,
  },

  // ---- Tier 2: Pattern anomalies ----
  {
    key: 'material_carbon_spike',
    tier: 'anomaly',
    label: 'Material carbon intensity up 20% vs last order',
    agent: 'material-oracle',
    recipientRole: 'Procurement Lead',
    confidence: 'low',
    urgency: 'high',
    channels: ['in_app'],
    actionOptions: INVESTIGATE_ACTIONS,
    checkIntervalMs: WEEK,
  },
  {
    key: 'ets_price_forecast_spike',
    tier: 'anomaly',
    label: 'ETS price forecast to spike >15% in next 7 days',
    agent: 'compliance',
    recipientRole: 'CFO / ESG Lead',
    confidence: 'low',
    urgency: 'high',
    channels: ['in_app', 'email'],
    actionOptions: INVESTIGATE_ACTIONS,
    checkIntervalMs: DAY,
  },

  // ---- Tier 3: Ambient context (digest) ----
  {
    key: 'market_tam_shift',
    tier: 'ambient',
    label: 'Market sizing shift in current TAM',
    agent: 'compliance',
    recipientRole: 'Strategy',
    confidence: 'high',
    urgency: 'low',
    channels: ['in_app'],
    actionOptions: INVESTIGATE_ACTIONS,
    checkIntervalMs: WEEK,
  },
];

/** Lookup a signal definition by key */
export function getSignal(key: string): SignalDefinition | undefined {
  return SIGNAL_CATALOGUE.find((s) => s.key === key);
}

/**
 * The "Worth Interrupting" 2x2 gate.
 * Returns the disposition for a given confidence/urgency pair.
 */
export function evaluateGate(confidence: Confidence, urgency: Urgency): GateDecision {
  if (confidence === 'high' && urgency === 'high') return 'act_now';
  if (confidence === 'low' && urgency === 'high') return 'flag_for_review';
  if (confidence === 'high' && urgency === 'low') return 'digest';
  return 'skip';
}

/** True when a gate decision should produce a real-time nudge (vs digest/skip) */
export function shouldNudgeNow(decision: GateDecision): boolean {
  return decision === 'act_now' || decision === 'flag_for_review';
}
