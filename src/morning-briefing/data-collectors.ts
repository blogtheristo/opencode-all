/**
 * Morning Briefing — Data Collectors
 *
 * CEO Cockpit: 5-minute daily briefing at 06:00 Helsinki.
 *
 * Template sections:
 *   1. 3 Changes — what moved since yesterday (pipeline, product, delivery)
 *   2. Today's 3 Bets — the only 3 outcomes that matter today
 *   3. Risks — top blocker + next action
 *   4. Captain Momentum — who to ping + what artifact to send
 *   5. Metrics Strip — cash runway, active convos, commits, MVP ETA
 *
 * Outreach stays separate: generates a "send list" for manual execution.
 *
 * All Supabase calls are best-effort: a section failure
 * does not block the rest of the briefing.
 */

import { readdir, readFile, stat } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';
import {
  getLeadsSummary,
  getNewLeads,
  getUpcomingDeadlines,
} from '../construction-leads/lead-processor.js';
import { getSourceCounts, getSourcesSummary } from '../construction-leads/lead-sources.js';
import type {
  ConstructionLeadDeadline,
  ConstructionLeadNew,
  ConstructionLeadsSummary,
} from '../construction-leads/types.js';

// ============================================================================
// TYPES
// ============================================================================

/** Delta since yesterday */
export interface ThreeChanges {
  pipeline: string;
  product: string;
  delivery: string;
}

/** The 3 highest-priority outreach contacts to reach today */
export interface SendListItem {
  name: string;
  org: string | null;
  pipeline: string;
  action: string;
  linkedin_url: string | null;
  primary_email: string | null;
  phone: string | null;
  thread_token: string | null;
}

/** Who to ping + what artifact to send */
export interface CaptainMomentum {
  contacts: SendListItem[];
  artifact: string;
}

/** Top blocker + suggested next action */
export interface TopRisk {
  blocker: string;
  next_action: string;
}

/** The 3 non-negotiable metrics */
export interface MetricsStrip {
  mrr_eur: number | null;
  active_conversations: number;
  weekly_commits: number;
  mvp_eta: string | null;
}

/** AI/DS Workflow Accelerator — last pipeline run data */
export interface WorkflowData {
  last_run: string | null; // ISO timestamp
  mode: string; // "dry_run" | "full"
  total_time_seconds: number;
  all_passed: boolean;
  stages: Array<{ name: string; status: string; time: number }>;
  best_model: string | null;
  best_f1: number | null;
  top_feature: string | null;
  savings_percent: number; // vs traditional cycle
}

/** A single Learn/ HTML artifact for the morning briefing */
export interface LearnArtifact {
  filename: string;
  title: string;
  modifiedDate: string; // ISO date string
  githubUrl: string;
}

/** Learn/ HTML artifacts modified in the last 7 days */
export interface LearnArtifactsData {
  artifacts: LearnArtifact[];
}

/** A single Human-in-the-Loop manual task */
export interface HilTodo {
  id: string;
  category: string;
  description: string;
  context: Record<string, unknown>;
  done_token: string;
  created_at: string;
}

/** Open HIL todos for the morning briefing */
export interface HilTodosData {
  todos: HilTodo[];
  backendUrl: string; // base URL for the "Done" button link
}

/** Construction leads data for morning briefing */
export interface ConstructionLeadsData {
  summary: ConstructionLeadsSummary | null;
  newLeads: ConstructionLeadNew[];
  deadlines: ConstructionLeadDeadline[];
  /** Lead sources summary string (e.g. "Active: TED | Planned: DTAD, Mercell") */
  sourcesSummary: string;
  /** Source counts by status */
  sourceCounts: { active: number; planned: number; reference: number; total: number };
}

/** Outreach pipeline summary for morning briefing header */
export interface OutreachSummaryData {
  /** Pipeline counts: total, open, active per pipeline */
  pipelines: Record<string, { total: number; open: number; active: number }>;
  /** Overdue threads count */
  overdueCount: number;
  /** Due today threads count */
  todayCount: number;
  /** Emails received today */
  emailsReceivedToday: number;
  /** Top overdue threads (up to 3) for quick action */
  topOverdue: Array<{
    token: string;
    name: string;
    org: string | null;
    pipeline: string;
    status: string;
    next_action: string | null;
    days_overdue: number;
  }>;
}

/** Captain seat inquiry from /captain/ form */
export interface CaptainInquiryItem {
  id: string;
  created_at: string;
  name: string;
  email: string;
  industry: string;
  seat_level: string;
  message: string | null;
  status: string;
}

export interface CaptainInquiriesData {
  newCount: number;
  inquiries: CaptainInquiryItem[];
}

export interface WebLeadItem {
  id: string;
  created_at: string;
  source: string; // newsletter | free_audit | contact
  email: string;
  name: string | null;
  company: string | null;
  industry: string | null;
  message: string | null;
  status: string;
}

export interface WebLeadsData {
  newCount: number;
  leads: WebLeadItem[];
}

/** A single cross-vertical market/incident signal from news-to-signal.sh */
export interface MarketSignalItem {
  timestamp: string;
  title: string;
  source: string;
  industries: string; // comma-separated
  dual_use: boolean;
  cascade_score: number;
}

/** Market signals scanned in the last 3 days, above alert threshold */
export interface MarketSignalsData {
  signals: MarketSignalItem[];
  scannedAt: string | null; // most recent scan timestamp found, or null if no scan output exists
}

export interface CockpitData {
  date: string;
  dateFormatted: string;
  dayOfWeek: string;
  changes: ThreeChanges;
  bets: string[];
  risk: TopRisk;
  momentum: CaptainMomentum;
  metrics: MetricsStrip;
  sendList: SendListItem[];
  workflow: WorkflowData | null;
  constructionLeads: ConstructionLeadsData;
  outreachSummary: OutreachSummaryData;
  captainInquiries: CaptainInquiriesData;
  webLeads: WebLeadsData;
  learnArtifacts: LearnArtifactsData;
  hilTodos: HilTodosData;
  marketSignals: MarketSignalsData;
}

// ============================================================================
// SUPABASE HELPER
// ============================================================================

async function supabaseFetch<T>(path: string): Promise<T | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) return null;

  try {
    const response = await fetch(`${url}/rest/v1/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=representation',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      logger.warn('Morning briefing Supabase fetch failed', {
        path,
        status: response.status,
        error: body,
      });
      return null;
    }

    return response.json() as Promise<T>;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.warn('Morning briefing Supabase fetch error', { path, error: msg });
    return null;
  }
}

// ============================================================================
// COLLECTORS
// ============================================================================

/**
 * Detect pipeline changes since yesterday from outreach_threads.
 */
async function collectPipelineChange(): Promise<string> {
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];

  // Count threads updated since yesterday
  const threads = await supabaseFetch<Array<{ status: string; pipeline: string }>>(
    `v_outreach_enriched?created_at=gte.${yesterday}T00:00:00&select=status,pipeline`,
  );

  if (!threads || threads.length === 0) return 'No pipeline movement';

  const byPipeline: Record<string, number> = {};
  for (const t of threads) {
    byPipeline[t.pipeline] = (byPipeline[t.pipeline] || 0) + 1;
  }

  const parts = Object.entries(byPipeline).map(([p, count]) => `${count} ${p}`);
  return `${threads.length} threads moved: ${parts.join(', ')}`;
}

/**
 * Check agent activity in the last 24h (product velocity).
 * Reads from agent_metrics (daily aggregated) table.
 */
async function collectProductChange(): Promise<string> {
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];

  const metrics = await supabaseFetch<
    Array<{
      agent_id: string;
      leads_processed: number;
      emails_sent: number;
      meetings_booked: number;
    }>
  >(
    `agent_metrics?select=agent_id,leads_processed,emails_sent,meetings_booked&date=gte.${yesterday}`,
  );

  if (metrics && metrics.length > 0) {
    const totalLeads = metrics.reduce((s, m) => s + (m.leads_processed || 0), 0);
    const totalEmails = metrics.reduce((s, m) => s + (m.emails_sent || 0), 0);
    const totalMeetings = metrics.reduce((s, m) => s + (m.meetings_booked || 0), 0);
    const parts: string[] = [];
    if (totalLeads > 0) parts.push(`${totalLeads} leads`);
    if (totalEmails > 0) parts.push(`${totalEmails} emails`);
    if (totalMeetings > 0) parts.push(`${totalMeetings} meetings`);
    return parts.length > 0 ? parts.join(', ') : 'Agents active, no output yet';
  }
  return 'No product signals captured';
}

/**
 * Check for recent delivery milestones.
 */
async function collectDeliveryChange(): Promise<string> {
  // Check Firehorse leads that moved to Engaged/Meeting_Booked yesterday
  // Valid lead_state enum: New, Cold_1_Sent, Cold_1_Opened, Cold_1_Clicked,
  // Cold_2_Sent, Cold_3_Sent, Engaged, Meeting_Booked, Disqualified, Parked
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];

  const converted = await supabaseFetch<Array<{ state: string }>>(
    `firehorse_leads?select=state&created_at=gte.${yesterday}T00:00:00&state=in.(Engaged,Meeting_Booked)`,
  );

  if (converted && converted.length > 0) {
    const engaged = converted.filter((l) => l.state === 'Engaged').length;
    const booked = converted.filter((l) => l.state === 'Meeting_Booked').length;
    const parts: string[] = [];
    if (engaged > 0) parts.push(`${engaged} engaged`);
    if (booked > 0) parts.push(`${booked} meetings booked`);
    return parts.join(', ');
  }

  return 'No delivery changes';
}

/**
 * Collect the 3 changes (pipeline, product, delivery).
 */
async function collectThreeChanges(): Promise<ThreeChanges> {
  const [pipeline, product, delivery] = await Promise.all([
    collectPipelineChange(),
    collectProductChange(),
    collectDeliveryChange(),
  ]);

  return { pipeline, product, delivery };
}

/**
 * Auto-generate today's 3 bets based on what's overdue/due.
 */
async function collectTodaysBets(): Promise<string[]> {
  const today = new Date().toISOString().split('T')[0];

  const threads = await supabaseFetch<
    Array<{
      status: string;
      pipeline: string;
      next_action: string;
      next_action_date: string;
      first_name: string;
      org_name: string;
    }>
  >(
    `v_outreach_enriched?next_action_date=lte.${today}&status=not.in.(converted,passed,parked)&order=next_action_date.asc&limit=5&select=status,pipeline,next_action,next_action_date,first_name,org_name`,
  );

  if (!threads || threads.length === 0) {
    return [
      'Source 3 new contacts (LinkedIn / Boardy / conferences)',
      'Ship one product improvement',
      'Review investor pipeline status',
    ];
  }

  // Pick up to 3 highest-priority actions
  const bets: string[] = [];
  for (const t of threads.slice(0, 3)) {
    const action = t.next_action || `Follow up with ${t.first_name}`;
    const org = t.org_name ? ` (${t.org_name})` : '';
    bets.push(`${action}${org}`);
  }

  return bets;
}

/**
 * Identify the top risk/blocker.
 */
async function collectTopRisk(): Promise<TopRisk> {
  const today = new Date().toISOString().split('T')[0];

  // Find the most overdue thread
  const overdue = await supabaseFetch<
    Array<{
      first_name: string;
      org_name: string;
      next_action_date: string;
      pipeline: string;
      next_action: string;
    }>
  >(
    `v_outreach_enriched?next_action_date=lt.${today}&status=not.in.(converted,passed,parked)&order=next_action_date.asc&limit=1&select=first_name,org_name,next_action_date,pipeline,next_action`,
  );

  if (overdue && overdue.length > 0) {
    const t = overdue[0];
    const daysOverdue = Math.floor(
      (Date.now() - new Date(t.next_action_date).getTime()) / 86_400_000,
    );
    return {
      blocker: `${t.first_name} (${t.org_name || t.pipeline}) — ${daysOverdue}d overdue`,
      next_action: t.next_action || `Nudge ${t.first_name} or park the thread`,
    };
  }

  return {
    blocker: 'No critical blockers',
    next_action: 'Stay on schedule',
  };
}

/**
 * Build the "Captain Momentum" section — who to ping + artifact suggestion.
 */
async function collectMomentum(): Promise<CaptainMomentum> {
  const today = new Date().toISOString().split('T')[0];

  // Active deals + due today: these are the people to ping
  const threads = await supabaseFetch<
    Array<{
      first_name: string;
      last_name: string;
      org_name: string;
      pipeline: string;
      next_action: string;
      linkedin_url: string;
      status: string;
      next_action_date: string;
      primary_email: string | null;
      person_phone: string | null;
      thread_token: string | null;
    }>
  >(
    `v_outreach_enriched?or=(status.in.(responded,meeting_booked,in_negotiation),next_action_date.eq.${today})&status=not.in.(converted,passed,parked)&order=next_action_date.asc&limit=5&select=first_name,last_name,org_name,pipeline,next_action,linkedin_url,status,next_action_date,primary_email,person_phone,thread_token`,
  );

  const contacts: SendListItem[] = (threads || []).map((t) => ({
    name: [t.first_name, t.last_name].filter(Boolean).join(' '),
    org: t.org_name || null,
    pipeline: t.pipeline,
    action: t.next_action || 'Follow up',
    linkedin_url: t.linkedin_url || null,
    primary_email: t.primary_email || null,
    phone: t.person_phone || null,
    thread_token: t.thread_token || null,
  }));

  // Suggest artifact based on pipeline focus
  const hasInvestor = contacts.some((c) => c.pipeline === 'investor');
  const hasCustomer = contacts.some((c) => c.pipeline === 'customer');
  let artifact = 'Prepare follow-up message';
  if (hasInvestor) artifact = 'Situation Room investor pack';
  if (hasCustomer) artifact = 'Construction 1-pager or demo link';

  return { contacts, artifact };
}

/**
 * Collect the metrics strip.
 */
async function collectMetrics(): Promise<MetricsStrip> {
  // MRR: from env var or Supabase config (EUR)
  const mrrEnv = process.env.MRR_EUR;
  const mrr_eur = mrrEnv ? parseFloat(mrrEnv) : null;

  // Active conversations: count non-closed outreach threads
  const convos = await supabaseFetch<Array<{ id: string }>>(
    `v_outreach_enriched?status=not.in.(converted,passed,parked)&select=id`,
  );
  const active_conversations = convos?.length || 0;

  // Weekly commits: live from GitHub API, fallback to env var
  let weekly_commits = 0;
  const ghToken = process.env.GITHUB_TOKEN;
  const ghRepo = process.env.GITHUB_REPOSITORY || 'blogtheristo/dws6';
  if (ghToken) {
    try {
      const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
      const resp = await fetch(
        `https://api.github.com/repos/${ghRepo}/commits?since=${since}&per_page=100`,
        { headers: { Authorization: `Bearer ${ghToken}`, 'User-Agent': 'dws6-cockpit' } },
      );
      if (resp.ok) {
        const commits = (await resp.json()) as Array<unknown>;
        weekly_commits = commits.length;
      }
    } catch {
      // fall through to env var
    }
  }
  if (weekly_commits === 0) {
    const commitsEnv = process.env.WEEKLY_COMMITS;
    weekly_commits = commitsEnv ? parseInt(commitsEnv, 10) : 0;
  }

  // MVP ETA: from env var
  const mvp_eta = process.env.MVP_ETA || null;

  return { mrr_eur, active_conversations, weekly_commits, mvp_eta };
}

/**
 * Build the send list — top 3-5 contacts to manually message today.
 * Prioritizes: overdue > due today > active deals > waiting.
 */
async function collectSendList(): Promise<SendListItem[]> {
  const today = new Date().toISOString().split('T')[0];

  const threads = await supabaseFetch<
    Array<{
      first_name: string;
      last_name: string;
      org_name: string;
      pipeline: string;
      next_action: string;
      linkedin_url: string;
      status: string;
      next_action_date: string;
      primary_email: string | null;
      person_phone: string | null;
      thread_token: string | null;
    }>
  >(
    `v_outreach_enriched?next_action_date=lte.${today}&status=not.in.(converted,passed,parked)&order=next_action_date.asc&limit=5&select=first_name,last_name,org_name,pipeline,next_action,linkedin_url,status,next_action_date,primary_email,person_phone,thread_token`,
  );

  return (threads || []).map((t) => ({
    name: [t.first_name, t.last_name].filter(Boolean).join(' '),
    org: t.org_name || null,
    pipeline: t.pipeline,
    action: t.next_action || 'Follow up',
    linkedin_url: t.linkedin_url || null,
    primary_email: t.primary_email || null,
    phone: t.person_phone || null,
    thread_token: t.thread_token || null,
  }));
}

// ============================================================================
// AI/DS WORKFLOW COLLECTOR
// ============================================================================

/**
 * Collect latest AI/DS Workflow Accelerator pipeline run data.
 * Reads from reports/pipeline_run.json and reports/metrics.json (best-effort).
 */
async function collectWorkflowData(): Promise<WorkflowData | null> {
  try {
    // Find project root (reports/ lives at repo root, two levels up from src/morning-briefing/)
    const currentDir =
      typeof __dirname !== 'undefined' ? __dirname : resolve(fileURLToPath(import.meta.url), '..');
    const projectRoot = resolve(currentDir, '..', '..');
    const pipelinePath = resolve(projectRoot, 'reports', 'pipeline_run.json');
    const metricsPath = resolve(projectRoot, 'reports', 'metrics.json');

    // Read pipeline run report
    let pipelineData: {
      mode?: string;
      timestamp?: string;
      total_time_seconds?: number;
      traditional_time_hours?: number;
      stages?: Array<{ name: string; status: string; time: number }>;
      all_passed?: boolean;
    };
    try {
      const raw = await readFile(pipelinePath, 'utf-8');
      pipelineData = JSON.parse(raw);
    } catch {
      return null; // No pipeline run yet — skip section
    }

    // Read metrics (best-effort)
    let bestModel: string | null = null;
    let bestF1: number | null = null;
    let topFeature: string | null = null;
    try {
      const raw = await readFile(metricsPath, 'utf-8');
      const metrics = JSON.parse(raw);
      bestModel = metrics.best_model || null;
      bestF1 = metrics.best_f1 || null;
      if (metrics.feature_ranking && metrics.feature_ranking.length > 0) {
        topFeature = metrics.feature_ranking[0].feature || null;
      }
    } catch {
      // metrics not available — continue with pipeline data only
    }

    const totalSeconds = pipelineData.total_time_seconds || 0;
    const traditionalHours = pipelineData.traditional_time_hours || 104;
    const savings = traditionalHours > 0 ? (1 - totalSeconds / (traditionalHours * 3600)) * 100 : 0;

    return {
      last_run: pipelineData.timestamp || null,
      mode: pipelineData.mode || 'unknown',
      total_time_seconds: totalSeconds,
      all_passed: pipelineData.all_passed ?? false,
      stages: pipelineData.stages || [],
      best_model: bestModel,
      best_f1: bestF1,
      top_feature: topFeature,
      savings_percent: Math.round(savings * 10) / 10,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.warn('Workflow data collection failed (non-critical)', { error: msg });
    return null;
  }
}

// ============================================================================
// OUTREACH SUMMARY COLLECTOR
// ============================================================================

/**
 * Collect outreach pipeline summary for the morning briefing header.
 * Includes pipeline counts, overdue/today threads, and inbound emails received today.
 */
async function collectOutreachSummary(): Promise<OutreachSummaryData> {
  const today = new Date().toISOString().split('T')[0];
  const todayStart = `${today}T00:00:00`;

  // Pipeline summary: count threads by pipeline and status bucket
  const allThreads = await supabaseFetch<
    Array<{
      id: string;
      pipeline: string;
      status: string;
      next_action_date: string | null;
      next_action: string | null;
      first_name: string;
      last_name: string | null;
      org_name: string | null;
      thread_token: string;
    }>
  >(
    `v_outreach_enriched?status=not.in.(converted,passed,parked)&select=id,pipeline,status,next_action_date,next_action,first_name,last_name,org_name,thread_token`,
  );

  const OPEN_STATUSES = ['new', 'researched', 'intro_requested', 'intro_made', 'contacted'];
  const ACTIVE_STATUSES = ['responded', 'meeting_booked', 'in_negotiation'];

  const pipelines: Record<string, { total: number; open: number; active: number }> = {};
  let overdueCount = 0;
  let todayCount = 0;
  const overdueThreads: OutreachSummaryData['topOverdue'] = [];

  if (allThreads) {
    for (const t of allThreads) {
      if (!pipelines[t.pipeline]) {
        pipelines[t.pipeline] = { total: 0, open: 0, active: 0 };
      }
      pipelines[t.pipeline].total++;
      if (OPEN_STATUSES.includes(t.status)) pipelines[t.pipeline].open++;
      if (ACTIVE_STATUSES.includes(t.status)) pipelines[t.pipeline].active++;

      if (t.next_action_date && t.next_action_date < today) {
        overdueCount++;
        const daysOverdue = Math.floor(
          (Date.now() - new Date(t.next_action_date).getTime()) / 86_400_000,
        );
        overdueThreads.push({
          token: t.thread_token,
          name: [t.first_name, t.last_name].filter(Boolean).join(' '),
          org: t.org_name,
          pipeline: t.pipeline,
          status: t.status,
          next_action: t.next_action,
          days_overdue: daysOverdue,
        });
      } else if (t.next_action_date === today) {
        todayCount++;
      }
    }
  }

  // Sort overdue by days_overdue desc, take top 3
  overdueThreads.sort((a, b) => b.days_overdue - a.days_overdue);
  const topOverdue = overdueThreads.slice(0, 3);

  // Count inbound emails received today
  let emailsReceivedToday = 0;
  const inboundEmails = await supabaseFetch<Array<{ id: string }>>(
    `inbound_emails?received_at=gte.${todayStart}&select=id`,
  );
  if (inboundEmails) {
    emailsReceivedToday = inboundEmails.length;
  }

  return {
    pipelines,
    overdueCount,
    todayCount,
    emailsReceivedToday,
    topOverdue,
  };
}

// ============================================================================
// CONSTRUCTION LEADS COLLECTOR
// ============================================================================

/**
 * Collect construction leads data for the morning briefing.
 * Shows new leads from TED and upcoming deadlines, plus source metadata.
 */
async function collectConstructionLeads(): Promise<ConstructionLeadsData> {
  const [summary, newLeads, deadlines] = await Promise.all([
    getLeadsSummary(),
    getNewLeads(),
    getUpcomingDeadlines(),
  ]);

  return {
    summary,
    newLeads,
    deadlines,
    sourcesSummary: getSourcesSummary(),
    sourceCounts: getSourceCounts(),
  };
}

// ============================================================================
// CAPTAIN INQUIRIES COLLECTOR
// ============================================================================

/**
 * Collect new captain seat inquiries (status = 'new').
 * Shows all unprocessed inquiries so the CEO can follow up same day.
 * Note: requires migration 034_captain_inquiries.sql to be applied.
 */
async function collectCaptainInquiries(): Promise<CaptainInquiriesData> {
  const inquiries = await supabaseFetch<CaptainInquiryItem[]>(
    `captain_inquiries?status=eq.new&order=created_at.desc&limit=10&select=id,created_at,name,email,industry,seat_level,message,status`,
  );

  return {
    newCount: inquiries?.length || 0,
    inquiries: inquiries || [],
  };
}

/**
 * Inbound web leads captured from the public sites (footer newsletter,
 * /free-audit/, contact). Surfaces new ones so they enter the sales pipeline.
 * Note: requires migration 070_web_leads.sql to be applied.
 */
async function collectWebLeads(): Promise<WebLeadsData> {
  const leads = await supabaseFetch<WebLeadItem[]>(
    `web_leads?status=eq.new&order=created_at.desc&limit=15&select=id,created_at,source,email,name,company,industry,message,status`,
  );

  return {
    newCount: leads?.length || 0,
    leads: leads || [],
  };
}

// ============================================================================
// LEARN ARTIFACTS COLLECTOR
// ============================================================================

const LEARN_GITHUB_BASE = 'https://github.com/blogtheristo/dws6/blob/main/Learn';

/**
 * Derive a human-readable title from a Learn/ filename.
 * e.g. "DWS_DOCUMENT_STANDARD_v1.7.html" → "DWS Document Standard v1.7"
 */
function learnFilenameToTitle(filename: string): string {
  return filename
    .replace(/\.html$/, '')
    .replace(/_v(\d+\.\d+)$/, ' v$1')
    .replace(/_/g, ' ')
    .replace(/\b(dws|llm|mcp|erp|iq|eu|en|fi|v\d)/gi, (m) => m.toUpperCase())
    .trim();
}

/**
 * Collect Learn/ HTML files modified in the last 7 days.
 * Returns them sorted newest-first, capped at 8 items.
 */
async function collectLearnArtifacts(): Promise<LearnArtifactsData> {
  try {
    const currentDir =
      typeof __dirname !== 'undefined' ? __dirname : resolve(fileURLToPath(import.meta.url), '..');
    const projectRoot = resolve(currentDir, '..', '..');
    const learnDir = resolve(projectRoot, 'Learn');

    const entries = await readdir(learnDir);
    const htmlFiles = entries.filter((f) => f.endsWith('.html'));

    const sevenDaysAgo = Date.now() - 7 * 86_400_000;

    const artifacts: LearnArtifact[] = [];
    for (const filename of htmlFiles) {
      const filePath = resolve(learnDir, filename);
      const s = await stat(filePath);
      if (s.mtimeMs >= sevenDaysAgo) {
        artifacts.push({
          filename,
          title: learnFilenameToTitle(filename),
          modifiedDate: s.mtime.toISOString().split('T')[0],
          githubUrl: `${LEARN_GITHUB_BASE}/${filename}`,
        });
      }
    }

    // Sort newest-first, cap at 8
    artifacts.sort((a, b) => b.modifiedDate.localeCompare(a.modifiedDate));
    return { artifacts: artifacts.slice(0, 8) };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.warn('Learn artifacts collection failed (non-critical)', { error: msg });
    return { artifacts: [] };
  }
}

// ============================================================================
// HIL (HUMAN-IN-THE-LOOP) TODO COLLECTOR
// ============================================================================

/** Read at call time so callers (e.g. scripts) can load .env before imports resolve. */
function getSupabaseRestConfig(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

/**
 * Upsert a HIL todo into Supabase via PostgREST.
 * Uses dedup_key for idempotency — safe to call on every briefing run.
 * When done_at is NULL a new todo is created; if the dedup_key already exists
 * and is still open the row is left untouched (on_conflict=ignore).
 */
async function upsertHilTodo(todo: {
  category: string;
  description: string;
  context: Record<string, unknown>;
  dedup_key: string;
}): Promise<void> {
  const cfg = getSupabaseRestConfig();
  if (!cfg) return;
  const { url, key } = cfg;

  try {
    await fetch(`${url}/rest/v1/hil_todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'resolution=ignore-duplicates', // don't overwrite existing open todos
      },
      body: JSON.stringify(todo),
    });
  } catch {
    // best-effort — a failing upsert must not break the briefing
  }
}

/**
 * Migration probes: detect whether a key migration has been applied by checking
 * if a representative table or column exists via PostgREST.
 * Returns list of migration IDs that appear to be missing.
 */
async function detectMissingMigrations(): Promise<Array<{ id: string; description: string }>> {
  const cfg = getSupabaseRestConfig();
  if (!cfg) return [];

  const { url, key } = cfg;
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };

  async function tableExists(table: string): Promise<boolean> {
    try {
      const r = await fetch(`${url}/rest/v1/${table}?limit=0`, { headers });
      return r.ok;
    } catch {
      return true;
    } // network error → assume exists, don't spam todos
  }

  async function columnExists(table: string, column: string): Promise<boolean> {
    try {
      const r = await fetch(`${url}/rest/v1/${table}?select=${column}&limit=1`, { headers });
      return r.ok;
    } catch {
      return true;
    }
  }

  const checks: Array<{ id: string; check: () => Promise<boolean>; description: string }> = [
    {
      id: '030',
      check: () => tableExists('agent_activity'),
      description:
        'Run migration 030_agent_logging_tables.sql — creates agent_activity, agent_logs, agent_executions',
    },
    {
      id: '032',
      check: () => columnExists('persons', 'phone'),
      description:
        'Run migration 032_add_person_phone.sql — adds phone column to persons (enables direct calls from briefing)',
    },
    {
      id: '034',
      check: () => tableExists('social_posts'),
      description: 'Run migration 034_social_posts.sql — creates social_posts queue table',
    },
    {
      id: '036',
      check: () => tableExists('construction_leads'),
      description:
        'Run migration 036_construction_leads.sql — creates construction_leads (TED EU tenders) table',
    },
    // Migration 037 (resend_email_id) removed — Resend SDK removed 2026-03-26 for security.
    // Email delivery tracking now uses SES message IDs via email-audit.jsonl.
  ];

  const missing: Array<{ id: string; description: string }> = [];
  await Promise.all(
    checks.map(async (c) => {
      const exists = await c.check();
      if (!exists) missing.push({ id: c.id, description: c.description });
    }),
  );
  return missing;
}

/**
 * Collect open HIL todos.
 *
 * Sources:
 *  1. Auto-detect missing migrations via PostgREST table/column probes
 *  2. competitor_products rows where price_value IS NULL (last 8 days)
 *  3. Monday reminder → review weekly market brief
 *  4. All open hil_todos already in the table (from other sources / previous runs)
 *
 * Returns open todos sorted oldest-first (most overdue at top).
 */
async function collectHilTodos(): Promise<HilTodosData> {
  const backendUrl = process.env.BACKEND_URL || 'https://api.onelifetime.world';

  const cfg = getSupabaseRestConfig();
  if (!cfg) {
    return { todos: [], backendUrl };
  }
  const { url: supabaseUrl, key: supabaseKey } = cfg;

  const eightDaysAgo = new Date(Date.now() - 8 * 86_400_000).toISOString();

  // 0. Auto-detect missing migrations
  const missingMigrations = await detectMissingMigrations();
  await Promise.all(
    missingMigrations.map((m) =>
      upsertHilTodo({
        category: 'pending_migration',
        description: m.description,
        context: { migration_id: m.id },
        dedup_key: `pending_migration:${m.id}`,
      }),
    ),
  );

  // 1. Find competitors with null price from the last collection run
  try {
    const nullPricesResp = await fetch(
      `${supabaseUrl}/rest/v1/competitor_products` +
        `?select=product_name,collected_at` +
        `&price_value=is.null` +
        `&collected_at=gte.${eightDaysAgo}` +
        `&order=collected_at.desc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
    );

    if (nullPricesResp.ok) {
      const rows = (await nullPricesResp.json()) as Array<{
        product_name: string;
        collected_at: string;
      }>;
      // Upsert one HIL todo per competitor with null price
      await Promise.all(
        rows.map((r) =>
          upsertHilTodo({
            category: 'competitor_price',
            description: `Fill price manually in Supabase → competitor_products for: ${r.product_name}`,
            context: { competitor_name: r.product_name, collected_at: r.collected_at },
            dedup_key: `competitor_price:${r.product_name}`,
          }),
        ),
      );
    }
  } catch {
    // best-effort
  }

  // 2. Monday: remind to review the weekly market brief
  const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon
  if (dayOfWeek === 1) {
    const now = new Date();
    const week = Math.ceil(
      ((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86_400_000 + 1) / 7,
    );
    await upsertHilTodo({
      category: 'market_brief',
      description: `Review weekly market brief → docs/market-research/${now.getFullYear()}-W${String(week).padStart(2, '0')}-market-brief.md`,
      context: { week, year: now.getFullYear() },
      dedup_key: `market_brief:${now.getFullYear()}-W${String(week).padStart(2, '0')}`,
    });
  }

  // 3. DGX Spark model status — check heartbeat for missing/degraded models
  try {
    const dgxHeartbeatUrl = process.env.DGX_SPARK_HEARTBEAT_URL || 'http://localhost:9999';
    const statusResp = await fetch(`${dgxHeartbeatUrl}/status`, {
      signal: AbortSignal.timeout(5000),
    });
    if (statusResp.ok) {
      const status = (await statusResp.json()) as {
        system: string;
        services: Array<{ name: string; status: string }>;
        models: Record<string, string>;
      };
      // If Ollama service is down, create a TODO
      const ollamaService = status.services?.find((s) => s.name === 'ollama');
      if (ollamaService && ollamaService.status === 'down') {
        await upsertHilTodo({
          category: 'model_update',
          description:
            'DGX Spark: Ollama service is DOWN — models unavailable. SSH in and check: systemctl status ollama',
          context: { system: status.system, services: status.services },
          dedup_key: `model_update:ollama_down:${new Date().toISOString().slice(0, 10)}`,
        });
      }
      // If system is degraded, flag it
      if (status.system === 'degraded') {
        const downServices = status.services
          ?.filter((s) => s.status === 'down')
          .map((s) => s.name)
          .join(', ');
        await upsertHilTodo({
          category: 'model_update',
          description: `DGX Spark DEGRADED — down services: ${downServices}`,
          context: { system: status.system, downServices },
          dedup_key: `model_update:degraded:${new Date().toISOString().slice(0, 10)}`,
        });
      }
    }
  } catch {
    // DGX Spark unreachable — create a TODO so HIL knows
    await upsertHilTodo({
      category: 'model_update',
      description:
        'DGX Spark heartbeat UNREACHABLE — check if machine is online and heartbeat container is running',
      context: { checked_at: new Date().toISOString() },
      dedup_key: `model_update:unreachable:${new Date().toISOString().slice(0, 10)}`,
    });
  }

  // 4. Fetch all open todos from the table (oldest first)
  try {
    const openResp = await fetch(
      `${supabaseUrl}/rest/v1/hil_todos` +
        `?select=id,category,description,context,done_token,created_at` +
        `&done_at=is.null` +
        `&order=created_at.asc` +
        `&limit=20`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
    );

    if (openResp.ok) {
      const todos = (await openResp.json()) as HilTodo[];
      return { todos, backendUrl };
    }
  } catch {
    // best-effort
  }

  return { todos: [], backendUrl };
}

// ============================================================================
// MARKET SIGNALS COLLECTOR
// ============================================================================

/**
 * Collect cross-vertical market/incident signals produced by
 * scripts/daily/news-to-signal.sh, which writes alerts-YYYY-MM-DD.jsonl to
 * logs/news-signals/ (DGX Spark local disk — day-runner.sh runs the scanner
 * and this collector on the same box, so the path is shared, not fetched
 * over the network). Reads the last 3 days of alert files so a signal isn't
 * missed if the briefing runs slightly before/after the scan window.
 *
 * Was previously generated but never surfaced anywhere — this collector
 * closes that gap (found during the 2026-07-12 stalled-briefing audit).
 */
async function collectMarketSignals(): Promise<MarketSignalsData> {
  try {
    const currentDir =
      typeof __dirname !== 'undefined' ? __dirname : resolve(fileURLToPath(import.meta.url), '..');
    const projectRoot = resolve(currentDir, '..', '..');
    const logDir = resolve(projectRoot, 'logs', 'news-signals');

    const signals: MarketSignalItem[] = [];
    let scannedAt: string | null = null;

    for (let daysAgo = 0; daysAgo < 3; daysAgo++) {
      const d = new Date(Date.now() - daysAgo * 86_400_000);
      const dateStamp = d.toISOString().split('T')[0];
      const alertsPath = resolve(logDir, `alerts-${dateStamp}.jsonl`);

      let raw: string;
      try {
        raw = await readFile(alertsPath, 'utf-8');
      } catch {
        continue; // no scan output for this day — not an error, just nothing to report
      }

      for (const line of raw.split('\n')) {
        if (!line.trim()) continue;
        try {
          const alert = JSON.parse(line) as {
            timestamp: string;
            title: string;
            cascade_score: number;
            industries: string;
            dual_use: boolean;
          };
          signals.push({
            timestamp: alert.timestamp,
            title: alert.title,
            source: 'news-to-signal',
            industries: alert.industries || '',
            dual_use: Boolean(alert.dual_use),
            cascade_score: alert.cascade_score || 0,
          });
          if (!scannedAt || alert.timestamp > scannedAt) scannedAt = alert.timestamp;
        } catch {
          // malformed line — skip, don't fail the whole collector over one bad row
        }
      }
    }

    signals.sort((a, b) => b.cascade_score - a.cascade_score);
    return { signals: signals.slice(0, 8), scannedAt };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.warn('Market signals collection failed (non-critical)', { error: msg });
    return { signals: [], scannedAt: null };
  }
}

// ============================================================================
// MAIN COLLECTOR
// ============================================================================

/**
 * Collect all CEO cockpit data in parallel.
 */
export async function collectCockpitData(): Promise<CockpitData> {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const dateFormatted = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dayOfWeek = now.toLocaleDateString('en-GB', { weekday: 'short' });

  const [
    changes,
    bets,
    risk,
    momentum,
    metrics,
    sendList,
    workflow,
    constructionLeads,
    outreachSummary,
    captainInquiries,
    webLeads,
    learnArtifacts,
    hilTodos,
    marketSignals,
  ] = await Promise.all([
    collectThreeChanges(),
    collectTodaysBets(),
    collectTopRisk(),
    collectMomentum(),
    collectMetrics(),
    collectSendList(),
    collectWorkflowData(),
    collectConstructionLeads(),
    collectOutreachSummary(),
    collectCaptainInquiries(),
    collectWebLeads(),
    collectLearnArtifacts(),
    collectHilTodos(),
    collectMarketSignals(),
  ]);

  // Heartbeat upsert — prevents Supabase from pausing due to inactivity
  await supabaseUpsertHeartbeat();

  return {
    date,
    dateFormatted,
    dayOfWeek,
    changes,
    bets,
    risk,
    momentum,
    metrics,
    sendList,
    workflow,
    constructionLeads,
    outreachSummary,
    captainInquiries,
    webLeads,
    learnArtifacts,
    hilTodos,
    marketSignals,
  };
}

async function supabaseUpsertHeartbeat(): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return;

  try {
    await fetch(`${url}/rest/v1/system_heartbeat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: 'dws6',
        last_beat: new Date().toISOString(),
        source: 'morning-briefing',
        version: process.env.npm_package_version || 'unknown',
      }),
    });
  } catch (err) {
    logger.warn('Heartbeat upsert failed', {
      error: err instanceof Error ? err.message : 'unknown',
    });
  }
}
